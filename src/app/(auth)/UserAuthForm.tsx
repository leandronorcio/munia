'use client';

import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/hooks/useToast';
import {
  AtSign,
  Facebook,
  Github,
  Google,
  LogInSquare,
} from '@/svg_components';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
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
    google: false,
  });
  // Disable buttons when loading
  const areButtonsDisabled =
    loading.email || loading.github || loading.facebook || loading.google;
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('from') || '/feed';
  const { showToast } = useToast();

  const submitEmail = async () => {
    setLoading((prev) => ({
      ...prev,
      email: true,
    }));

    const validate = emailSchema.safeParse(email);
    if (validate.success) {
      const signInResult = await signIn('email', {
        email: email.toLowerCase(),
        redirect: false,
        callbackUrl,
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
  };

  return (
    <>
      <div className="mb-4">
        <TextInput
          value={email}
          onChange={(text) => {
            setEmail(text);
          }}
          label="Email"
          errorMessage={inputError || undefined}
          Icon={AtSign}
        />
      </div>
      <div className="mb-5">
        <Button
          onPress={submitEmail}
          shape="pill"
          expand="full"
          Icon={LogInSquare}
          loading={loading.email}
          isDisabled={areButtonsDisabled}
        >
          {mode === 'login' ? 'Login' : 'Sign up'} with Email
        </Button>
      </div>
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center px-1">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3">
        <Button
          onPress={() => {
            setLoading((prev) => ({
              ...prev,
              github: true,
            }));
            signIn('github', {
              callbackUrl,
            });
          }}
          shape="pill"
          expand="full"
          mode="subtle"
          Icon={Github}
          loading={loading.github}
          isDisabled={areButtonsDisabled}
        >
          Github
        </Button>
        <div className="flex gap-2">
          <Button
            onPress={() => {
              setLoading((prev) => ({
                ...prev,
                google: true,
              }));
              signIn('google', {
                callbackUrl,
              });
            }}
            shape="pill"
            expand="full"
            mode="subtle"
            Icon={Google}
            loading={loading.google}
            isDisabled={areButtonsDisabled}
          >
            Google
          </Button>
          <Button
            onPress={() => {
              setLoading((prev) => ({
                ...prev,
                facebook: true,
              }));
              signIn('facebook', {
                callbackUrl,
              });
            }}
            shape="pill"
            expand="full"
            mode="subtle"
            Icon={Facebook}
            loading={loading.facebook}
            isDisabled={areButtonsDisabled}
          >
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
}
