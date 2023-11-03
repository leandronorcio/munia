import { Feather, LogInSquare, TwoPeople } from '@/svg_components';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { LogoText } from '@/components/LogoText';

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
        <Feather className="stroke-primary" width={88} height={88} />
        <LogoText className="text-6xl" />
      </div>
    </main>
  );
}
