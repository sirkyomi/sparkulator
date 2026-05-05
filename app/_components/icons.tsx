import Image from "next/image";
import { items, workstations } from "../_services/catalog";
import type { ItemId, WorkstationId } from "../_services/types";

export function ItemIcon({ item, size = "md" }: { item: ItemId; size?: "sm" | "md" }) {
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

export function WorkstationIcon({ id }: { id: WorkstationId }) {
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

export function GitHubIcon() {
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
