import { UserAuthForm } from '../UserAuthForm';

export const metadata = {
  title: 'Munia | Login',
};

export default function Page() {
  return (
    <>
      <UserAuthForm mode="login" />
    </>
  );
}
