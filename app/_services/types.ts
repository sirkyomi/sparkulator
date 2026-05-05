export type ItemId =
  | "beelephant-carapace"
  | "coal"
  | "fabric"
  | "fertiliser"
  | "ladder"
  | "leaves"
  | "mantis-stag-antler"
  | "rope"
  | "sawn-timber"
  | "tree-bark"
  | "wooden-blade"
  | "wooden-log"
  | "wooden-panel"
  | "coral"
  | "dowsing-stone"
  | "explosives"
  | "fluted-coral"
  | "frowl-sac"
  | "large-vial"
  | "limestone"
  | "path-tile"
  | "pebble"
  | "pengus-tendon"
  | "quartz"
  | "rock-teron-shell"
  | "small-vial"
  | "squilican-tube"
  | "stone"
  | "stone-plate"
  | "stone-spike"
  | "stone-wheel"
  | "aether-crystal"
  | "aether-shard"
  | "aetheric-clump"
  | "aetheric-pellet"
  | "fog"
  | "liquid-fertilizer"
  | "miasma"
  | "miasma-vial"
  | "raw-aether"
  | "refined-aether"
  | "bumpy-geode"
  | "copper-ingot"
  | "copper-ore"
  | "cracked-geode"
  | "crangolin-lavascale"
  | "crangolin-scale"
  | "drill-bit"
  | "glowshroom"
  | "lava-cap"
  | "lava-shellhorse-comb"
  | "shiny-geode"
  | "volcanic-soil"
  | "frilled-walrion-tusk"
  | "frost"
  | "frozen-log"
  | "frozen-stone"
  | "icehorn-ram-horn"
  | "stellar-fertilizer"
  | "stellar-ice"
  | "stellar-seed"
  | "aether-apple"
  | "aether-flower"
  | "aether-seed"
  | "aether-segment"
  | "copper-cuttings"
  | "copper-sap"
  | "copper-seed"
  | "coral-seed"
  | "fireshroom-cluster"
  | "geode-cluster"
  | "leaf-knot"
  | "stellar-leaves"
  | "arty-spark"
  | "boomy-spark"
  | "carry-spark"
  | "choppy-spark"
  | "crafty-spark"
  | "crashy-spark"
  | "drilly-spark"
  | "handy-spark"
  | "hauling-spark"
  | "loamy-spark"
  | "puffy-spark"
  | "rocky-spark"
  | "scouty-spark"
  | "scrubby-spark"
  | "slashy-spark"
  | "stumpy-spark";

export type WorkstationId =
  | "aetheric-distiller"
  | "aetheric-distiller-shrine"
  | "alchemy-lab"
  | "arty-spark-shrine"
  | "boomy-spark-shrine"
  | "carry-spark-shrine"
  | "choppy-spark-shrine"
  | "crafty-spark-shrine"
  | "crashy-spark-shrine"
  | "cutter"
  | "drill"
  | "drilly-spark-shrine"
  | "furnace"
  | "greenhouse"
  | "handy-spark-shrine"
  | "hauling-spark-shrine"
  | "loamy-spark-shrine"
  | "logger"
  | "loom"
  | "miasma-collector"
  | "plant-extractor"
  | "puffy-spark-shrine"
  | "rocky-spark-shrine"
  | "sawbench"
  | "scouty-spark-shrine"
  | "slashy-spark-shrine"
  | "spark-workbench"
  | "spark-workstation"
  | "stone-workshop"
  | "stonecutter"
  | "stumpy-spark-shrine"
  | "wood-workshop"
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
