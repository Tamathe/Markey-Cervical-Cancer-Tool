"use client";

type Props = {
  onLangToggle: () => void;
  onRestart: () => void;
  appName: string;
  appSub: string;
  langToggleLabel: string;
  restartLabel: string;
};

export function ChatHeader({
  onLangToggle,
  onRestart,
  appName,
  appSub,
  langToggleLabel,
  restartLabel,
}: Props) {
  return (
    <header className="px-3 pt-3 pb-2 border-b border-[var(--color-rule)] bg-white">
      <div className="flex items-center gap-3">
        <div
          className="size-9 shrink-0 rounded-full grid place-items-center text-white font-extrabold"
          style={{
            background:
              "linear-gradient(135deg, var(--color-markey-1), var(--color-markey-2))",
          }}
          aria-label="Markey"
        >
          M
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-[15px] leading-tight">
            {appName}
          </div>
          <div className="text-[12px] text-[var(--color-ink-soft)] leading-tight">
            {appSub}
          </div>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="text-[12px] px-2 py-1 rounded-full border border-[var(--color-rule)] bg-white text-[var(--color-ink)]"
          aria-label={restartLabel}
        >
          {restartLabel}
        </button>
        <button
          type="button"
          onClick={onLangToggle}
          className="text-[12px] px-2 py-1 rounded-full border border-[var(--color-rule)] bg-white text-[var(--color-ink)]"
          aria-label={`Switch to ${langToggleLabel}`}
        >
          {langToggleLabel}
        </button>
      </div>
    </header>
  );
}
