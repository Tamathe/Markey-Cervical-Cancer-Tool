type Props = {
  text: string;
};

export function DisclaimerBanner({ text }: Props) {
  return (
    <div
      role="note"
      className="px-3 py-1.5 text-[12px] leading-tight bg-[var(--color-cream-bg)] border-b border-[var(--color-cream-border)] text-[var(--color-cream-ink)]"
    >
      {text}
    </div>
  );
}
