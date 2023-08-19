export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex h-[19px] items-center rounded-full bg-red-500 px-[5px]">
      <span
        className="align-middle font-medium text-white"
        style={{ lineHeight: '13px', fontSize: '13px' }}
      >
        {children}
      </span>
    </p>
  );
}
