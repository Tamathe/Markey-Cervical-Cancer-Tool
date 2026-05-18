import type { ResourceItem } from "@/lib/types";

type Props = {
  intro: string;
  primaryHeader: string;
  otherHeader: string;
  langBadge: string;
  showLangBadge: boolean;
  primary: ResourceItem | null;
  others: ResourceItem[];
};

function Row({
  item,
  langBadge,
  showLangBadge,
  emphasized,
}: {
  item: ResourceItem;
  langBadge: string;
  showLangBadge: boolean;
  emphasized?: boolean;
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "flex items-center gap-2 py-2 px-2.5 rounded-[10px] no-underline " +
        (emphasized
          ? "bg-white border border-[var(--color-me-bg)] text-[var(--color-me-bg)] font-medium"
          : "text-[var(--color-ink)] hover:bg-white/60")
      }
      style={{ minHeight: 44 }}
    >
      <span className="flex-1 text-[14px] leading-snug bubble-body">
        {item.title}
        {showLangBadge ? (
          <span className="ml-1 text-[12px] text-[var(--color-ink-soft)]">
            {langBadge}
          </span>
        ) : null}
      </span>
    </a>
  );
}

export function ResourceList({
  intro,
  primaryHeader,
  otherHeader,
  langBadge,
  showLangBadge,
  primary,
  others,
}: Props) {
  return (
    <div className="my-2 rounded-[14px] border border-[var(--color-rule)] bg-[#fafafa] p-3">
      <div className="text-[14px] leading-snug mb-2 bubble-body">{intro}</div>

      {primary ? (
        <div className="mb-3">
          <div className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)] mb-1">
            {primaryHeader}
          </div>
          <Row
            item={primary}
            langBadge={langBadge}
            showLangBadge={showLangBadge}
            emphasized
          />
        </div>
      ) : null}

      {others.length > 0 ? (
        <div>
          <div className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-ink-soft)] mb-1">
            {otherHeader}
          </div>
          <div className="flex flex-col gap-0.5">
            {others.map((r) => (
              <Row
                key={r.href}
                item={r}
                langBadge={langBadge}
                showLangBadge={showLangBadge}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
