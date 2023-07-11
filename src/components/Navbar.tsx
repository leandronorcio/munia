import { Logo } from '@/svg_components';

export default function Navbar() {
  return (
    <div className="fixed z-[1] top-0 w-full px-8 py-4 bg-white flex flex-row">
      <Logo className="w-12 h-12" />
    </div>
  );
}
