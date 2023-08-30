import { LogoText } from '@/components/LogoText';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { BackArrow } from '@/svg_components';
import SvgLogo from '@/svg_components/Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 flex w-full justify-between pr-6 sm:top-8 sm:px-10">
        <div>
          <ButtonLink href="/" mode="ghost" Icon={BackArrow}>
            Back
          </ButtonLink>
        </div>
        <div className="flex flex-row items-center justify-center gap-5">
          <SvgLogo width={52} height={52} />
          <LogoText className="text-4xl" />
        </div>
      </div>
      <div className="grid h-screen place-items-center">
        <div className="w-[320px] md:w-[428px]">{children}</div>
      </div>
    </>
  );
}
