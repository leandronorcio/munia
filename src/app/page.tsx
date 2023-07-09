import SvgLogo from '@/svg_components/Logo';
import OnboardingButtonsContainer from '../components/OnboardingButtonsContainer';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';

function Onboarding() {
  return (
    <main
      className="flex flex-col min-h-screen w-full justify-center items-center relative"
      style={{
        background: 'linear-gradient(95.08deg, #5F2EEA 2.49%, #E359F9 97.19%)',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      <OnboardingButtonsContainer></OnboardingButtonsContainer>
      <div
        className="flex flex-row items-center justify-center gap-4 w-full md:w-[550px] h-56 rounded-none md:rounded-3xl"
        style={{ background: 'rgba(239, 240, 246, 0.25)' }}
      >
        <SvgLogo width={88} height={88} />
        <h1
          className="text-6xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(95.08deg, #AE5388 2.49%, #3D1052 97.19%)',
          }}
        >
          Munia
        </h1>
      </div>
    </main>
  );
}

function Feed() {
  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <h1 className="font-bold text-4xl mb-6">News Feed</h1>
    </div>
  );
}

export default async function Page() {
  const [user] = await useProtectApiRoute();
  return <>{user ? <Feed /> : <Onboarding />}</>;
}
