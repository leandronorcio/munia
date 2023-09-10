import SvgLogo from '@/svg_components/Logo';
import { LogInSquare, TwoPeople } from '@/svg_components';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default function Page() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <div className="absolute right-10 top-10 flex flex-row gap-4">
        <ButtonLink href="/login" size="medium" shape="pill" Icon={LogInSquare}>
          Login
        </ButtonLink>
        <ButtonLink
          href="/register"
          size="medium"
          shape="pill"
          Icon={TwoPeople}
        >
          Sign Up
        </ButtonLink>
      </div>
      <div className="flex h-56 w-full flex-row items-center justify-center gap-4 rounded-none bg-card md:w-[550px] md:rounded-3xl">
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
