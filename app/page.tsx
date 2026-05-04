"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import packageJson from "../package.json";

type ItemId =
  | "wooden-log"
  | "tree-bark"
  | "leaves"
  | "sawn-timber"
  | "wooden-panel"
  | "rope"
  | "fabric"
  | "fertiliser"
  | "ladder"
  | "wooden-blade"
  | "coal"
  | "aether-shard"
  | "aetheric-pellet"
  | "stumpy-spark"
  | "crafty-spark"
  | "carry-spark"
  | "choppy-spark"
  | "loamy-spark";

type WorkstationId =
  | "logger"
  | "sawbench"
  | "loom"
  | "cutter"
  | "wood-workshop"
  | "spark-workbench"
  | "furnace"
  | "raw";

type Ingredient = {
  item: ItemId;
  amount?: number;
  perMinuteOneStumpy?: number;
};

type Recipe = {
  id: string;
  name: string;
  product: ItemId;
  productAmount: number;
  workstation: WorkstationId;
  duration: number;
  cyclesPerMinuteOneStumpy: number;
  ingredients: Ingredient[];
  wiki: string;
};

type PlanNode = {
  key: string;
  item: ItemId;
  rate: number;
  recipe?: Recipe;
  machines: number;
  children: PlanNode[];
  cycle?: boolean;
};

type MachineSummary = {
  recipe: Recipe;
  machines: number;
  rate: number;
};

type Language = "en" | "de";

const uiText = {
  en: {
    activeTarget: "Current target",
    crewPerMachine: "Crew per machine",
    flow: "Flow",
    language: "Language",
    machineCount: "Machine count",
    machines: "Machines",
    output: "Output",
    perMachine: "per machine",
    rawDemand: "Raw demand",
    rawInputs: "Raw inputs",
    rawSource: "Raw source",
    recipeRules: "Recipe rules",
    sourcesInPlan: "Sources in plan",
    targetRate: "Target rate",
    wikiData: "Wiki data",
    with: "with",
    chooseItem: "Choose item",
    productionPlan: "Production plan",
  },
  de: {
    activeTarget: "Aktives Ziel",
    crewPerMachine: "Besetzung pro Maschine",
    flow: "Ablauf",
    language: "Sprache",
    machineCount: "Maschinenanzahl",
    machines: "Maschinen",
    output: "Output",
    perMachine: "je Maschine",
    rawDemand: "Rohbedarf",
    rawInputs: "Rohinputs",
    rawSource: "Quelle",
    recipeRules: "Rezeptregeln",
    sourcesInPlan: "Quellen im Plan",
    targetRate: "Zielrate",
    wikiData: "Wiki-Daten",
    with: "mit",
    chooseItem: "Item waehlen",
    productionPlan: "Produktionsplan",
  },
} satisfies Record<Language, Record<string, string>>;

const appVersion = packageJson.version;

const wikiBase = "https://oddsparks.wiki.gg/wiki/";

const items: Record<
  ItemId,
  { name: string; image: string; wiki: string; group: "wood" | "spark" | "raw" }
> = {
  "wooden-log": {
    name: "Wooden Log",
    image: "/oddsparks/wooden-log.png",
    wiki: `${wikiBase}Wooden_Log`,
    group: "wood",
  },
  "tree-bark": {
    name: "Tree Bark",
    image: "/oddsparks/tree-bark.png",
    wiki: `${wikiBase}Tree_Bark`,
    group: "wood",
  },
  leaves: {
    name: "Leaves",
    image: "/oddsparks/leaves.png",
    wiki: `${wikiBase}Leaves`,
    group: "wood",
  },
  "sawn-timber": {
    name: "Sawn Timber",
    image: "/oddsparks/sawn-timber.png",
    wiki: `${wikiBase}Sawn_Timber`,
    group: "wood",
  },
  "wooden-panel": {
    name: "Wooden Panel",
    image: "/oddsparks/wooden-panel.png",
    wiki: `${wikiBase}Wooden_Panel`,
    group: "wood",
  },
  rope: {
    name: "Rope",
    image: "/oddsparks/rope.png",
    wiki: `${wikiBase}Rope`,
    group: "wood",
  },
  fabric: {
    name: "Fabric",
    image: "/oddsparks/fabric.png",
    wiki: `${wikiBase}Fabric`,
    group: "wood",
  },
  fertiliser: {
    name: "Fertiliser",
    image: "/oddsparks/fertiliser.png",
    wiki: `${wikiBase}Fertiliser`,
    group: "wood",
  },
  ladder: {
    name: "Ladder",
    image: "/oddsparks/ladder.png",
    wiki: `${wikiBase}Ladder`,
    group: "wood",
  },
  "wooden-blade": {
    name: "Wooden Blade",
    image: "/oddsparks/wooden-blade.png",
    wiki: `${wikiBase}Wooden_Blade`,
    group: "wood",
  },
  coal: {
    name: "Coal",
    image: "/oddsparks/coal.png",
    wiki: `${wikiBase}Coal`,
    group: "wood",
  },
  "aether-shard": {
    name: "Aether Shard",
    image: "/oddsparks/aether-shard.png",
    wiki: `${wikiBase}Aether_Shard`,
    group: "raw",
  },
  "aetheric-pellet": {
    name: "Aetheric Pellet",
    image: "/oddsparks/aetheric-pellet.png",
    wiki: `${wikiBase}Aetheric_Pellet`,
    group: "raw",
  },
  "stumpy-spark": {
    name: "Stumpy Spark",
    image: "/oddsparks/stumpy-spark.png",
    wiki: `${wikiBase}Stumpy_Spark`,
    group: "spark",
  },
  "crafty-spark": {
    name: "Crafty Spark",
    image: "/oddsparks/crafty-spark.png",
    wiki: `${wikiBase}Crafty_Spark`,
    group: "spark",
  },
  "carry-spark": {
    name: "Carry Spark",
    image: "/oddsparks/carry-spark.png",
    wiki: `${wikiBase}Carry_Spark`,
    group: "spark",
  },
  "choppy-spark": {
    name: "Choppy Spark",
    image: "/oddsparks/choppy-spark.png",
    wiki: `${wikiBase}Choppy_Spark`,
    group: "spark",
  },
  "loamy-spark": {
    name: "Loamy Spark",
    image: "/oddsparks/loamy-spark.png",
    wiki: `${wikiBase}Loamy_Spark`,
    group: "spark",
  },
};

const workstations: Record<WorkstationId, { name: string; image?: string }> = {
  logger: { name: "Logger", image: "/oddsparks/logger.png" },
  sawbench: { name: "Sawbench", image: "/oddsparks/sawbench.png" },
  loom: { name: "Loom", image: "/oddsparks/loom.png" },
  cutter: { name: "Cutter", image: "/oddsparks/cutter.png" },
  "wood-workshop": {
    name: "Wood Workshop",
    image: "/oddsparks/wood-workshop.png",
  },
  "spark-workbench": {
    name: "Spark Workbench",
    image: "/oddsparks/spark-workbench.png",
  },
  furnace: { name: "Furnace", image: "/oddsparks/furnace.png" },
  raw: { name: "Raw source" },
};

const recipes: Recipe[] = [
  {
    id: "log-harvesting",
    name: "Log Harvesting",
    product: "wooden-log",
    productAmount: 1,
    workstation: "logger",
    duration: 2,
    cyclesPerMinuteOneStumpy: 30,
    ingredients: [],
    wiki: `${wikiBase}Logger`,
  },
  {
    id: "leaves-harvesting",
    name: "Leaves Harvesting",
    product: "leaves",
    productAmount: 1,
    workstation: "logger",
    duration: 2,
    cyclesPerMinuteOneStumpy: 30,
    ingredients: [],
    wiki: `${wikiBase}Logger`,
  },
  {
    id: "bark-harvesting",
    name: "Bark Harvesting",
    product: "tree-bark",
    productAmount: 1,
    workstation: "logger",
    duration: 2,
    cyclesPerMinuteOneStumpy: 30,
    ingredients: [],
    wiki: `${wikiBase}Logger`,
  },
  {
    id: "bark-from-log",
    name: "Tree Bark",
    product: "tree-bark",
    productAmount: 2,
    workstation: "sawbench",
    duration: 8,
    cyclesPerMinuteOneStumpy: 7.5,
    ingredients: [{ item: "wooden-log", amount: 1 }],
    wiki: `${wikiBase}Tree_Bark`,
  },
  {
    id: "sawn-timber",
    name: "Sawn Timber",
    product: "sawn-timber",
    productAmount: 1,
    workstation: "sawbench",
    duration: 16,
    cyclesPerMinuteOneStumpy: 3.75,
    ingredients: [{ item: "wooden-log", amount: 2 }],
    wiki: `${wikiBase}Sawn_Timber`,
  },
  {
    id: "wooden-panel",
    name: "Wooden Panel",
    product: "wooden-panel",
    productAmount: 1,
    workstation: "sawbench",
    duration: 8,
    cyclesPerMinuteOneStumpy: 7.5,
    ingredients: [{ item: "sawn-timber", amount: 2 }],
    wiki: `${wikiBase}Wooden_Panel`,
  },
  {
    id: "rope",
    name: "Rope",
    product: "rope",
    productAmount: 1,
    workstation: "loom",
    duration: 16,
    cyclesPerMinuteOneStumpy: 3.75,
    ingredients: [
      { item: "leaves", amount: 2 },
      { item: "tree-bark", amount: 1 },
    ],
    wiki: `${wikiBase}Rope`,
  },
  {
    id: "fabric",
    name: "Fabric",
    product: "fabric",
    productAmount: 1,
    workstation: "loom",
    duration: 8,
    cyclesPerMinuteOneStumpy: 7.5,
    ingredients: [
      { item: "tree-bark", amount: 4 },
      { item: "rope", amount: 2 },
    ],
    wiki: `${wikiBase}Fabric`,
  },
  {
    id: "fertiliser",
    name: "Fertiliser",
    product: "fertiliser",
    productAmount: 2,
    workstation: "cutter",
    duration: 24,
    cyclesPerMinuteOneStumpy: 2.5,
    ingredients: [{ item: "leaves", amount: 4 }],
    wiki: `${wikiBase}Fertiliser`,
  },
  {
    id: "ladder",
    name: "Ladder",
    product: "ladder",
    productAmount: 2,
    workstation: "wood-workshop",
    duration: 32,
    cyclesPerMinuteOneStumpy: 1.875,
    ingredients: [
      { item: "wooden-log", amount: 4 },
      { item: "sawn-timber", amount: 10 },
    ],
    wiki: `${wikiBase}Ladder`,
  },
  {
    id: "wooden-blade",
    name: "Wooden Blade",
    product: "wooden-blade",
    productAmount: 1,
    workstation: "wood-workshop",
    duration: 48,
    cyclesPerMinuteOneStumpy: 1.25,
    ingredients: [
      { item: "sawn-timber", amount: 1 },
      { item: "wooden-panel", amount: 2 },
    ],
    wiki: `${wikiBase}Wooden_Blade`,
  },
  {
    id: "coal-wood-fired",
    name: "Coal (Wood-fired)",
    product: "coal",
    productAmount: 1,
    workstation: "furnace",
    duration: 8,
    cyclesPerMinuteOneStumpy: 7.5,
    ingredients: [
      { item: "wooden-log", amount: 3 },
      { item: "wooden-log", perMinuteOneStumpy: 7.5 },
    ],
    wiki: `${wikiBase}Coal`,
  },
  {
    id: "stumpy-spark",
    name: "Stumpy Spark",
    product: "stumpy-spark",
    productAmount: 1,
    workstation: "spark-workbench",
    duration: 32,
    cyclesPerMinuteOneStumpy: 1.875,
    ingredients: [
      { item: "aether-shard", amount: 1 },
      { item: "wooden-log", amount: 5 },
    ],
    wiki: `${wikiBase}Stumpy_Spark`,
  },
  {
    id: "crafty-spark",
    name: "Crafty Spark",
    product: "crafty-spark",
    productAmount: 1,
    workstation: "spark-workbench",
    duration: 48,
    cyclesPerMinuteOneStumpy: 1.25,
    ingredients: [
      { item: "stumpy-spark", amount: 2 },
      { item: "wooden-panel", amount: 2 },
    ],
    wiki: `${wikiBase}Crafty_Spark`,
  },
  {
    id: "carry-spark",
    name: "Carry Spark",
    product: "carry-spark",
    productAmount: 1,
    workstation: "spark-workbench",
    duration: 32,
    cyclesPerMinuteOneStumpy: 1.875,
    ingredients: [
      { item: "crafty-spark", amount: 1 },
      { item: "sawn-timber", amount: 4 },
    ],
    wiki: `${wikiBase}Carry_Spark`,
  },
  {
    id: "choppy-spark",
    name: "Choppy Spark",
    product: "choppy-spark",
    productAmount: 1,
    workstation: "spark-workbench",
    duration: 64,
    cyclesPerMinuteOneStumpy: 0.9375,
    ingredients: [
      { item: "stumpy-spark", amount: 3 },
      { item: "wooden-blade", amount: 1 },
    ],
    wiki: `${wikiBase}Choppy_Spark`,
  },
  {
    id: "loamy-spark",
    name: "Loamy Spark",
    product: "loamy-spark",
    productAmount: 5,
    workstation: "spark-workbench",
    duration: 32,
    cyclesPerMinuteOneStumpy: 1.875,
    ingredients: [
      { item: "aether-shard", amount: 5 },
      { item: "fertiliser", amount: 3 },
    ],
    wiki: `${wikiBase}Loamy_Spark`,
  },
];

const outputItems = recipes
  .map((recipe) => recipe.product)
  .filter((id, index, all) => all.indexOf(id) === index);

const recipesByProduct = recipes.reduce(
  (accumulator, recipe) => {
    accumulator[recipe.product] = [...(accumulator[recipe.product] ?? []), recipe];
    return accumulator;
  },
  {} as Partial<Record<ItemId, Recipe[]>>,
);

const defaultRecipeIdByProduct: Partial<Record<ItemId, string>> = {
  "tree-bark": "bark-harvesting",
};

const crewOptions = [
  {
    id: "stumpy-1",
    label: "1 Stumpy",
    multiplier: 1,
    sparks: ["stumpy-spark"] satisfies ItemId[],
  },
  {
    id: "stumpy-2",
    label: "2 Stumpy",
    multiplier: 2,
    sparks: ["stumpy-spark", "stumpy-spark"] satisfies ItemId[],
  },
  {
    id: "crafty-1",
    label: "1 Crafty",
    multiplier: 1.5,
    sparks: ["crafty-spark"] satisfies ItemId[],
  },
  {
    id: "crafty-2",
    label: "2 Crafty",
    multiplier: 3,
    sparks: ["crafty-spark", "crafty-spark"] satisfies ItemId[],
  },
  {
    id: "mixed-1-1",
    label: "1 Stumpy + 1 Crafty",
    multiplier: 2.5,
    sparks: ["stumpy-spark", "crafty-spark"] satisfies ItemId[],
  },
] as const;

type CrewOptionId = (typeof crewOptions)[number]["id"];

function formatRate(value: number, locale = "en-US") {
  if (value >= 100) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  }).format(value);
}

function getRecipeForProduct(
  item: ItemId,
  recipeChoice: Partial<Record<ItemId, string>>,
) {
  const candidates = recipesByProduct[item] ?? [];
  const chosenId =
    recipeChoice[item] ?? defaultRecipeIdByProduct[item] ?? candidates[0]?.id;

  return candidates.find((recipe) => recipe.id === chosenId) ?? candidates[0];
}

function calculatePlan(
  item: ItemId,
  rate: number,
  crewMultiplier: number,
  recipeChoice: Partial<Record<ItemId, string>>,
) {
  const raw = new Map<ItemId, number>();
  const machines = new Map<string, MachineSummary>();

  function walk(
    current: ItemId,
    currentRate: number,
    stack: ItemId[],
    trail: string[],
  ): PlanNode {
    const recipe = getRecipeForProduct(current, recipeChoice);

    if (!recipe) {
      raw.set(current, (raw.get(current) ?? 0) + currentRate);
      return {
        key: `${trail.join(".")}.${current}.raw.${raw.size}`,
        item: current,
        rate: currentRate,
        machines: 0,
        children: [],
      };
    }

    if (stack.includes(current)) {
      raw.set(current, (raw.get(current) ?? 0) + currentRate);
      return {
        key: `${trail.join(".")}.${current}.cycle`,
        item: current,
        rate: currentRate,
        recipe,
        machines: 0,
        children: [],
        cycle: true,
      };
    }

    const outputPerMachine =
      recipe.cyclesPerMinuteOneStumpy * recipe.productAmount * crewMultiplier;
    const machineCount = currentRate / outputPerMachine;
    const previous = machines.get(recipe.id);

    machines.set(recipe.id, {
      recipe,
      machines: (previous?.machines ?? 0) + machineCount,
      rate: (previous?.rate ?? 0) + currentRate,
    });

    const children = recipe.ingredients.map((ingredient, index) => {
      const ingredientRate =
        ingredient.amount === undefined
          ? machineCount * (ingredient.perMinuteOneStumpy ?? 0) * crewMultiplier
          : (currentRate / recipe.productAmount) * ingredient.amount;

      return walk(ingredient.item, ingredientRate, [...stack, current], [
        ...trail,
        `${current}-${index}`,
      ]);
    });

    return {
      key: `${trail.join(".")}.${current}.${recipe.id}`,
      item: current,
      rate: currentRate,
      recipe,
      machines: machineCount,
      children,
    };
  }

  const tree = walk(item, rate, [], []);

  return {
    tree,
    raw: [...raw.entries()].sort((a, b) =>
      items[a[0]].name.localeCompare(items[b[0]].name),
    ),
    machines: [...machines.values()].sort((a, b) =>
      workstations[a.recipe.workstation].name.localeCompare(
        workstations[b.recipe.workstation].name,
      ),
    ),
  };
}

function ItemIcon({ item, size = "md" }: { item: ItemId; size?: "sm" | "md" }) {
  const itemData = items[item];
  const className = size === "sm" ? "h-8 w-8" : "h-12 w-12";

  return (
    <span className="icon-frame grid h-12 w-12 shrink-0 place-items-center">
      <Image
        className={`${className} object-contain [image-rendering:auto]`}
        src={itemData.image}
        alt=""
        width={48}
        height={48}
      />
    </span>
  );
}

function WorkstationIcon({ id }: { id: WorkstationId }) {
  const workstation = workstations[id];

  return (
    <span className="icon-frame grid h-11 w-11 shrink-0 place-items-center">
      {workstation.image ? (
        <Image
          className="h-10 w-10 object-contain"
          src={workstation.image}
          alt=""
          width={48}
          height={48}
        />
      ) : (
        <span className="text-sm font-semibold text-[#60482c]">R</span>
      )}
    </span>
  );
}

function FlowGraph({
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
  const nodeWidth = 232;
  const nodeHeight = 96;
  const rowGap = 140;
  const padding = 44;
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
        color: child.recipe ? "#6aa6b8" : "#d08a55",
      });
    });

    return { id, row };
  }

  measure(tree, 0);
  const columnGap = maxDepth > 3 ? 330 : 380;
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
    color: "#78c66d",
  });

  const nodes = [...graphNodes.values()];
  const width = padding * 2 + outputColumn * columnGap + nodeWidth;
  const contentHeight =
    padding * 2 + Math.max(1, nextRow) * rowGap + nodeHeight - rowGap;
  const height = Math.max(360, contentHeight);
  const verticalOffset = (height - contentHeight) / 2;
  const contentLeft = `max(0px, calc((100% - ${width}px) / 2))`;

  function position(node: (typeof nodes)[number]) {
    return {
      x: padding + node.column * columnGap,
      y: verticalOffset + padding + node.row * rowGap,
    };
  }

  return (
    <div className="flow-board overflow-x-auto">
      <div
        className="relative"
        style={{
          width: `max(100%, ${width}px)`,
          height,
          backgroundColor: "transparent",
          backgroundImage:
            "linear-gradient(rgba(232,207,153,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,207,153,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
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
            const handle = Math.max(70, (endX - startX) / 2);
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
                strokeOpacity="0.75"
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
          const left = (fromPosition.x + nodeWidth + toPosition.x) / 2 - 48;
          const top =
            (fromPosition.y + nodeHeight / 2 + toPosition.y + nodeHeight / 2) /
              2 -
            16;

          return (
            <div
              className="absolute z-10 flex h-8 items-center gap-1.5 rounded-full border border-[#e8cf99]/25 bg-[#172116]/95 px-2.5 text-xs font-bold text-[#fff3d4] shadow-lg shadow-black/25 backdrop-blur"
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
          const accent = isOutput ? "#78c66d" : isMachine ? "#6aa6b8" : "#d08a55";
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
              className="absolute z-20 flex h-24 w-[232px] flex-col justify-center gap-2 overflow-hidden rounded-md border bg-[#202b22]/95 px-3 py-2 shadow-xl shadow-black/30 backdrop-blur-sm"
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
                <div className="truncate text-xs font-bold uppercase text-[#d8caa7]">
                  {title}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                <div className="flex items-center gap-1 pl-1">
                  {station?.image ? (
                    <span className="dark-icon-frame grid h-11 w-11 place-items-center bg-[#2d3526]/80">
                      <Image
                        className="h-9 w-9 object-contain"
                        src={station.image}
                        alt=""
                        width={48}
                        height={48}
                      />
                    </span>
                  ) : null}
                  <span className="dark-icon-frame grid h-11 w-11 place-items-center">
                    <Image
                      className="h-9 w-9 object-contain"
                      src={items[node.item].image}
                      alt=""
                      width={48}
                      height={48}
                    />
                  </span>
                </div>
                <div className="min-w-0 text-[#fff3d4]">
                  <div className="truncate text-sm text-[#f4e5c4]">
                  {items[node.item].name}
                  </div>
                  <div className="mt-1 text-xl font-bold tracking-normal">
                    {metric}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<ItemId>("wooden-panel");
  const [targetRate, setTargetRate] = useState(15);
  const [crewOptionId, setCrewOptionId] = useState<CrewOptionId>("stumpy-2");
  const [itemMenuOpen, setItemMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [recipeChoice, setRecipeChoice] = useState<
    Partial<Record<ItemId, string>>
  >({});

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const text = uiText[language];
  const numberLocale = language === "de" ? "de-DE" : "en-US";
  const format = (value: number) => formatRate(value, numberLocale);
  const target = Number.isFinite(targetRate) && targetRate > 0 ? targetRate : 0;
  const crewOption =
    crewOptions.find((option) => option.id === crewOptionId) ?? crewOptions[1];
  const plan = useMemo(
    () => calculatePlan(selectedItem, target, crewOption.multiplier, recipeChoice),
    [crewOption.multiplier, recipeChoice, selectedItem, target],
  );
  const totalMachines = plan.machines.reduce(
    (sum, summary) => sum + summary.machines,
    0,
  );
  const recipeOptions = outputItems.filter(
    (item) => (recipesByProduct[item]?.length ?? 0) > 1,
  );

  return (
    <main className="page-shell text-[#24190f]">
      <div className="flex w-full flex-col gap-5 px-2 py-4 sm:px-3 lg:px-4">
        <header className="hero-panel relative isolate flex flex-col gap-5 overflow-hidden px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b35d36]/35 to-transparent" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a76534]">
              Oddsparks: An Automation Adventure
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#24190f] sm:text-5xl">
              Sparkulator
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-[#746142]">
              {format(target)}/min {text.with} {crewOption.label}
            </p>
          </div>
          <div className="relative flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-md border border-[#8a6138]/20 bg-[#fffaf0]/70 px-3 py-2 shadow-inner">
              <Image
                className="h-10 w-auto max-w-10 object-contain"
                src={items[selectedItem].image}
                alt=""
                width={44}
                height={44}
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#a76534]">
                  {text.activeTarget}
                </div>
                <div className="text-sm font-bold text-[#24190f]">
                  {items[selectedItem].name}
                </div>
              </div>
            </div>
            <a
              className="w-fit rounded-md border border-[#b35d36]/25 bg-[#fffaf0] px-3 py-2 text-sm font-semibold text-[#4b3420] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b35d36]/45 hover:bg-white"
              href="https://oddsparks.wiki.gg"
              target="_blank"
              rel="noreferrer"
            >
              {text.wikiData}
            </a>
            <div className="grid justify-items-end gap-1.5">
              <span className="rounded-md border border-[#8a6138]/15 bg-[#fffaf0]/55 px-2.5 py-1 text-xs font-bold text-[#746142] shadow-inner">
                v{appVersion}
              </span>
              <div className="flex rounded-md border border-[#8a6138]/20 bg-[#fffaf0]/70 p-1 shadow-inner">
                {(["en", "de"] as const).map((option) => {
                  const active = language === option;

                  return (
                    <button
                      aria-pressed={active}
                      className={`rounded-[5px] px-3 py-1.5 text-sm font-bold transition ${
                        active
                          ? "bg-[#b35d36] text-white shadow-sm"
                          : "text-[#60482c] hover:bg-white"
                      }`}
                      key={option}
                      title={text.language}
                      type="button"
                      onClick={() => setLanguage(option)}
                    >
                      {option.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-5">
          <aside className="grid gap-5 md:grid-cols-[minmax(320px,1fr)_minmax(380px,0.9fr)_220px_220px]">
            <div className="surface p-4">
              <label
                className="text-sm font-semibold text-[#496238]"
                htmlFor="target-rate"
              >
                {text.targetRate}
              </label>
              <div className="mt-3 grid grid-cols-[auto_1fr_auto] gap-3">
                <div className="relative">
                  <button
                    aria-expanded={itemMenuOpen}
                    aria-label={`${text.chooseItem}: ${items[selectedItem].name}`}
                    className="icon-frame grid h-12 w-12 place-items-center transition hover:-translate-y-0.5 hover:border-[#5f8f56] hover:bg-white"
                    title={items[selectedItem].name}
                    type="button"
                    onClick={() => setItemMenuOpen((open) => !open)}
                  >
                    <Image
                      className="h-9 w-9 object-contain"
                      src={items[selectedItem].image}
                      alt=""
                      width={40}
                      height={40}
                    />
                  </button>
                  {itemMenuOpen ? (
                    <div className="surface absolute left-0 top-[calc(100%+8px)] z-50 w-80 p-3 shadow-xl shadow-[#5d4328]/20">
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-2">
                        {outputItems.map((item) => {
                          const active = selectedItem === item;

                          return (
                            <button
                              aria-label={items[item].name}
                              className={`grid h-12 min-w-12 place-items-center rounded-md border transition hover:-translate-y-0.5 ${
                                active
                                  ? "border-[#5f8f56] bg-[#edf6e4] shadow-sm ring-2 ring-[#5f8f56]/25"
                                  : "border-[#8a6138]/20 bg-[#fffaf0] shadow-sm hover:border-[#5f8f56] hover:bg-white"
                              }`}
                              key={item}
                              title={items[item].name}
                              type="button"
                              onClick={() => {
                                setSelectedItem(item);
                                setItemMenuOpen(false);
                              }}
                            >
                              <Image
                                className="h-9 w-9 object-contain"
                                src={items[item].image}
                                alt=""
                                width={40}
                                height={40}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
                <input
                  id="target-rate"
                  className="control-surface h-12 px-3 text-lg font-semibold outline-none transition focus:border-[#c2633d] focus:ring-2 focus:ring-[#d9a84d]/35"
                  min="0"
                  step="0.25"
                  type="number"
                  value={targetRate}
                  onChange={(event) =>
                    setTargetRate(
                      event.currentTarget.value === ""
                        ? 0
                        : event.currentTarget.valueAsNumber,
                    )
                  }
                />
                <span className="grid h-12 place-items-center rounded-md border border-[#8a6138]/20 bg-[#ead9b7]/85 px-3 text-sm font-semibold text-[#60482c] shadow-inner">
                  /min
                </span>
              </div>
            </div>

            <div className="surface p-4">
              <div className="text-sm font-semibold text-[#496238]">
                {text.crewPerMachine}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-5">
                {crewOptions.map((option) => {
                  const active = crewOptionId === option.id;

                  return (
                  <button
                    key={option.id}
                    className={`grid min-h-20 gap-1 rounded-md border px-2 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${
                      active
                        ? "border-[#a95a35] bg-[#fff0d8] text-[#1e2518] shadow-sm ring-2 ring-[#b45d36]/25"
                        : "border-[#8a6138]/20 bg-[#fffaf0] text-[#394333] shadow-sm hover:border-[#b45d36] hover:bg-white"
                    }`}
                    title={`${option.label}: ${format(option.multiplier)}x`}
                    type="button"
                    onClick={() => setCrewOptionId(option.id)}
                  >
                    <span className="flex items-center justify-center -space-x-2">
                      {option.sparks.map((spark, index) => (
                        <span
                          className="icon-frame grid h-9 w-9 place-items-center bg-white"
                          key={`${option.id}-${spark}-${index}`}
                        >
                          <Image
                            className="h-8 w-8 object-contain"
                            src={items[spark].image}
                            alt=""
                            width={34}
                            height={34}
                          />
                        </span>
                      ))}
                    </span>
                    <span className="truncate text-xs">{option.label}</span>
                    <span className="text-xs text-[#8b5b2f]">
                      {format(option.multiplier)}x
                    </span>
                  </button>
                  );
                })}
              </div>
            </div>

            <div className="surface p-4">
              <div className="text-sm font-semibold text-[#746142]">
                {text.machines}
              </div>
              <div className="mt-3 text-3xl font-bold text-[#26351f]">
                {format(totalMachines)}
              </div>
              <div className="text-sm text-[#746142]">
                {text.with} {crewOption.label}
              </div>
            </div>

            <div className="surface p-4">
              <div className="text-sm font-semibold text-[#746142]">
                {text.rawInputs}
              </div>
              <div className="mt-3 text-3xl font-bold text-[#26351f]">
                {plan.raw.length}
              </div>
              <div className="text-sm text-[#746142]">{text.sourcesInPlan}</div>
            </div>

          </aside>

          <section className="flex min-w-0 flex-col gap-5">
            <div className="surface overflow-hidden">
              <div className="surface-header px-4 py-3">
                <h2 className="text-lg font-bold">{text.flow}</h2>
              </div>
              <div>
                <FlowGraph
                  language={language}
                  tree={plan.tree}
                  targetItem={selectedItem}
                />
              </div>
            </div>

            <div className="surface overflow-hidden">
              <div className="surface-header flex items-center justify-between px-4 py-3">
                <h2 className="text-lg font-bold">{text.productionPlan}</h2>
                <span className="text-sm font-semibold text-[#746142]">
                  {text.machineCount}
                </span>
              </div>
              <div className="divide-y divide-[#8a6138]/15">
                {plan.machines.map(({ recipe, machines, rate }) => {
                  const perMachine =
                    recipe.cyclesPerMinuteOneStumpy *
                    recipe.productAmount *
                    crewOption.multiplier;

                  return (
                    <article
                      className="grid gap-3 p-4 transition hover:bg-white/40 md:grid-cols-[auto_1fr_auto]"
                      key={recipe.id}
                    >
                      <WorkstationIcon id={recipe.workstation} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">
                            {workstations[recipe.workstation].name}
                          </h3>
                          <span className="chip px-2 py-1 text-xs font-semibold text-[#3f6238]">
                            {recipe.name}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#746142]">
                          <span>{format(rate)}/min {text.output}</span>
                          <span>{format(perMachine)}/min {text.perMachine}</span>
                          <a
                            className="font-semibold text-[#9b4328] hover:underline"
                            href={recipe.wiki}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Wiki
                          </a>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#26351f]">
                          {format(machines)}
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5b2f]">
                          {text.machines}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <div className="surface overflow-hidden">
                <div className="surface-header px-4 py-3">
                  <h2 className="text-lg font-bold">{text.rawDemand}</h2>
                </div>
                <div className="divide-y divide-[#8a6138]/15">
                  {plan.raw.map(([item, rate]) => (
                    <div
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 transition hover:bg-white/40"
                      key={item}
                    >
                      <ItemIcon item={item} size="sm" />
                      <a
                        className="font-semibold text-[#1e2518] hover:text-[#9b4328]"
                        href={items[item].wiki}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {items[item].name}
                      </a>
                      <div className="font-bold">{format(rate)}/min</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface p-4">
                <h2 className="text-lg font-bold">{text.activeTarget}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <ItemIcon item={selectedItem} />
                  <div>
                    <div className="text-xl font-bold">
                      {items[selectedItem].name}
                    </div>
                    <div className="text-sm text-[#746142]">
                      {format(target)}/min {text.with} {crewOption.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface p-4">
              <h2 className="text-lg font-bold">{text.recipeRules}</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {recipeOptions.map((item) => (
                  <label
                    className="control-surface grid gap-2 p-3"
                    key={item}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#496238]">
                      <ItemIcon item={item} size="sm" />
                      {items[item].name}
                    </span>
                    <select
                      className="control-surface h-11 bg-white px-3 text-sm font-semibold outline-none focus:border-[#c2633d] focus:ring-2 focus:ring-[#d9a84d]/35"
                      value={
                        recipeChoice[item] ??
                        defaultRecipeIdByProduct[item] ??
                        recipesByProduct[item]?.[0]?.id
                      }
                      onChange={(event) => {
                        const selectedRecipe = event.currentTarget.value;

                        setRecipeChoice((current) => ({
                          ...current,
                          [item]: selectedRecipe,
                        }));
                      }}
                    >
                      {recipesByProduct[item]?.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {workstations[recipe.workstation].name} - {recipe.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
