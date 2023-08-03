import { LogoText } from '@/components/LogoText';
import Button from '@/components/ui/Button';
import { BackArrow } from '@/svg_components';
import SvgLogo from '@/svg_components/Logo';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 flex w-full justify-between pr-6 sm:top-8 sm:px-10">
        <div>
          <Link href="/">
            <Button mode="ghost" Icon={BackArrow}>
              Back
            </Button>
          </Link>
        </div>
        <Link href="/">
          <div className="flex flex-row items-center justify-center gap-5">
            <SvgLogo width={52} height={52} />
            <LogoText className="text-4xl" />
          </div>
        </Link>
      </div>
      <div className="grid h-screen place-items-center">
        <div className="w-[320px] md:w-[428px]">{children}</div>
      </div>
    </>
  );
}
