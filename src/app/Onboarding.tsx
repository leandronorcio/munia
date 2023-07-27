import SvgLogo from '@/svg_components/Logo';
import { LogInSquare, TwoPeople } from '@/svg_components';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export function Onboarding() {
  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(95.08deg, #5F2EEA 2.49%, #E359F9 97.19%)',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="absolute right-10 top-10 flex flex-row gap-4">
        <Link href="/login">
          <Button size="medium" shape="pill" Icon={LogInSquare}>
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button size="medium" shape="pill" Icon={TwoPeople}>
            Sign Up
          </Button>
        </Link>
      </div>
      <div
        className="flex h-56 w-full flex-row items-center justify-center gap-4 rounded-none md:w-[550px] md:rounded-3xl"
        style={{ background: 'rgba(239, 240, 246, 0.25)' }}
      >
        <SvgLogo width={88} height={88} />
        <h1
          className="bg-clip-text text-6xl font-bold text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(95.08deg, #AE5388 2.49%, #3D1052 97.19%)',
          }}
        >
          Munia
        </h1>
      </div>
    </main>
  );
}
