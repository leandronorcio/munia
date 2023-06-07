import SvgLogo from '@/svg_components/Logo';
import OnboardingButtonsContainer from './OnboardingButtonsContainer';

export default async function Onboarding() {
  return (
    <main
      className="flex flex-col min-h-screen w-full justify-center items-center relative bg-black"
      style={{
        background: 'linear-gradient(95.08deg, #5F2EEA 2.49%, #E359F9 97.19%)',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      <OnboardingButtonsContainer></OnboardingButtonsContainer>
      <div
        className="flex flex-row items-center justify-center gap-4 w-4/5 md:w-[700px] h-56 rounded-3xl backdrop:blur-md"
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
