type Props = {
  label: string;
  headline: string;
  body: string;
};

function MD({ children }: { children: string }) {
  const parts = children.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <b key={i}>{p.slice(2, -2)}</b>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function NextStepCard({ label, headline, body }: Props) {
  return (
    <div className="my-2 rounded-[14px] border border-[var(--color-peach-border)] bg-[var(--color-peach-bg)] p-3">
      <div className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-peach-ink)] mb-1">
        {label}
      </div>
      <div className="text-[15px] leading-snug bubble-body">
        <b>{headline}</b>
      </div>
      <div className="text-[14px] leading-snug mt-1 bubble-body">
        <MD>{body}</MD>
      </div>
    </div>
  );
}
