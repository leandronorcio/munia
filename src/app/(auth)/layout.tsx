import { LogoText } from '@/components/LogoText';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ArrowChevronBack, BackArrow } from '@/svg_components';
import SvgLogo from '@/svg_components/Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 flex w-full justify-between pr-6 sm:top-8 sm:px-10">
        <div>
          <ButtonLink href="/" mode="ghost" Icon={ArrowChevronBack}>
            Home
          </ButtonLink>
        </div>
      </div>
      <div className="grid h-screen place-items-center">
        <div className="w-[320px] md:w-[428px]">{children}</div>
      </div>
    </>
  );
}
