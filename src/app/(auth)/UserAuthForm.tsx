'use client';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/hooks/useToast';
import { AtSign, Facebook, Github, LogInSquare } from '@/svg_components';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.string().trim().email();
export function UserAuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    email: false,
    github: false,
    facebook: false,
  });
  const { showToast } = useToast();

  const submitEmail = async () => {
    setLoading((prev) => ({
      ...prev,
      email: true,
    }));

    setTimeout(async () => {
      const validate = emailSchema.safeParse(email);
      if (validate.success) {
        const signInResult = await signIn('email', {
          email: email.toLowerCase(),
          redirect: false,
          callbackUrl: '/',
        });

        setLoading((prev) => ({
          ...prev,
          email: false,
        }));
        if (!signInResult?.ok) {
          return showToast({ type: 'error', title: 'Something went wrong' });
        }
        showToast({
          type: 'success',
          title: 'Email Sent',
          message: 'Please check your email to sign in.',
        });
      } else {
        setInputError(validate.error.issues[0].message);
        setLoading((prev) => ({
          ...prev,
          email: false,
        }));
      }
    }, 500);
  };

  return (
    <>
      <h1 className="font-bold text-5xl mb-5">
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </h1>
      <p className="text-lg text-gray-500 mb-4">
        Enter your email to {mode === 'login' ? 'login' : 'create an account'}
      </p>
      <div className="mb-4">
        <TextInput
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          error={inputError || undefined}
          width={'100%'}
          Icon={AtSign}
        />
      </div>
      <div className="mb-5">
        <Button
          onClick={submitEmail}
          shape="pill"
          expand="full"
          Icon={LogInSquare}
          loading={loading.email}
        >
          Sign {mode === 'login' ? 'in' : 'up'} with Email
        </Button>
      </div>
      <p className="text-lg text-center text-gray-500 mb-4">Or continue with</p>
      <div className="flex gap-2 mb-10">
        <Button
          onClick={() => {
            setLoading((prev) => ({
              ...prev,
              github: true,
            }));
            signIn('github', {
              callbackUrl: '/',
            });
          }}
          shape="pill"
          expand="half"
          mode="subtle"
          Icon={Github}
          loading={loading.github}
        >
          Github
        </Button>
        <Button
          onClick={() => {
            setLoading((prev) => ({
              ...prev,
              facebook: true,
            }));
            signIn('facebook', {
              callbackUrl: '/',
            });
          }}
          shape="pill"
          expand="half"
          mode="subtle"
          Icon={Facebook}
          loading={loading.facebook}
        >
          Facebook
        </Button>
      </div>
      {mode === 'login' ? (
        <>
          <p className="text-lg text-gray-500 mb-1">No account yet?</p>
          <Link href="/register">
            <p className="text-lg font-semibold text-violet-800 hover:opacity-80 cursor-pointer">
              Create an account
            </p>
          </Link>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-500 mb-1">Alreay have an account?</p>
          <Link href="/login">
            <p className="text-lg font-semibold text-violet-800 hover:opacity-80 cursor-pointer">
              Login
            </p>
          </Link>
        </>
      )}
    </>
  );
}
