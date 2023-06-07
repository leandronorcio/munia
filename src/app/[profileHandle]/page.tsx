export default function Page({
  params,
}: {
  params: { profileHandle: string };
}) {
  return <h1>{params.profileHandle}</h1>;
}
