export function ProgressBar({
  completed,
  total,
  className,
}: {
  completed: number;
  total: number;
  className?: string;
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
        <span>
          {completed} of {total} lessons
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percent}% complete`}
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
