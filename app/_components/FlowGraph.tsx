import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";

import { items, uiText, workstations } from "../_services/catalog";
import { formatRate } from "../_services/planner";
import type { ItemId, Language, PlanNode, Recipe } from "../_services/types";

export function FlowGraph({
  language,
  targetItem,
  tree,
}: {
  language: Language;
  targetItem: ItemId;
  tree: PlanNode;
}) {
  const text = uiText[language];
  const numberLocale = language === "de" ? "de-DE" : "en-US";
  const boardRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const nodeWidth = 248;
  const nodeHeight = 118;
  const rowGap = 164;
  const padding = 46;
  const graphNodes = new Map<
    string,
    {
      id: string;
      column: number;
      row: number;
      type: "source" | "machine" | "output";
      item: ItemId;
      recipe?: Recipe;
      rate: number;
      machines: number;
    }
  >();
  const edges: {
    id: string;
    from: string;
    to: string;
    item: ItemId;
    rate: number;
    color: string;
  }[] = [];
  let nextRow = 0;
  let maxDepth = 0;

  function measure(node: PlanNode, depth: number) {
    maxDepth = Math.max(maxDepth, depth);
    node.children.forEach((child) => measure(child, depth + 1));
  }

  function place(node: PlanNode, depth: number): { id: string; row: number } {
    if (!node.recipe || node.cycle) {
      const id = `source:${node.key}`;
      const row = nextRow;
      nextRow += 1;
      graphNodes.set(id, {
        id,
        column: maxDepth - depth,
        row,
        type: "source",
        item: node.item,
        rate: node.rate,
        machines: 0,
      });

      return { id, row };
    }

    const childRefs = node.children.map((child) => place(child, depth + 1));
    const row =
      childRefs.length > 0
        ? childRefs.reduce((sum, child) => sum + child.row, 0) / childRefs.length
        : nextRow++;
    const id = `machine:${node.key}`;

    graphNodes.set(id, {
      id,
      column: maxDepth - depth,
      row,
      type: "machine",
      item: node.item,
      recipe: node.recipe,
      rate: node.rate,
      machines: node.machines,
    });

    childRefs.forEach((childRef, index) => {
      const child = node.children[index];
      edges.push({
        id: `${childRef.id}->${id}`,
        from: childRef.id,
        to: id,
        item: child.item,
        rate: child.rate,
        color: child.recipe ? "#6cb7be" : "#d59a5b",
      });
    });

    return { id, row };
  }

  measure(tree, 0);
  const columnGap = maxDepth > 3 ? 390 : 430;
  const root = place(tree, 0);
  const outputId = "output";
  const outputColumn = maxDepth + 1;

  graphNodes.set(outputId, {
    id: outputId,
    column: outputColumn,
    row: root.row,
    type: "output",
    item: targetItem,
    rate: tree.rate,
    machines: 0,
  });
  edges.push({
    id: `${root.id}->${outputId}`,
    from: root.id,
    to: outputId,
    item: targetItem,
    rate: tree.rate,
    color: "#7cc66f",
  });

  const nodes = [...graphNodes.values()];
  const width = padding * 2 + outputColumn * columnGap + nodeWidth;
  const contentHeight =
    padding * 2 + Math.max(1, nextRow) * rowGap + nodeHeight - rowGap;
  const height = Math.max(360, contentHeight);
  const verticalOffset = (height - contentHeight) / 2;
  const contentLeft = `max(0px, calc((100% - ${width}px) / 2))`;

  useEffect(() => {
    function handleFullscreenChange() {
      const active = document.fullscreenElement === boardRef.current;
      setFullscreen(active);

      if (!active) {
        setPan({ x: 0, y: 0 });
        setZoom(1);
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    function preventPageWheel(event: globalThis.WheelEvent) {
      event.preventDefault();
    }

    viewport.addEventListener("wheel", preventPageWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", preventPageWheel);
    };
  }, []);

  function updateZoom(direction: "in" | "out") {
    setZoom((current) => {
      const next = direction === "in" ? current + 0.15 : current - 0.15;
      return Math.min(1.75, Math.max(0.45, Number(next.toFixed(2))));
    });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();

    const viewport = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - viewport.left;
    const pointerY = event.clientY - viewport.top;
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const nextZoom = Math.min(
      1.75,
      Math.max(0.45, Number((zoom * zoomFactor).toFixed(2))),
    );

    if (nextZoom === zoom) {
      return;
    }

    const contentX = (pointerX - pan.x) / zoom;
    const contentY = (pointerY - pan.y) / zoom;

    setZoom(nextZoom);
    setPan({
      x: pointerX - contentX * nextZoom,
      y: pointerY - contentY * nextZoom,
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) {
      return;
    }

    setPan({
      x: dragRef.current.originX + event.clientX - dragRef.current.startX,
      y: dragRef.current.originY + event.clientY - dragRef.current.startY,
    });
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) {
      return;
    }

    dragRef.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  }

  async function toggleFullscreen() {
    if (!boardRef.current) {
      return;
    }

    if (document.fullscreenElement === boardRef.current) {
      await document.exitFullscreen();
      return;
    }

    await boardRef.current.requestFullscreen();
  }

  function position(node: (typeof nodes)[number]) {
    return {
      x: padding + node.column * columnGap,
      y: verticalOffset + padding + node.row * rowGap,
    };
  }

  return (
    <div className="flow-board relative overflow-hidden" ref={boardRef}>
      <div className="absolute left-3 top-3 z-40 flex items-center gap-1 rounded-md border border-white/15 bg-[#17221d]/82 p-1 shadow-lg shadow-black/25 backdrop-blur-md">
        <button
          aria-label="Zoom out"
          className="flow-control-button"
          title="Zoom out"
          type="button"
          onClick={() => updateZoom("out")}
        >
          <span aria-hidden="true" className="flow-control-symbol">-</span>
        </button>
        <div className="grid h-8 min-w-12 place-items-center px-1 text-xs font-bold text-[#f7f3e8]">
          {Math.round(zoom * 100)}%
        </div>
        <button
          aria-label="Zoom in"
          className="flow-control-button"
          title="Zoom in"
          type="button"
          onClick={() => updateZoom("in")}
        >
          <span aria-hidden="true" className="flow-control-symbol">+</span>
        </button>
        <button
          aria-label={fullscreen ? "Exit fullscreen" : "Open fullscreen"}
          className="flow-control-button"
          title={fullscreen ? "Exit fullscreen" : "Open fullscreen"}
          type="button"
          onClick={() => {
            void toggleFullscreen();
          }}
        >
          <span aria-hidden="true" className="flow-control-symbol">
            {fullscreen ? "×" : "⛶"}
          </span>
        </button>
      </div>
      <div
        className={`flow-viewport relative overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        ref={viewportRef}
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          height: fullscreen ? "100%" : height,
        }}
        onPointerCancel={stopDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onWheel={handleWheel}
      >
      <div
        className="relative select-none"
        style={{
          width: `max(100%, ${width}px)`,
          height,
          backgroundColor: "transparent",
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: "0 0",
          touchAction: "none",
        }}
      >
        <svg
          className="absolute top-0"
          height={height}
          style={{ left: contentLeft }}
          width={width}
        >
          <defs>
            {edges.map((edge) => (
              <marker
                key={edge.id}
                id={`arrow-${edge.id.replace(/[^a-zA-Z0-9]/g, "")}`}
                markerHeight="8"
                markerWidth="8"
                orient="auto"
                refX="7"
                refY="4"
                viewBox="0 0 8 8"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill={edge.color} />
              </marker>
            ))}
          </defs>
          {edges.map((edge) => {
            const from = graphNodes.get(edge.from);
            const to = graphNodes.get(edge.to);

            if (!from || !to) {
              return null;
            }

            const fromPosition = position(from);
            const toPosition = position(to);
            const startX = fromPosition.x + nodeWidth;
            const startY = fromPosition.y + nodeHeight / 2;
            const endX = toPosition.x;
            const endY = toPosition.y + nodeHeight / 2;
            const handle = Math.max(16, Math.min(64, (endX - startX) / 2));
            const markerId = `arrow-${edge.id.replace(/[^a-zA-Z0-9]/g, "")}`;

            return (
              <path
                d={`M ${startX} ${startY} C ${startX + handle} ${startY}, ${
                  endX - handle
                } ${endY}, ${endX - 8} ${endY}`}
                fill="none"
                key={edge.id}
                markerEnd={`url(#${markerId})`}
                stroke={edge.color}
                strokeLinecap="round"
                strokeOpacity="0.82"
                strokeWidth="3"
              />
            );
          })}
        </svg>

        {edges.map((edge) => {
          const from = graphNodes.get(edge.from);
          const to = graphNodes.get(edge.to);

          if (!from || !to) {
            return null;
          }

          const fromPosition = position(from);
          const toPosition = position(to);
          const left = (fromPosition.x + nodeWidth + toPosition.x) / 2 - 42;
          const top =
            (fromPosition.y + nodeHeight / 2 + toPosition.y + nodeHeight / 2) /
              2 -
            14;

          return (
            <div
              className="absolute z-10 flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-[#17221d]/85 px-2.5 text-xs font-bold text-[#f7f3e8] shadow-lg shadow-black/25 backdrop-blur-md"
              key={edge.id}
              style={{ left: `calc(${contentLeft} + ${left}px)`, top }}
            >
              <Image
                className="h-6 w-6 object-contain"
                src={items[edge.item].image}
                alt=""
                width={28}
                height={28}
              />
              <span>{formatRate(edge.rate, numberLocale)}/m</span>
            </div>
          );
        })}

        {nodes.map((node) => {
          const nodePosition = position(node);
          const station =
            node.recipe === undefined
              ? undefined
              : workstations[node.recipe.workstation];
          const isOutput = node.type === "output";
          const isMachine = node.type === "machine";
          const accent = isOutput ? "#7cc66f" : isMachine ? "#6cb7be" : "#d59a5b";
          const title = isOutput
            ? text.output
            : station?.name ?? text.rawSource;
          const metric = isOutput
            ? `${formatRate(node.rate, numberLocale)}/m`
            : isMachine
              ? `x ${formatRate(node.machines, numberLocale)}`
              : `${formatRate(node.rate, numberLocale)}/m`;

          return (
            <div
              className="absolute z-20 grid h-[118px] w-[248px] grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-md border bg-[#1f2d27]/82 px-4 py-3 shadow-xl shadow-black/28 backdrop-blur-md"
              key={node.id}
              style={{
                borderColor: `${accent}88`,
                left: `calc(${contentLeft} + ${nodePosition.x}px)`,
                top: nodePosition.y,
              }}
            >
              <div
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: accent }}
              />
              <div className="flex min-w-0 items-center gap-2 pl-1">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <div className="min-w-0 truncate text-[11px] font-bold uppercase leading-none text-[#d6dfd6]">
                  {title}
                </div>
              </div>
              <div className="grid min-h-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <div className="flex shrink-0 items-center gap-1 pl-1">
                  {station?.image ? (
                    <span className="dark-icon-frame grid h-12 w-12 place-items-center bg-white/8">
                      <Image
                        className="h-10 w-10 object-contain"
                        src={station.image}
                        alt=""
                        width={48}
                        height={48}
                      />
                    </span>
                  ) : null}
                  <span className="dark-icon-frame grid h-12 w-12 place-items-center">
                    <Image
                      className="h-10 w-10 object-contain"
                      src={items[node.item].image}
                      alt=""
                      width={48}
                      height={48}
                    />
                  </span>
                </div>
                <div className="min-w-0 text-[#fbf7ea]">
                  <div className="truncate text-sm font-semibold leading-5 text-[#edf4ec]">
                    {items[node.item].name}
                  </div>
                  <div className="mt-1 whitespace-nowrap text-2xl font-bold leading-none tracking-normal">
                    {metric}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
