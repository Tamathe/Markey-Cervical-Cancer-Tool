type Props = {
  title: string;
  script: string;
  phone: string;
};

export function ScriptCard({ title, script, phone }: Props) {
  return (
    <div className="my-2 rounded-[14px] border border-[var(--color-rule)] bg-[#fafafa] p-3">
      <div className="text-[13px] font-bold mb-1.5">{title}</div>
      <div className="italic text-[14px] leading-snug text-[var(--color-ink-soft)] mb-2 bubble-body">
        {script}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <a
          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
          className="text-[13px] px-2.5 py-1.5 rounded-[14px] border border-[var(--color-me-bg)] text-[var(--color-me-bg)] no-underline"
        >
          {phone}
        </a>
      </div>
    </div>
  );
}
