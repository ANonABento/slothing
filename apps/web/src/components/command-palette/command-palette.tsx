"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  ArrowRight,
  Briefcase,
  Clock,
  Database,
  FileText,
  Home,
  Search,
  Settings,
  Sparkles,
  Star,
  Upload,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildFrequentCommands,
  buildRecentCommands,
  getActionCommands,
  getNavigationCommands,
  incrementCommandUsage,
  loadFrequentActions,
  loadRecentActions,
  saveRecentAction,
  type CommandItem,
} from "@/lib/command-palette";
import { useCommandPalette } from "./use-command-palette";
import { runSearchProviders, type SearchGroup } from "./command-palette-search";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

const COMMAND_ICONS: Record<string, LucideIcon> = {
  "nav-dashboard": Home,
  "nav-documents": Database,
  "nav-studio": FileText,
  "nav-settings": Settings,
  "nav-profile": User,
  "act-new-opportunity": Briefcase,
  "act-tailor": Sparkles,
  "act-upload": Upload,
  "act-studio": FileText,
  "act-profile": User,
  "act-settings": Settings,
};

const CATEGORY_ICONS: Partial<Record<CommandItem["category"], LucideIcon>> = {
  recent: Clock,
  frequent: Star,
  opportunities: Briefcase,
  bank: Database,
  "answer-bank": FileText,
  emails: FileText,
  settings: Settings,
  actions: ArrowRight,
  navigate: ArrowRight,
};

function CommandRow({
  item,
  onSelect,
  forceMount,
}: {
  item: CommandItem;
  onSelect: (item: CommandItem) => void;
  forceMount?: boolean;
}) {
  const Icon =
    COMMAND_ICONS[item.id] ?? CATEGORY_ICONS[item.category] ?? ArrowRight;

  return (
    <Command.Item
      value={item.id}
      keywords={item.keywords}
      forceMount={forceMount}
      onSelect={() => onSelect(item)}
      className={cn(
        "flex cursor-default select-none items-center gap-3 rounded-[calc(var(--radius)-2px)] px-3 py-2.5 text-sm outline-none",
        "text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1">
        <span className="block truncate">{item.label}</span>
        {item.description ? (
          <span className="block truncate text-xs text-muted-foreground">
            {item.description}
          </span>
        ) : null}
      </span>
      {item.shortcut ? (
        <kbd className="ml-auto rounded-[calc(var(--radius)-4px)] bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {item.shortcut}
        </kbd>
      ) : null}
    </Command.Item>
  );
}

function CommandGroup({
  heading,
  items,
  onSelect,
  forceMount,
}: {
  heading: string;
  items: CommandItem[];
  onSelect: (item: CommandItem) => void;
  forceMount?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <Command.Group
      heading={heading}
      forceMount={forceMount}
      className="px-2 py-1 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
    >
      {items.map((item) => (
        <CommandRow
          key={`${heading}-${item.id}`}
          item={item}
          onSelect={onSelect}
          forceMount={forceMount}
        />
      ))}
    </Command.Group>
  );
}

export function CommandPalette() {
  const a11yT = useA11yTranslations();

  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [searchGroups, setSearchGroups] = useState<SearchGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const navigationCommands = useMemo(() => getNavigationCommands(), []);
  const actionCommands = useMemo(() => getActionCommands(), []);
  const baseCommands = useMemo(
    () => [...navigationCommands, ...actionCommands],
    [navigationCommands, actionCommands],
  );

  const recentCommands = useMemo(() => {
    if (!open) return [];
    return buildRecentCommands(loadRecentActions(), baseCommands);
  }, [baseCommands, open]);

  const frequentCommands = useMemo(() => {
    if (!open) return [];
    return buildFrequentCommands(
      loadFrequentActions(5),
      baseCommands,
      recentCommands.map((command) => command.id),
    );
  }, [baseCommands, open, recentCommands]);

  const executeCommand = useCallback(
    (item: CommandItem) => {
      saveRecentAction(item.id);
      incrementCommandUsage(item.id);
      setOpen(false);
      if (item.href) {
        router.push(item.href);
      }
    },
    [router, setOpen],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSearchGroups([]);
      setLoading(false);
      return;
    }
    setQuery("");
    setSearchGroups([]);
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setSearchGroups([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setLoading(true);
      runSearchProviders(query, controller.signal)
        .then((groups) => {
          if (!controller.signal.aborted) {
            setSearchGroups(groups);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setSearchGroups([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });
    }, 200);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [open, query]);

  const showDefaultGroups = query.trim().length < 2;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Palette"
      loop
      contentClassName="fixed left-1/2 top-[12vh] z-50 grid w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 gap-0 overflow-hidden rounded-[var(--radius)] border border-border bg-popover text-popover-foreground shadow-[var(--shadow-elevated)]"
      overlayClassName="fixed inset-0 z-50 bg-background/80"
      className="overflow-hidden"
    >
      <DialogPrimitive.Title className="sr-only">
        Command Palette
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className="sr-only">
        Search navigation, recent actions, and available workflow commands.
      </DialogPrimitive.Description>
      <div className="flex items-center border-b border-border px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder={a11yT("typeACommandOrSearch")}
          className="h-12 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded-[calc(var(--radius)-4px)] bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
          ESC
        </kbd>
      </div>

      <Command.List
        label="Command results"
        className="max-h-[min(480px,60vh)] overflow-y-auto py-2"
      >
        {loading ? (
          <Command.Loading className="px-4 py-3 text-sm text-muted-foreground">
            Searching...
          </Command.Loading>
        ) : null}

        {showDefaultGroups ? (
          <>
            <CommandGroup
              heading="Quick Actions"
              items={actionCommands}
              onSelect={executeCommand}
            />
            <CommandGroup
              heading="Recent"
              items={recentCommands}
              onSelect={executeCommand}
            />
            <CommandGroup
              heading="Frequent"
              items={frequentCommands}
              onSelect={executeCommand}
            />
          </>
        ) : (
          <>
            <CommandGroup
              heading="Quick Actions"
              items={[...actionCommands, ...navigationCommands]}
              onSelect={executeCommand}
            />
            {searchGroups.map((group) => (
              <CommandGroup
                key={group.id}
                heading={group.label}
                items={group.items}
                onSelect={executeCommand}
                forceMount
              />
            ))}
          </>
        )}

        <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
          No results found.
        </Command.Empty>
      </Command.List>

      <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <kbd className="rounded-[calc(var(--radius)-4px)] bg-muted px-1 py-0.5 font-mono">
            ↑↓
          </kbd>
          navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded-[calc(var(--radius)-4px)] bg-muted px-1 py-0.5 font-mono">
            ↵
          </kbd>
          select
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded-[calc(var(--radius)-4px)] bg-muted px-1 py-0.5 font-mono">
            esc
          </kbd>
          close
        </span>
      </div>
    </Command.Dialog>
  );
}
