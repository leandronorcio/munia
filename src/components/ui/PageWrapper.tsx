import { ResponsiveContainer } from './ResponsiveContainer';

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="h-full overflow-y-scroll custom-scroll-bar">
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}
