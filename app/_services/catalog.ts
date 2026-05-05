import packageJson from "../../package.json";
import type { ItemId, Language, Recipe, WorkstationId } from "./types";

export const uiText = {
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

export const appVersion = packageJson.version;

export const githubUrl = "https://github.com/sirkyomi/sparkulator";
const wikiBase = "https://oddsparks.wiki.gg/wiki/";

export const items: Record<
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

export const workstations: Record<WorkstationId, { name: string; image?: string }> = {
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

export const recipes: Recipe[] = [
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

export const outputItems = recipes
  .map((recipe) => recipe.product)
  .filter((id, index, all) => all.indexOf(id) === index);

export const recipesByProduct = recipes.reduce(
  (accumulator, recipe) => {
    accumulator[recipe.product] = [...(accumulator[recipe.product] ?? []), recipe];
    return accumulator;
  },
  {} as Partial<Record<ItemId, Recipe[]>>,
);

export const defaultRecipeIdByProduct: Partial<Record<ItemId, string>> = {
  "tree-bark": "bark-harvesting",
};

export const crewOptions = [
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

export type CrewOptionId = (typeof crewOptions)[number]["id"];
