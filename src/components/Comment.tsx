import ProfileBlock from './ProfileBlock';

export default function Comment() {
  return (
    <div>
      <ProfileBlock type="comment" />
      <p className="-mt-6 ml-[60px] p-3 bg-slate-200 rounded-2xl inline-block">
        Yeah, that's right dude.
      </p>
    </div>
  );
}
