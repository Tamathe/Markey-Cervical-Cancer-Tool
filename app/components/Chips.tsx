"use client";

import type { Chip } from "@/lib/types";

type Props = {
  chips: Chip[];
  onPick: (chip: Chip) => void;
};

export function Chips({ chips, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-end my-1 mb-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onPick(chip)}
          className={
            chip.primary
              ? "px-3 py-2 rounded-2xl text-[14px] font-medium bg-[var(--color-me-bg)] text-white border border-[var(--color-me-bg)] active:opacity-80"
              : "px-3 py-2 rounded-2xl text-[14px] font-medium bg-white text-[var(--color-me-bg)] border-[1.5px] border-[var(--color-me-bg)] active:bg-[var(--color-me-bg)] active:text-white"
          }
          style={{ minHeight: 44 }}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
