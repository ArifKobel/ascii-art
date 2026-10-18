const LABEL_WIDTHS = ["w-1/3", "w-1/4", "w-2/5", "w-1/5", "w-1/3", "w-1/4", "w-2/5", "w-1/3"];

export function PanelSkeleton() {
  return (
    <div className="animate-pulse space-y-5 p-4">
      <div className="h-4 w-20 rounded-full bg-white/10" />
      {LABEL_WIDTHS.map((width, i) => (
        <div key={i} className="space-y-2">
          <div className={`h-2.5 rounded-full bg-white/8 ${width}`} />
          <div className="h-7 rounded-lg bg-white/5" />
        </div>
      ))}
    </div>
  );
}
