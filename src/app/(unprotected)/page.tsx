import { ButtonLink } from '@/components/ui/ButtonLink';
import { ButtonAnchor } from '@/components/ui/ButtonAnchor';
import React from 'react';

function TechStackCard({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-5">
      <h4 className="text-lg font-semibold text-card-foreground">{header}</h4>

      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <div className="mt-28 flex flex-col items-center sm:mt-36">
        <a href="https://twitter.com/norciodotdev">
          <p className="inline-block rounded-lg bg-card px-3 py-2 text-card-foreground">Follow me on X</p>
        </a>
        <h1 className="mt-4 px-5 text-center text-2xl sm:text-5xl">
          A responsive and accessible full stack social media web app.
        </h1>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/login" size="medium">
            Get Started
          </ButtonLink>
          <ButtonAnchor href="https://github.com/leandronorcio/munia" size="medium" mode="secondary">
            Github
          </ButtonAnchor>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-3xl sm:text-5xl">Technology Stack</h2>
        <p className="mt-2 px-4 text-center text-lg text-muted-foreground">
          This social media web app is built using the following modern technologies.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 px-4 md:grid-cols-3">
          {[
            {
              header: 'TypeScript',
              details: 'Strongly-typed code and components for maintainability.',
            },
            {
              header: 'Next.js 14',
              details: 'App router, route handlers, nested layouts, and more.',
            },
            { header: 'React 18', details: 'Server and client components.' },
            {
              header: 'Prisma',
              details: 'Type-safe and intuitive database ORM.',
            },
            {
              header: 'NextAuth.js 5',
              details: 'Secure email and social OAuth logins.',
            },
            {
              header: 'React Query',
              details: 'Efficient data-fetching and caching.',
            },
            {
              header: 'Tailwind CSS',
              details: 'Utility classes for building components.',
            },
            { header: 'Framer Motion', details: 'Animation for components.' },
            {
              header: 'React Aria',
              details: 'Provides accessibility hooks for components.',
            },
            { header: 'Zod', details: 'Form input validation.' },
            { header: 'AWS S3', details: 'Storage for photos and videos.' },
            { header: 'AWS SES', details: 'For sending vefirication emails.' },
          ].map(({ header, details }) => (
            <TechStackCard header={header} key={header}>
              {details}
            </TechStackCard>
          ))}
        </div>
      </div>
    </main>
  );
}
