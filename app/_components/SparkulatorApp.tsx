"use client";

import { useEffect, useMemo, useState } from "react";

import { crewOptions, uiText, type CrewOptionId } from "../_services/catalog";
import { calculatePlan, formatRate } from "../_services/planner";
import type { ItemId, Language, RecipeChoice } from "../_services/types";
import { AppHeader } from "./AppHeader";
import { HeroPanel } from "./HeroPanel";
import { PlanResults } from "./PlanResults";
import { PlannerSidebar } from "./PlannerSidebar";

export function SparkulatorApp() {
  const [selectedItem, setSelectedItem] = useState<ItemId>("wooden-panel");
  const [targetRate, setTargetRate] = useState(15);
  const [crewOptionId, setCrewOptionId] = useState<CrewOptionId>("stumpy-2");
  const [itemMenuOpen, setItemMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [recipeChoice, setRecipeChoice] = useState<RecipeChoice>({});

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

  function handleRecipeChoiceChange(item: ItemId, recipeId: string) {
    setRecipeChoice((current) => ({
      ...current,
      [item]: recipeId,
    }));
  }

  return (
    <main className="page-shell text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-none flex-col gap-4 px-1.5 py-3 sm:px-2 lg:px-3">
        <AppHeader
          language={language}
          text={text}
          onLanguageChange={setLanguage}
        />

        <HeroPanel
          selectedItem={selectedItem}
          target={target}
          crewLabel={crewOption.label}
          totalMachines={totalMachines}
          rawInputCount={plan.raw.length}
          text={text}
          format={format}
        />

        <section className="grid gap-3 lg:grid-cols-[270px_minmax(0,1fr)]">
          <PlannerSidebar
            selectedItem={selectedItem}
            targetRate={targetRate}
            crewOptionId={crewOptionId}
            itemMenuOpen={itemMenuOpen}
            recipeChoice={recipeChoice}
            text={text}
            format={format}
            onSelectedItemChange={setSelectedItem}
            onTargetRateChange={setTargetRate}
            onCrewOptionChange={setCrewOptionId}
            onItemMenuOpenChange={setItemMenuOpen}
            onRecipeChoiceChange={handleRecipeChoiceChange}
          />

          <PlanResults
            language={language}
            plan={plan}
            selectedItem={selectedItem}
            target={target}
            crewLabel={crewOption.label}
            crewMultiplier={crewOption.multiplier}
            text={text}
            format={format}
          />
        </section>
      </div>
    </main>
  );
}
