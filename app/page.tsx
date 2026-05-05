"use client";

import Image from "next/image";
import sparkulatorIcon from "./icon.png";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react";
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

const githubUrl = "https://github.com/sirkyomi/sparkulator";
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
  const frameClassName = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const imageClassName = size === "sm" ? "h-7 w-7" : "h-10 w-10";

  return (
    <span className={`icon-frame grid ${frameClassName} shrink-0 place-items-center`}>
      <Image
        className={`${imageClassName} object-contain [image-rendering:auto]`}
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
    <span className="icon-frame grid h-12 w-12 shrink-0 place-items-center">
      {workstation.image ? (
        <Image
          className="h-9 w-9 object-contain"
          src={workstation.image}
          alt=""
          width={48}
          height={48}
        />
      ) : (
        <span className="text-sm font-semibold text-[var(--muted)]">R</span>
      )}
    </span>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49l-.01-1.75c-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.71 0 0 .84-.28 2.75 1.05A9.32 9.32 0 0 1 12 6.93c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.91l-.01 2.8c0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
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
    <main className="page-shell text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-none flex-col gap-4 px-1.5 py-3 sm:px-2 lg:px-3">
        <nav className="surface flex flex-wrap items-center justify-between gap-3 px-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="icon-frame grid h-10 w-10 shrink-0 place-items-center">
              <Image
                className="h-8 w-8 object-contain"
                src={sparkulatorIcon}
                alt="Sparkulator"
                priority
              />
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <h1 className="truncate text-xl font-bold tracking-normal sm:text-2xl">
                  Sparkulator
                </h1>
                <span className="text-xs font-bold text-[var(--copper)]">
                  v{appVersion}
                </span>
              </div>
              <p className="truncate text-sm font-medium text-[var(--muted)]">
                Oddsparks: An Automation Adventure
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <a
              className="w-fit rounded-md border border-white/50 bg-white/45 px-3 py-2 text-sm font-semibold text-[var(--ink-soft)] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--aether)]/40 hover:bg-white/70"
              href="https://oddsparks.wiki.gg"
              target="_blank"
              rel="noreferrer"
            >
              {text.wikiData}
            </a>
            <a
              aria-label="Open Sparkulator on GitHub"
              className="grid h-10 w-10 place-items-center rounded-md border border-white/50 bg-white/45 text-[var(--ink-soft)] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--aether)]/40 hover:bg-white/70"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              title="GitHub"
            >
              <GitHubIcon />
            </a>
            <div className="flex rounded-md border border-white/50 bg-white/35 p-1 shadow-inner backdrop-blur">
              {(["en", "de"] as const).map((option) => {
                const active = language === option;

                return (
                  <button
                    aria-pressed={active}
                    className={`rounded-[5px] px-3 py-1.5 text-sm font-bold transition ${
                      active
                        ? "bg-[#274238] text-white shadow-sm"
                        : "text-[var(--muted)] hover:bg-white/65"
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
        </nav>

        <header className="hero-panel relative isolate overflow-hidden px-4 py-4 sm:px-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          <div className="relative grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--copper)]">
                {text.activeTarget}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <ItemIcon item={selectedItem} />
                <div className="min-w-0">
                  <h2 className="truncate text-3xl font-bold tracking-normal sm:text-5xl">
                    {items[selectedItem].name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[var(--muted)]">
                    {format(target)}/min {text.with} {crewOption.label}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[430px]">
              <div className="control-surface px-4 py-3">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {text.machines}
                </div>
                <div className="mt-2 text-3xl font-bold text-[var(--evergreen)]">
                  {format(totalMachines)}
                </div>
              </div>
              <div className="control-surface px-4 py-3">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {text.rawInputs}
                </div>
                <div className="mt-2 text-3xl font-bold text-[var(--evergreen)]">
                  {plan.raw.length}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-3 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="relative z-40 grid content-start gap-3 lg:sticky lg:top-4">
            <div className="surface relative z-30 p-4">
              <label
                className="text-sm font-semibold text-[var(--evergreen)]"
                htmlFor="target-rate"
              >
                {text.targetRate}
              </label>
              <div className="mt-3 grid grid-cols-[auto_1fr_auto] gap-3">
                <div className="relative">
                  <button
                    aria-expanded={itemMenuOpen}
                    aria-label={`${text.chooseItem}: ${items[selectedItem].name}`}
                    className="icon-frame grid h-12 w-12 place-items-center transition hover:-translate-y-0.5 hover:border-[var(--aether)]/45 hover:bg-white/75"
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
                    <div className="popover-surface absolute left-0 top-[calc(100%+8px)] z-50 w-[250px] max-w-[calc(100vw-2rem)] p-2.5">
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(42px,1fr))] gap-2">
                        {outputItems.map((item) => {
                          const active = selectedItem === item;

                          return (
                            <button
                              aria-label={items[item].name}
                              className={`grid h-12 min-w-12 place-items-center rounded-md border transition hover:-translate-y-0.5 ${
                                active
                                  ? "border-[var(--aether)] bg-white/75 shadow-sm ring-2 ring-[var(--aether)]/20"
                                  : "border-white/45 bg-white/35 shadow-sm hover:border-[var(--aether)]/45 hover:bg-white/70"
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
                  className="control-surface h-12 min-w-0 px-3 text-lg font-semibold outline-none transition focus:border-[var(--aether)]/55 focus:ring-2 focus:ring-[var(--aether)]/20"
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
                <span className="grid h-12 place-items-center rounded-md border border-white/45 bg-white/35 px-3 text-sm font-semibold text-[var(--muted)] shadow-inner backdrop-blur">
                  /min
                </span>
              </div>
            </div>

            <div className="surface relative z-20 p-4">
              <div className="text-sm font-semibold text-[var(--evergreen)]">
                {text.crewPerMachine}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {crewOptions.map((option) => {
                  const active = crewOptionId === option.id;

                  return (
                  <button
                    key={option.id}
                    className={`grid min-h-20 gap-1 rounded-md border px-2 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${
                      active
                        ? "border-[var(--copper)]/45 bg-white/75 text-[var(--foreground)] shadow-sm ring-2 ring-[var(--copper)]/18"
                        : "border-white/45 bg-white/35 text-[var(--ink-soft)] shadow-sm hover:border-[var(--copper)]/38 hover:bg-white/70"
                    }`}
                    title={`${option.label}: ${format(option.multiplier)}x`}
                    type="button"
                    onClick={() => setCrewOptionId(option.id)}
                  >
                    <span className="flex items-center justify-center -space-x-2">
                      {option.sparks.map((spark, index) => (
                        <span
                          className="icon-frame grid h-9 w-9 place-items-center bg-white/70"
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
                    <span className="text-xs text-[var(--copper)]">
                      {format(option.multiplier)}x
                    </span>
                  </button>
                  );
                })}
              </div>
            </div>

            <div className="surface relative z-10 p-4">
              <h2 className="text-lg font-bold">{text.recipeRules}</h2>
              <div className="mt-3 grid gap-3">
                {recipeOptions.map((item) => (
                  <label className="grid gap-2" key={item}>
                    <span className="flex items-center gap-2 text-sm font-semibold text-[var(--evergreen)]">
                      <ItemIcon item={item} size="sm" />
                      {items[item].name}
                    </span>
                    <select
                      className="control-surface h-11 bg-white/45 px-3 text-sm font-semibold outline-none focus:border-[var(--aether)]/55 focus:ring-2 focus:ring-[var(--aether)]/20"
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

          </aside>

          <section className="flex min-w-0 flex-col gap-3">
            <div className="surface overflow-hidden">
              <div className="surface-header px-4 py-3">
                <h2 className="text-lg font-bold">{text.flow}</h2>
              </div>
              <div>
                <FlowGraph
                  key={plan.tree.key}
                  language={language}
                  tree={plan.tree}
                  targetItem={selectedItem}
                />
              </div>
            </div>

            <div className="surface overflow-hidden">
              <div className="surface-header flex items-center justify-between px-4 py-3">
                <h2 className="text-lg font-bold">{text.productionPlan}</h2>
                <span className="text-sm font-semibold text-[var(--muted)]">
                  {text.machineCount}
                </span>
              </div>
              <div className="divide-y divide-[var(--line)]">
                {plan.machines.map(({ recipe, machines, rate }) => {
                  const perMachine =
                    recipe.cyclesPerMinuteOneStumpy *
                    recipe.productAmount *
                    crewOption.multiplier;

                  return (
                    <article
                      className="grid gap-3 p-4 transition hover:bg-white/32 md:grid-cols-[auto_1fr_auto]"
                      key={recipe.id}
                    >
                      <WorkstationIcon id={recipe.workstation} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">
                            {workstations[recipe.workstation].name}
                          </h3>
                          <span className="chip px-2 py-1 text-xs font-semibold text-[var(--evergreen)]">
                            {recipe.name}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
                          <span>{format(rate)}/min {text.output}</span>
                          <span>{format(perMachine)}/min {text.perMachine}</span>
                          <a
                            className="font-semibold text-[var(--copper)] hover:underline"
                            href={recipe.wiki}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Wiki
                          </a>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[var(--evergreen)]">
                          {format(machines)}
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--copper)]">
                          {text.machines}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="surface overflow-hidden">
                <div className="surface-header px-4 py-3">
                  <h2 className="text-lg font-bold">{text.rawDemand}</h2>
                </div>
                <div className="divide-y divide-[var(--line)]">
                  {plan.raw.map(([item, rate]) => (
                    <div
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 transition hover:bg-white/32"
                      key={item}
                    >
                      <ItemIcon item={item} size="sm" />
                      <a
                        className="font-semibold text-[var(--foreground)] hover:text-[var(--copper)]"
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
                    <div className="text-sm text-[var(--muted)]">
                      {format(target)}/min {text.with} {crewOption.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </section>
      </div>
    </main>
  );
}
