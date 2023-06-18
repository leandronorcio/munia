export default function PostPhoto({
  photoUrl,
  onClick,
}: {
  photoUrl: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      className="w-1/2 max-h-[360px] cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <img
        src={photoUrl}
        className="object-cover w-full h-full transition-transform hover:scale-110"
      />
    </div>
  );
}
