'use client';
import { CountContext } from '@/contexts/CountContext';
import Link from 'next/link';
import { useContext } from 'react';

export default function Messages() {
  const { count, setCount } = useContext(CountContext);
  return (
    <div>
      <div className="h-[200px] w-full bg-green-200"></div>
      <div className="h-[200px] w-full bg-red-200"></div>
      <p>{count}</p>
      <div className="h-[200px] w-full bg-green-200"></div>
      <div className="h-[200px] w-full bg-red-200"></div>
      <button onClick={() => setCount((prev) => prev + 1)}>Add</button>
      <div className="h-[200px] w-full bg-green-200"></div>
      <div className="h-[200px] w-full bg-red-200"></div>
      <Link href={'/leandronorcio'}>Go to Profile</Link>
      <div className="h-[200px] w-full bg-green-200"></div>
      <div className="h-[200px] w-full bg-red-200"></div>
    </div>
  );
}
