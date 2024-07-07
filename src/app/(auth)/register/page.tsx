import Link from 'next/link';
import { UserAuthForm } from '../UserAuthForm';

export const metadata = {
  title: 'Munia | Register',
};

export default function Page() {
  return (
    <>
      <h1 className="mb-5 text-5xl font-bold">Sign Up</h1>
      <p className="mb-4 text-lg text-muted-foreground">Enter your email to create an account</p>
      <UserAuthForm mode="register" />
      <p className="text-lg text-muted-foreground">Alreay have an account?</p>
      <p className="cursor-pointer text-lg font-semibold text-primary-accent hover:opacity-90">
        <Link href="/login" prefetch>
          Login
        </Link>
      </p>
    </>
  );
}
