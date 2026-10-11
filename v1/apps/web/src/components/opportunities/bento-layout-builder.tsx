"use client";

/**
 * `<BentoLayoutBuilder>` — controlled editor for a BentoLayoutPreference.
 *
 * Three panels:
 *   1. Top bar — Desktop/Mobile tab + Columns picker (2/3/4) + Reset.
 *   2. Grid editor — cells laid out on a real Tetris-style grid via
 *      react-grid-layout. Drag a cell to move it; drag its right or
 *      bottom edge to resize; neighbors push out of the way on
 *      collision (vertical compaction). Each cell has a palette icon
 *      popover for tone + an X to remove. P2+P3 of
 *      docs/bento-builder-redesign-spec.md.
 *   3. Trays — "Hidden chunks" tray (chunks in `disabled[]`, drag back
 *      into a cell) and "Mobile priority" tray (drag cells to reorder
 *      the mobile flow).
 *
 * Hybrid drag system:
 *   - react-grid-layout drives cell-level drag + resize + collision.
 *   - @dnd-kit drives chunk-chip drag (chunks moving between cells,
 *     or into the disabled tray). Chunks live INSIDE a RGL cell, so
 *     the RGL drag is scoped to the cell's grip handle via
 *     `draggableHandle` to avoid conflicts.
 *
 * The builder is fully controlled — `value` + `onChange`. The modal
 * wrapper (layout-builder-modal.tsx) owns persistence + debounce.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  GripVertical,
  Palette,
  Pencil,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GridLayout, {
  WidthProvider,
  type Layout as RGLLayout,
} from "react-grid-layout";
// NOTE: RGL ships base positioning CSS at react-grid-layout/css/styles.css
// + react-resizable/css/styles.css. Both are imported from globals.css
// rather than this file so Vitest (jsdom + Vite) doesn't trip on
// resolving the css path through pnpm's nested peers. Color overrides
// for the placeholder + handles live in globals.css under
// .bento-builder-grid so we use editorial tokens, not the library's
// hard-coded reds.

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CELL_TONES,
  type BentoCell,
  type BentoColumns,
  type BentoLayoutPreference,
  type CellTone,
} from "@/lib/opportunities/bento-layout";
import { CHUNK_LABELS, type ChunkKey } from "@/lib/opportunities/layout-chunks";
import { DEFAULT_BENTO_LAYOUT } from "@/lib/opportunities/default-bento";
import { LAYOUT_PREVIEW_OPPORTUNITY } from "@/lib/opportunities/layout-preview-fixture";
import {
  RenderChunk,
  type RenderChunkContext,
} from "@/lib/opportunities/render-chunk";

// P2 of docs/bento-builder-modal-redesign-spec.md: editor cells render
// real chunks via RenderChunk against the layout-preview fixture, so
// the canvas IS the preview. The context here mirrors what the modal
// passes to <BentoGrid> in Preview mode so both modes look identical.
const BUILDER_RENDER_CONTEXT: RenderChunkContext = {
  preview:
    LAYOUT_PREVIEW_OPPORTUNITY.summary.slice(0, 260) +
    (LAYOUT_PREVIEW_OPPORTUNITY.summary.length > 260 ? "…" : ""),
  expanded: false,
  setExpanded: () => undefined,
  tags: LAYOUT_PREVIEW_OPPORTUNITY.tags ?? [],
  payDisplayUnit: "annual",
  payDisplayCurrency: "USD",
  onAction: () => undefined,
  actionDisabled: false,
  canApply: true,
};

/**
 * react-grid-layout's WidthProvider wires the container width into the
 * grid so we don't have to compute it. It uses `window` so it only
 * runs client-side; the modal is already a client component.
 */
const ResponsiveGridLayout = WidthProvider(GridLayout);

// P2: bumped from 80 → 120 so default cells (rowSpan: 1) have enough
// vertical room to render real chunks via <RenderChunk> without
// immediately clipping their content. Cells smaller than their chunks
// still clip (overflow-hidden), which is the cue to drag the edge.
const ROW_HEIGHT_PX = 120;

const COLUMN_OPTIONS: BentoColumns[] = [2, 3, 4];

const TONE_LABELS: Record<CellTone, string> = {
  default: "Paper",
  muted: "Muted",
  accent: "Accent",
};

/**
 * P2: bento ↔ react-grid-layout adapter. Bento uses 1-indexed
 * gridCol/gridRow; RGL uses 0-indexed x/y. Conversion is straight
 * subtraction, but pinning it in one place keeps the off-by-one
 * confined.
 */
function bentoCellToRGL(cell: BentoCell): RGLLayout {
  return {
    i: cell.id,
    x: cell.gridCol - 1,
    y: cell.gridRow - 1,
    w: cell.colSpan,
    h: cell.rowSpan,
  };
}

function rglLayoutToBentoUpdates(
  layout: readonly RGLLayout[],
): Map<string, Pick<BentoCell, "gridCol" | "gridRow" | "colSpan" | "rowSpan">> {
  const updates = new Map<
    string,
    Pick<BentoCell, "gridCol" | "gridRow" | "colSpan" | "rowSpan">
  >();
  for (const item of layout) {
    updates.set(item.i, {
      gridCol: item.x + 1,
      gridRow: item.y + 1,
      colSpan: item.w,
      rowSpan: item.h,
    });
  }
  return updates;
}

export type BentoBuilderMode = "customize" | "preview";

export interface BentoLayoutBuilderProps {
  value: BentoLayoutPreference;
  onChange(next: BentoLayoutPreference): void;
  /**
   * P1 of docs/bento-builder-modal-redesign-spec.md. "customize" (default)
   * leaves all editing affordances live. "preview" freezes RGL drag +
   * resize so the canvas reads as read-only. Later phases (P2/P3) use
   * the same flag to suppress hover-revealed chrome and the hidden-
   * chunks tray when previewing.
   */
  mode?: BentoBuilderMode;
}

/**
 * Drag IDs are namespaced so the single DndContext can route droppables
 * correctly. Cell ID strings stay clean (user-facing). Chunks use
 * `chunk:<key>` and cell targets use `cell:<id>` / `disabled` /
 * `mobile-list`.
 */
const CHUNK_PREFIX = "chunk:";
const CELL_PREFIX = "cell:";
const DISABLED_TARGET = "disabled";

type ActiveTab = "desktop" | "mobile";

export function BentoLayoutBuilder({
  value,
  onChange,
  mode = "customize",
}: BentoLayoutBuilderProps) {
  const isPreview = mode === "preview";
  const [activeId, setActiveId] = useState<string | null>(null);
  // P2: signal to cells that a chunk-drag is active so empty cells can
  // surface their "Drop a chunk here" hint. We hide that hint at rest
  // — empty cells should read as empty, not as drop zones, until the
  // user actually picks up a chunk.
  const isChunkDragging = activeId?.startsWith(CHUNK_PREFIX) ?? false;
  // Split editing into two tabs so the long Mobile-priority panel
  // doesn't push the Desktop grid below the fold. User toggles between
  // them via the tab strip next to the Columns picker.
  const [activeTab, setActiveTab] = useState<ActiveTab>("desktop");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const desktop = value.desktop;
  const setDesktop = (next: typeof value.desktop) => {
    onChange({ ...value, desktop: next });
  };

  const handleColumnsChange = (cols: BentoColumns) => {
    const clamped: BentoCell[] = desktop.cells.map((cell) => {
      const colSpan = Math.min(cell.colSpan, cols);
      const maxCol = cols - colSpan + 1;
      return {
        ...cell,
        colSpan,
        gridCol: Math.min(Math.max(1, cell.gridCol), maxCol),
      };
    });
    setDesktop({ ...desktop, columns: cols, cells: clamped });
  };

  // Per §6 of opportunity-card-bento-spec.md: Reset is scoped to the
  // active tab. Desktop reset restores cells / columns / disabled but
  // leaves mobilePriority + expandedCount alone; Mobile reset restores
  // mobilePriority (filtered against current cells) + expandedCount
  // without touching desktop cells.
  const reset = () => {
    if (activeTab === "desktop") {
      onChange({
        ...value,
        desktop: {
          ...DEFAULT_BENTO_LAYOUT.desktop,
          // Preserve mobile order — the user's mobile work shouldn't
          // disappear when they reset desktop. Filter against the
          // freshly-restored cells so stale IDs don't leak through.
          mobilePriority: value.desktop.mobilePriority.filter((id) =>
            DEFAULT_BENTO_LAYOUT.desktop.cells.some((c) => c.id === id),
          ),
        },
      });
      return;
    }
    // Mobile tab: restore the default mobile flow + expandedCount,
    // filtered against whatever cells the user currently has on
    // desktop.
    const cellIdsNow = new Set(value.desktop.cells.map((c) => c.id));
    onChange({
      ...value,
      desktop: {
        ...value.desktop,
        mobilePriority: DEFAULT_BENTO_LAYOUT.desktop.mobilePriority.filter(
          (id) => cellIdsNow.has(id),
        ),
      },
      mobile: DEFAULT_BENTO_LAYOUT.mobile,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeStr = String(active.id);
    const overStr = String(over.id);

    // P3: cell-level drag is now owned by react-grid-layout via
    // onCellLayoutChange below. dnd-kit no longer touches cell IDs.

    // Mobile-priority reorder.
    if (activeStr.startsWith("mp:") && overStr.startsWith("mp:")) {
      const ids = desktop.mobilePriority;
      const oldIdx = ids.indexOf(activeStr.slice(3));
      const newIdx = ids.indexOf(overStr.slice(3));
      if (oldIdx < 0 || newIdx < 0) return;
      setDesktop({
        ...desktop,
        mobilePriority: arrayMove(ids, oldIdx, newIdx),
      });
      return;
    }

    // Chunk drag — move a chunk into a cell, or into the disabled tray.
    if (activeStr.startsWith(CHUNK_PREFIX)) {
      const chunk = activeStr.slice(CHUNK_PREFIX.length) as ChunkKey;
      moveChunk(chunk, overStr);
      return;
    }
  };

  const moveChunk = (chunk: ChunkKey, target: string) => {
    // Strip chunk from wherever it currently lives.
    const cellsStripped = desktop.cells.map((cell) => ({
      ...cell,
      chunks: cell.chunks.filter((c) => c !== chunk),
    }));
    const disabledStripped = desktop.disabled.filter((c) => c !== chunk);

    if (target === DISABLED_TARGET) {
      // Drop empty cells to keep the grid clean.
      const remainingCells = cellsStripped.filter((c) => c.chunks.length > 0);
      setDesktop({
        ...desktop,
        cells: remainingCells,
        disabled: [...disabledStripped, chunk],
        mobilePriority: desktop.mobilePriority.filter((id) =>
          remainingCells.some((c) => c.id === id),
        ),
      });
      return;
    }

    if (target.startsWith(CELL_PREFIX)) {
      const cellId = target.slice(CELL_PREFIX.length);
      const updated = cellsStripped.map((cell) =>
        cell.id === cellId
          ? { ...cell, chunks: [...cell.chunks, chunk] }
          : cell,
      );
      const cleaned = updated.filter((c) => c.chunks.length > 0);
      setDesktop({
        ...desktop,
        cells: cleaned,
        disabled: disabledStripped,
        mobilePriority: desktop.mobilePriority.filter((id) =>
          cleaned.some((c) => c.id === id),
        ),
      });
    }
  };

  const updateCell = (id: string, updates: Partial<BentoCell>) => {
    setDesktop({
      ...desktop,
      cells: desktop.cells.map((cell) =>
        cell.id === id ? { ...cell, ...updates } : cell,
      ),
    });
  };

  /**
   * P4 keyboard a11y: arrow keys on a focused cell-drag handle nudge
   * the cell by 1 grid unit; Shift+arrow resizes by 1 unit instead.
   * Bounds are clamped against the current column count + a sane
   * minimum of 1x1.
   */
  const nudgeCell = (
    id: string,
    direction: "left" | "right" | "up" | "down",
    mode: "move" | "resize",
  ) => {
    const cell = desktop.cells.find((c) => c.id === id);
    if (!cell) return;
    if (mode === "move") {
      const dx = direction === "left" ? -1 : direction === "right" ? 1 : 0;
      const dy = direction === "up" ? -1 : direction === "down" ? 1 : 0;
      const nextCol = Math.max(
        1,
        Math.min(desktop.columns - cell.colSpan + 1, cell.gridCol + dx),
      );
      const nextRow = Math.max(1, cell.gridRow + dy);
      if (nextCol === cell.gridCol && nextRow === cell.gridRow) return;
      updateCell(id, { gridCol: nextCol, gridRow: nextRow });
      return;
    }
    // Resize mode — left/up shrinks, right/down grows. Width clamps to
    // [1, columns-(gridCol-1)] so the cell stays inside the grid;
    // height clamps to [1, 8] which matches the schema's maxH.
    const dw = direction === "left" ? -1 : direction === "right" ? 1 : 0;
    const dh = direction === "up" ? -1 : direction === "down" ? 1 : 0;
    const maxW = desktop.columns - cell.gridCol + 1;
    const nextW = Math.max(1, Math.min(maxW, cell.colSpan + dw));
    const nextH = Math.max(1, Math.min(8, cell.rowSpan + dh));
    if (nextW === cell.colSpan && nextH === cell.rowSpan) return;
    updateCell(id, { colSpan: nextW, rowSpan: nextH });
  };

  const removeCell = (id: string) => {
    const cell = desktop.cells.find((c) => c.id === id);
    if (!cell) return;
    // Disabling a cell parks its chunks in the disabled tray so they
    // aren't lost; the user can re-place them later.
    const remainingCells = desktop.cells.filter((c) => c.id !== id);
    setDesktop({
      ...desktop,
      cells: remainingCells,
      disabled: [...desktop.disabled, ...cell.chunks],
      mobilePriority: desktop.mobilePriority.filter((p) => p !== id),
    });
  };

  const addCell = () => {
    const newId = `cell-${nextCellSuffix(desktop.cells)}`;
    // Drop into the next free row, full-width.
    const nextRow =
      desktop.cells.reduce(
        (max, c) => Math.max(max, c.gridRow + c.rowSpan - 1),
        0,
      ) + 1;
    setDesktop({
      ...desktop,
      cells: [
        ...desktop.cells,
        {
          id: newId,
          chunks: [],
          gridCol: 1,
          gridRow: nextRow,
          colSpan: desktop.columns,
          rowSpan: 1,
          label: "New cell",
        },
      ],
      mobilePriority: [...desktop.mobilePriority, newId],
    });
  };

  const mobilePriorityIds = useMemo(
    () => desktop.mobilePriority.map((id) => `mp:${id}`),
    [desktop.mobilePriority],
  );

  /**
   * P3: react-grid-layout `layout` array, derived from the current
   * cells on every render. We pass this to <ResponsiveGridLayout> as
   * a controlled prop so the live preview moves with the grid editor.
   */
  const rglLayout = useMemo<RGLLayout[]>(
    () => desktop.cells.map(bentoCellToRGL),
    [desktop.cells],
  );

  /**
   * RGL fires `onLayoutChange` on mount with whatever layout the
   * vertical compactor produces — that's not user intent, so we
   * suppress it. After mount, every fire is genuine drag/resize and
   * we diff against the current cells to avoid no-op onChange (which
   * would otherwise debounce-PATCH on every mount).
   */
  const rglMountedRef = useRef(false);
  const handleRGLLayoutChange = (next: readonly RGLLayout[]) => {
    if (!rglMountedRef.current) {
      rglMountedRef.current = true;
      return;
    }
    const updates = rglLayoutToBentoUpdates(next);
    let changed = false;
    const nextCells = desktop.cells.map((cell) => {
      const update = updates.get(cell.id);
      if (!update) return cell;
      if (
        update.gridCol === cell.gridCol &&
        update.gridRow === cell.gridRow &&
        update.colSpan === cell.colSpan &&
        update.rowSpan === cell.rowSpan
      ) {
        return cell;
      }
      changed = true;
      return { ...cell, ...update };
    });
    if (!changed) return;
    setDesktop({ ...desktop, cells: nextCells });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4">
        {/* P3: Preview-mode hides the editor toolbar entirely. Callers
            who pass mode="preview" directly (e.g. settings preview) get
            a chrome-free render. The modal already swaps to <BentoGrid>
            for its preview, so this is the defensive in-builder path. */}
        {!isPreview && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Tab toggle — Desktop vs Mobile editing modes. */}
              <div className="inline-flex rounded-md border bg-card p-0.5">
                {(["desktop", "mobile"] as ActiveTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                    aria-pressed={activeTab === tab}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Columns picker — only meaningful for the desktop grid. */}
              {activeTab === "desktop" && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Columns
                  </span>
                  <div className="inline-flex rounded-md border bg-card p-0.5">
                    {COLUMN_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleColumnsChange(option)}
                        className={cn(
                          "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                          desktop.columns === option
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted",
                        )}
                        aria-pressed={desktop.columns === option}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "desktop" && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={addCell}
                  className="gap-1.5 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add cell
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={reset}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
        )}

        {activeTab === "desktop" ? (
          <>
            {/* Grid editor — react-grid-layout owns the cell drag +
                resize + push-neighbors collision. Wrapping div carries
                the bento-builder-grid class for scoped CSS overrides
                of RGL's default styles. */}
            {/* P3: canvas border + tinted backdrop only in customize.
                In preview the grid sits on the modal's own paper so
                the cells read as a single card, not as cells-on-a-tray. */}
            <div
              className={cn(
                "bento-builder-grid",
                isPreview ? "p-0" : "rounded-md border bg-bg-2/40 p-3",
              )}
            >
              <ResponsiveGridLayout
                className="layout"
                layout={rglLayout}
                cols={desktop.columns}
                rowHeight={ROW_HEIGHT_PX}
                margin={[12, 12]}
                containerPadding={[0, 0]}
                draggableHandle=".bento-cell-drag-handle"
                resizeHandles={["se", "e", "s"]}
                compactType="vertical"
                preventCollision={false}
                isBounded={true}
                isDraggable={!isPreview}
                isResizable={!isPreview}
                onLayoutChange={handleRGLLayoutChange}
              >
                {desktop.cells.map((cell) => (
                  <div key={cell.id} data-cell-id={cell.id}>
                    <CellEditor
                      cell={cell}
                      mode={mode}
                      isChunkDragging={isChunkDragging}
                      onUpdate={(updates) => updateCell(cell.id, updates)}
                      onRemove={() => removeCell(cell.id)}
                      onNudge={(direction, nudgeMode) =>
                        nudgeCell(cell.id, direction, nudgeMode)
                      }
                    />
                  </div>
                ))}
              </ResponsiveGridLayout>
            </div>

            {/* Disabled tray — customize only. Preview is a read-only
                surface so the "hidden chunks you could drag in" rail
                isn't useful there. */}
            {!isPreview && <DisabledTray chunks={desktop.disabled} />}
          </>
        ) : (
          /* Mobile priority */
          <div className="rounded-md border bg-card p-3">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Mobile priority
              </p>
              <p className="text-xs text-muted-foreground">
                First {value.mobile.expandedCount} cells expand on phones; rest
                collapse.
              </p>
            </div>
            <SortableContext
              items={mobilePriorityIds}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-1">
                {desktop.mobilePriority.map((cellId, idx) => {
                  const cell = desktop.cells.find((c) => c.id === cellId);
                  if (!cell) return null;
                  return (
                    <MobilePriorityRow
                      key={cellId}
                      cellId={cellId}
                      label={cell.label || cell.id}
                      index={idx}
                      expanded={idx < value.mobile.expandedCount}
                    />
                  );
                })}
              </ul>
            </SortableContext>
          </div>
        )}
      </div>
      {/* Note about active drag: dnd-kit handles the visual via its
          sortable transform; we don't need a DragOverlay for this UX. */}
      <span className="sr-only" aria-live="polite">
        {activeId ? `Dragging ${activeId}` : ""}
      </span>
    </DndContext>
  );
}

/**
 * One editable cell. P3 simplification:
 * - Cell positioning + sizing is owned by react-grid-layout in the
 *   parent. CellEditor no longer carries any drag handles for itself;
 *   the `.bento-cell-drag-handle` grip below is what RGL latches onto
 *   for drag-to-move (resize is on the cell edges, drawn by RGL).
 * - SpanPickers (Cols/Rows numeric dropdowns) are gone. Sizing is
 *   direct manipulation now.
 * - Tone Select dropdown is replaced by a palette icon + popover (P2).
 *
 * The cell still acts as a dnd-kit droppable target so chunk chips
 * dragged from another cell or from the Hidden tray land here. Chunks
 * inside the cell remain sortable via @dnd-kit.
 */
function CellEditor({
  cell,
  mode,
  isChunkDragging,
  onUpdate,
  onRemove,
  onNudge,
}: {
  cell: BentoCell;
  mode: BentoBuilderMode;
  isChunkDragging: boolean;
  onUpdate(updates: Partial<BentoCell>): void;
  onRemove(): void;
  onNudge(
    direction: "left" | "right" | "up" | "down",
    mode: "move" | "resize",
  ): void;
}) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `${CELL_PREFIX}${cell.id}`,
  });

  const tone = cell.tone ?? "default";
  const isCustomize = mode === "customize";
  // P2: label edit is an explicit affordance, not an always-on input.
  // Click the pencil in the chrome cluster to swap the read-only
  // eyebrow for an input; blur or Enter/Escape saves and closes.
  const [editingLabel, setEditingLabel] = useState(false);

  /**
   * P4 keyboard a11y (kept from prior spec): arrow keys nudge cell
   * position; Shift+arrow resizes. The handler lives on the grip
   * button so users tab to a cell's drag handle, then use the keyboard
   * like they would the mouse.
   */
  const handleGripKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const direction = (
      {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      } as const
    )[event.key];
    if (!direction) return;
    event.preventDefault();
    onNudge(direction, event.shiftKey ? "resize" : "move");
  };

  return (
    <div
      ref={setDropRef}
      className={cn(
        // group/cell so the hover-reveal chrome cluster can react to
        // any pointer or focus inside the cell. relative so the
        // absolute-positioned chrome anchors to the cell. overflow-
        // hidden clips real chunk content to the cell's RGL-assigned
        // height — undersized cells show their content getting cut
        // off, which is the direct-manipulation cue to drag the bottom
        // edge to grow the cell.
        "group/cell relative flex h-full flex-col overflow-hidden rounded-md bg-paper p-3",
        // P3: cell border only in Customize. Preview cells sit flush
        // so the surface reads like the shipped review card, not like
        // a grid of separate panes.
        isCustomize ? "border" : "border-0",
        tone === "muted" && "bg-rule-strong-bg",
        tone === "accent" && "border-brand bg-brand-soft/40",
        isOver && "ring-2 ring-primary ring-offset-1",
      )}
    >
      {/* Optional label eyebrow — only renders when set; no
          placeholder. Click the pencil in the chrome cluster to edit. */}
      {cell.label && !editingLabel && (
        <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {cell.label}
        </p>
      )}
      {editingLabel && (
        <input
          autoFocus
          type="text"
          value={cell.label ?? ""}
          onChange={(event) =>
            onUpdate({ label: event.target.value || undefined })
          }
          onBlur={() => setEditingLabel(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              event.preventDefault();
              setEditingLabel(false);
            }
          }}
          aria-label="Cell label"
          className="mb-2 bg-transparent font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-foreground focus:outline-none"
        />
      )}

      {/* Chunk content — rendered via RenderChunk so the editor is the
          preview. Each chunk wraps in a DraggableChunk that adds a
          hover-revealed grip for dnd-kit drag-between-cells. */}
      <SortableContext
        items={cell.chunks.map((c) => `${CHUNK_PREFIX}${c}`)}
        strategy={rectSortingStrategy}
      >
        <div className="flex min-h-[40px] flex-1 flex-col gap-2">
          {cell.chunks.length === 0
            ? // Empty cells stay empty at rest. The "Drop a chunk
              // here" hint only renders while a chunk-drag is active
              // so the canvas reads as a card, not as a dropzone grid.
              isChunkDragging && (
                <div className="flex flex-1 items-center justify-center rounded border border-dashed border-rule p-3 text-[11px] text-muted-foreground">
                  Drop a chunk here
                </div>
              )
            : cell.chunks.map((chunk) => (
                <DraggableChunk key={chunk} chunk={chunk} />
              ))}
        </div>
      </SortableContext>

      {/* Always-visible chrome cluster (v2 — was hover-reveal in P2).
          Customize-mode only; Preview mode (defensive path for direct
          callers) keeps the cell clean. Subtle styling so it doesn't
          fight the chunk content: no shadow, light translucent paper
          background, small icons. */}
      {isCustomize && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-md border bg-paper/80 px-1 py-0.5 backdrop-blur">
          <button
            type="button"
            onKeyDown={handleGripKeyDown}
            className="bento-cell-drag-handle cursor-grab rounded p-1 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing"
            aria-label={`Drag cell ${cell.label || cell.id}. Arrow keys move, shift+arrow resizes.`}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEditingLabel(true)}
            aria-label="Edit cell label"
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <TonePalette
            value={tone}
            onChange={(next) =>
              onUpdate({ tone: next === "default" ? undefined : next })
            }
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove cell (chunks return to Hidden)"
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * P2: palette icon + 3-swatch popover. Replaces the Paper/Muted/Accent
 * dropdown that was taking the same space as the drag handle. Lives
 * inline because we don't have a shared Popover primitive yet — the
 * outside-click effect closes the menu when the user clicks elsewhere.
 */
function TonePalette({
  value,
  onChange,
}: {
  value: CellTone;
  onChange(next: CellTone): void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Cell tone (${TONE_LABELS[value]}) — click to change`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Tone: ${TONE_LABELS[value]}`}
        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Palette className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 flex gap-1 rounded-md border bg-card p-1 shadow-sm"
        >
          {CELL_TONES.map((tone) => (
            <button
              key={tone}
              type="button"
              role="menuitemradio"
              aria-checked={value === tone}
              onClick={() => {
                onChange(tone);
                setOpen(false);
              }}
              className={cn(
                "h-6 w-6 rounded border transition-all",
                tone === "default" && "bg-paper",
                tone === "muted" && "bg-rule-strong-bg",
                tone === "accent" && "border-brand bg-brand-soft",
                value === tone && "ring-2 ring-primary ring-offset-1",
              )}
              title={TONE_LABELS[tone]}
            >
              <span className="sr-only">{TONE_LABELS[tone]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * P2: chunks render their real shipped JSX via <RenderChunk> against
 * the layout-preview fixture. The wrapper adds a hover-revealed grip
 * handle on the left so users can pick the chunk up and drag it to
 * another cell — same dnd-kit drag flow as before, just with the
 * affordance hidden until hover so the editor reads as a real card.
 *
 * aria-label on the grip stays "Drag <Chunk Label>" because:
 *   - dnd-kit's KeyboardSensor announces it when grabbed with Space.
 *   - existing tests pin this contract.
 */
function DraggableChunk({ chunk }: { chunk: ChunkKey }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${CHUNK_PREFIX}${chunk}` });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/chunk relative rounded border border-transparent px-2 py-1 transition-colors hover:border-rule",
        // v2: compact chunk rendering inside the editor — title chunk
        // shrinks from text-2xl/md:text-4xl to text-lg/md:text-2xl so
        // the bento example reads as a "mini" version of the shipped
        // card, not as a full-size card crammed into a cell.
        "[&_h2]:!text-lg [&_h2]:!leading-tight [&_h2]:md:!text-2xl",
        isDragging && "opacity-40",
      )}
    >
      <RenderChunk
        chunk={chunk}
        opportunity={LAYOUT_PREVIEW_OPPORTUNITY}
        context={BUILDER_RENDER_CONTEXT}
      />
      {/* Grip handle — hidden by default; reveals on chunk hover.
          Carries the dnd-kit listeners + attributes so the user can
          grab + drag from here. */}
      <button
        type="button"
        aria-label={`Drag ${CHUNK_LABELS[chunk]}`}
        className="absolute left-[-18px] top-1/2 -translate-y-1/2 cursor-grab rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover/chunk:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </button>
    </div>
  );
}

/**
 * P4 of docs/bento-builder-modal-redesign-spec.md: tray of chunks
 * that aren't on the card. Was a row of strikethrough chips that
 * read as "deleted". Now renders visual cards that read as
 * "available to add" — drag any onto a cell to enable.
 *
 * Drop target on the tray itself stays: drag a chunk out of a cell
 * onto the tray to hide it.
 */
function DisabledTray({ chunks }: { chunks: ChunkKey[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: DISABLED_TARGET });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-md border bg-card p-4",
        // P4: drop highlight uses primary ring instead of destructive
        // ring. Hiding a chunk isn't a destructive act — the chunk
        // stays available on this same tray.
        isOver && "ring-2 ring-primary ring-offset-1",
      )}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Available chunks
        </p>
        <p className="text-xs text-muted-foreground">
          Drag onto the card to add. Drag a chunk back here to hide.
        </p>
      </div>
      {chunks.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Everything is on the card.
        </p>
      ) : (
        <SortableContext
          items={chunks.map((c) => `${CHUNK_PREFIX}${c}`)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-2">
            {chunks.map((chunk) => (
              <HiddenChunkCard key={chunk} chunk={chunk} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

/**
 * P4: visual card replacement for the old strikethrough chip. Reads
 * as "available to add" — a Plus icon top-left, the chunk label
 * underneath, generous tap target. Carries the same dnd-kit drag
 * payload as cell chunks, so dropping onto a cell adds it there.
 */
function HiddenChunkCard({ chunk }: { chunk: ChunkKey }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${CHUNK_PREFIX}${chunk}` });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      className={cn(
        "group/card flex h-16 w-28 cursor-grab flex-col items-start justify-between rounded-md border bg-paper p-2 text-left transition-all hover:border-brand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
      aria-label={`Drag ${CHUNK_LABELS[chunk]} into a cell`}
      {...attributes}
      {...listeners}
    >
      <Plus className="h-3 w-3 text-muted-foreground transition-colors group-hover/card:text-brand" />
      <span className="line-clamp-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-foreground">
        {CHUNK_LABELS[chunk]}
      </span>
    </button>
  );
}

function MobilePriorityRow({
  cellId,
  label,
  index,
  expanded,
}: {
  cellId: string;
  label: string;
  index: number;
  expanded: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `mp:${cellId}` });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded border bg-card px-2 py-1.5",
        isDragging && "opacity-40",
      )}
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={`Drag ${label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex-1 truncate text-sm">{label}</span>
      {expanded ? (
        <span className="inline-flex items-center gap-1 text-[10px] text-primary">
          <Eye className="h-3 w-3" />
          Above fold
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <EyeOff className="h-3 w-3" />
          Collapsed
        </span>
      )}
    </li>
  );
}

function nextCellSuffix(cells: BentoCell[]): number {
  const used = new Set(
    cells
      .map((c) => c.id.match(/^cell-(\d+)$/)?.[1])
      .filter(Boolean)
      .map((s) => Number(s)),
  );
  let i = 1;
  while (used.has(i)) i += 1;
  return i;
}
