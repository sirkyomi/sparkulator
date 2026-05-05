export type ItemId =
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

export type WorkstationId =
  | "logger"
  | "sawbench"
  | "loom"
  | "cutter"
  | "wood-workshop"
  | "spark-workbench"
  | "furnace"
  | "raw";

export type Ingredient = {
  item: ItemId;
  amount?: number;
  perMinuteOneStumpy?: number;
};

export type Recipe = {
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

export type PlanNode = {
  key: string;
  item: ItemId;
  rate: number;
  recipe?: Recipe;
  machines: number;
  children: PlanNode[];
  cycle?: boolean;
};

export type MachineSummary = {
  recipe: Recipe;
  machines: number;
  rate: number;
};

export type ProductionPlan = {
  tree: PlanNode;
  raw: [ItemId, number][];
  machines: MachineSummary[];
};

export type Language = "en" | "de";

export type RecipeChoice = Partial<Record<ItemId, string>>;
