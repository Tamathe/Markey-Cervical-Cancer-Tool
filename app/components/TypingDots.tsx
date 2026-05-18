export function TypingDots() {
  return (
    <div className="flex my-1">
      <div className="inline-flex items-center gap-1 px-3 py-2.5 bg-[var(--color-bot-bg)] rounded-[18px] rounded-bl-[4px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-[#999]"
            style={{ animation: `blink 1.2s ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
