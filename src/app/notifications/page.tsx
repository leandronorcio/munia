'use client';
import { CountContext } from '@/contexts/CountContext';
import Link from 'next/link';
import { useContext } from 'react';

export default function Messages() {
  const { count, setCount } = useContext(CountContext);
  return (
    <div>
      <div className="bg-green-200 w-full h-[200px]"></div>
      <div className="bg-red-200 w-full h-[200px]"></div>
      <p>{count}</p>
      <div className="bg-green-200 w-full h-[200px]"></div>
      <div className="bg-red-200 w-full h-[200px]"></div>
      <button onClick={() => setCount((prev) => prev + 1)}>Add</button>
      <div className="bg-green-200 w-full h-[200px]"></div>
      <div className="bg-red-200 w-full h-[200px]"></div>
      <Link href={'/leandronorcio'}>Go to Profile</Link>
      <div className="bg-green-200 w-full h-[200px]"></div>
      <div className="bg-red-200 w-full h-[200px]"></div>
    </div>
  );
}
