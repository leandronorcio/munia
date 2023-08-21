export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-red-500 px-1.5 py-0.5 font-mono text-xs text-white">
      {children}
    </span>
  );
}
