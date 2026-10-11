import { createRef } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  VirtualGrid,
  VirtualList,
  type VirtualListHandle,
} from "./virtual-list";

const TEST_RECT = { width: 900, height: 600 } as const;

function getItemKey(item: string): string {
  return item;
}

describe("VirtualList", () => {
  it("renders only the visible window", () => {
    const items = Array.from({ length: 500 }, (_, index) => `row-${index}`);

    render(
      <VirtualList
        items={items}
        getKey={getItemKey}
        estimateSize={100}
        overscan={2}
        __testRect={TEST_RECT}
        renderItem={({ item }) => <div data-testid="row">{item}</div>}
      />,
    );

    expect(screen.getAllByTestId("row").length).toBeLessThan(40);
    expect(screen.getByText("row-0")).toBeInTheDocument();
    expect(screen.queryByText("row-250")).not.toBeInTheDocument();
  });

  it("exposes scrollToIndex for keyboard navigation", async () => {
    const items = Array.from({ length: 500 }, (_, index) => `row-${index}`);
    const ref = createRef<VirtualListHandle>();

    render(
      <VirtualList
        ref={ref}
        items={items}
        getKey={getItemKey}
        estimateSize={100}
        overscan={2}
        __testRect={TEST_RECT}
        renderItem={({ item }) => <div>{item}</div>}
      />,
    );

    act(() => ref.current?.scrollToIndex(250));

    await waitFor(() => {
      expect(screen.getByText("row-250")).toBeInTheDocument();
    });
  });
});

describe("VirtualGrid", () => {
  it("virtualizes rows while preserving grid cells", () => {
    const items = Array.from({ length: 500 }, (_, index) => `card-${index}`);

    render(
      <VirtualGrid
        items={items}
        getKey={getItemKey}
        estimateSize={120}
        overscan={2}
        gapPx={12}
        minColumnWidthPx={280}
        __testRect={TEST_RECT}
        renderItem={({ item }) => <div data-testid="card">{item}</div>}
      />,
    );

    expect(screen.getAllByTestId("card").length).toBeLessThan(60);
    expect(screen.getByText("card-0")).toBeInTheDocument();
    expect(screen.queryByText("card-250")).not.toBeInTheDocument();
  });
});
