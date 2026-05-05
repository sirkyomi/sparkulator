import Image from "next/image";

import sparkulatorIcon from "../icon.png";
import { appVersion, githubUrl } from "../_services/catalog";
import type { Language } from "../_services/types";
import { GitHubIcon } from "./icons";

const languageOptions = ["en", "de"] as const;

type AppHeaderProps = {
  language: Language;
  text: Record<string, string>;
  onLanguageChange: (language: Language) => void;
};

export function AppHeader({
  language,
  text,
  onLanguageChange,
}: AppHeaderProps) {
  return (
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
          {languageOptions.map((option) => {
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
                onClick={() => onLanguageChange(option)}
              >
                {option.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
