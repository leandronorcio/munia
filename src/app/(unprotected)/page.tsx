import { Feather } from '@/svg_components';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { LogoText } from '@/components/LogoText';

export default function Page() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <div className="max-w-3xl">
        <div className="rounded-none py-10 md:rounded-3xl">
          <div className="flex w-full flex-row items-center justify-center gap-4">
            <Feather className="stroke-primary" width={80} height={80} />
            <LogoText className="text-6xl" />
          </div>
          <p className="mt-4 px-5 text-center text-2xl text-muted-foreground sm:mt-6 sm:text-4xl">
            An open source, responsive and accessible full stack social media
            web app built with Next.js.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/login" size="medium">
              Get Started
            </ButtonLink>
            <ButtonLink
              href="https://github.com/leandronorcio/munia"
              size="medium"
              mode="subtle"
            >
              Github
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
