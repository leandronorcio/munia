import Button from '@/components/ui/Button';
import { BackArrow } from '@/svg_components';
import SvgLogo from '@/svg_components/Logo';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 sm:top-8 pr-6 sm:px-10 w-full flex justify-between">
        <div>
          <Link href="/">
            <Button mode="ghost" Icon={BackArrow}>
              Back
            </Button>
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center gap-5">
          <SvgLogo width={52} height={52} />
          <Link href="/">
            <h1
              className="text-4xl font-bold bg-clip-text text-transparent cursor-pointer"
              style={{
                backgroundImage:
                  'linear-gradient(95.08deg, #AE5388 2.49%, #3D1052 97.19%)',
              }}
            >
              Munia
            </h1>
          </Link>
        </div>
      </div>
      <div className="h-screen grid place-items-center">
        <div className="w-[320px] md:w-[428px]">{children}</div>
      </div>
    </>
  );
}
