type FooterPromiseColumnProps = {
  items: string[];
};

export function FooterPromiseColumn({ items }: FooterPromiseColumnProps) {
  return (
    <div>
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
        Our Promise
      </h3>
      <ul className="flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
