import { ButtonLink } from '@/components/ui/ButtonLink';
import { ButtonAnchor } from '@/components/ui/ButtonAnchor';

export default function Page() {
  return (
    <div className="mt-28 flex flex-col items-center sm:mt-36">
      <a href="https://twitter.com/norciodotdev">
        <p className="inline-block rounded-lg bg-card px-3 py-2 text-card-foreground">
          Follow me on X
        </p>
      </a>
      <h1 className="mt-4 px-5 text-center text-2xl text-muted-foreground sm:text-5xl">
        A responsive and accessible full stack social media web app.
      </h1>
      <div className="mt-6 flex justify-center gap-3">
        <ButtonLink href="/login" size="medium">
          Get Started
        </ButtonLink>
        <ButtonAnchor
          href="https://github.com/leandronorcio/munia"
          size="medium"
          mode="secondary"
        >
          Github
        </ButtonAnchor>
      </div>
    </div>
  );
}
