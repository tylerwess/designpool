export function Ticker({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line bg-surface" aria-hidden="true">
      <div className="ticker-track py-3">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="px-5 font-serif text-sm italic text-accent">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
