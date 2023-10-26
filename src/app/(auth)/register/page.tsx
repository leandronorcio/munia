import { UserAuthForm } from '../UserAuthForm';

export const metadata = {
  title: 'Munia | Register',
};

export default function Page() {
  return (
    <>
      <UserAuthForm mode="register" />
    </>
  );
}
