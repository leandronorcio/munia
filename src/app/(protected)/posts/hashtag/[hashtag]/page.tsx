import { Posts } from '@/components/Posts';

export default function Page({ params }: { params: { hashtag: string } }) {
  return (
    <div className="px-4 pt-4">
      <h1 className="mb-4 text-4xl font-bold">#{params.hashtag}</h1>
      <Posts type="hashtag" hashtag={params.hashtag} />
    </div>
  );
}
