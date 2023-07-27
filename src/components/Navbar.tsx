import { Logo } from '@/svg_components';

export default function Navbar() {
  return (
    <div className="flex w-full flex-row bg-white px-8 py-4 drop-shadow">
      <Logo className="h-12 w-12" />
    </div>
  );
}
