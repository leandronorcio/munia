'use client';
import Button from '@/components/Button';
import SvgLogInSquare from '@/svg_components/LogInSquare';
import SvgTwoPeople from '@/svg_components/TwoPeople';
import { useRouter } from 'next/navigation';

export default function OnboardingButtonsContainer() {
  const router = useRouter();

  return (
    <div className="flex flex-row gap-4 absolute top-10 right-10">
      <Button
        size="medium"
        shape="pill"
        Icon={SvgLogInSquare}
        onClick={(e) => {
          router.push('/api/auth/signin');
        }}
      >
        Login
      </Button>
      <Button
        size="medium"
        shape="pill"
        Icon={SvgTwoPeople}
        onClick={(e) => {
          router.push('/api/auth/signin');
        }}
      >
        Sign Up
      </Button>
    </div>
  );
}
