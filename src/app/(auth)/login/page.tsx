import Link from 'next/link';
import { UserAuthForm } from '../UserAuthForm';

export const metadata = {
  title: 'Munia | Login',
};

export default function Page() {
  return (
    <>
      <h1 className="mb-5 text-5xl font-bold">Login</h1>
      <p className="mb-4 text-lg text-muted-foreground">Enter your email to login</p>
      <UserAuthForm mode="login" />
      <p className="text-lg text-muted-foreground">No account yet?</p>
      <p className="cursor-pointer text-lg font-semibold text-primary-accent hover:opacity-90">
        <Link href="/register" prefetch>
          Create an account
        </Link>
      </p>
    </>
  );
}
