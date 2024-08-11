'use client';

import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/hooks/useToast';
import { AtSign, Facebook, Github, Google, LogInSquare } from '@/svg_components';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
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
  const areButtonsDisabled = loading.email || loading.github || loading.facebook || loading.google;
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('from') || '/feed';
  const { showToast } = useToast();

  const onEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const submitEmail = useCallback(async () => {
    setLoading((prev) => ({
      ...prev,
      email: true,
    }));

    const validateEmail = emailSchema.safeParse(email);
    if (validateEmail.success) {
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
        showToast({ type: 'error', title: 'Something went wrong' });
        return;
      }
      showToast({
        type: 'success',
        title: 'Email Sent',
        message: 'Please check your email to sign in.',
      });
    } else {
      setInputError(validateEmail.error.issues[0].message);
      setLoading((prev) => ({
        ...prev,
        email: false,
      }));
    }
  }, [email, callbackUrl, showToast]);

  const signInWithProvider = useCallback(
    (provider: 'github' | 'google' | 'facebook') => async () => {
      setLoading((prev) => ({
        ...prev,
        [provider]: true,
      }));
      const signInResult = await signIn(provider, {
        callbackUrl,
      });
      setLoading((prev) => ({
        ...prev,
        [provider]: false,
      }));
      if (signInResult?.error) {
        showToast({ type: 'error', title: 'Something went wrong' });
      }
    },
    [callbackUrl, showToast],
  );

  return (
    <>
      <div className="mb-4">
        <TextInput
          value={email}
          onChange={onEmailChange}
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
          isDisabled={areButtonsDisabled}>
          {mode === 'login' ? 'Login' : 'Sign up'} with Email
        </Button>
      </div>
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center px-1">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground">OR CONTINUE WITH</span>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3">
        <Button
          onPress={signInWithProvider('github')}
          shape="pill"
          expand="full"
          mode="subtle"
          Icon={Github}
          loading={loading.github}
          isDisabled={areButtonsDisabled}>
          Github
        </Button>
        <div className="flex gap-2">
          <Button
            onPress={signInWithProvider('google')}
            shape="pill"
            expand="full"
            mode="subtle"
            Icon={Google}
            loading={loading.google}
            isDisabled={areButtonsDisabled}>
            Google
          </Button>
          <Button
            onPress={signInWithProvider('facebook')}
            shape="pill"
            expand="full"
            mode="subtle"
            Icon={Facebook}
            loading={loading.facebook}
            isDisabled={areButtonsDisabled}>
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
}
