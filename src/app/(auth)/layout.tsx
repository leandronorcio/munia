export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen place-items-center">
      <div className="w-[320px] md:w-[428px]">{children}</div>
    </div>
  );
}
