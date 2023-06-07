import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';

async function handler(request: Request) {
  const session = await getServerSession(authOptions);

  const formData = await request.formData();
  const file = formData.get('profilephoto') as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: 'File blob is required.' },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile('./public/uploads/test.png', buffer);

  return NextResponse.json({ uploaded: 'yes' }, { status: 200 });
}

export { handler as GET, handler as POST };
