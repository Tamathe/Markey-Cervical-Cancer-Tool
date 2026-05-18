"use client";

import { useState, type FormEvent } from "react";

type Props = {
  placeholder: string;
  sendLabel: string;
  onSubmit: (text: string) => void;
  disabled?: boolean;
};

export function Composer({
  placeholder,
  sendLabel,
  onSubmit,
  disabled,
}: Props) {
  const [value, setValue] = useState("");

  function send(e: FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
    setValue("");
  }

  return (
    <form
      onSubmit={send}
      className="flex items-center gap-2 px-3 py-2 border-t border-[var(--color-rule)] bg-white"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 min-w-0 rounded-[18px] border border-[var(--color-rule)] bg-white px-3 py-2 text-[15px] outline-none focus:border-[var(--color-me-bg)]"
        style={{ minHeight: 40 }}
        aria-label={placeholder}
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="shrink-0 rounded-full bg-[var(--color-me-bg)] text-white px-4 py-2 text-[14px] font-bold disabled:opacity-40"
      >
        {sendLabel}
      </button>
    </form>
  );
}
