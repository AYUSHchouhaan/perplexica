import { NextResponse } from 'next/server';
import { chatQueries } from '@/db/queries';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const chats = await chatQueries.getChats(userId);
    
    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error in GET /api/chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { title = 'New Chat', modelId } = await req.json();

    const chat = await chatQueries.createChat({
      title,
      userId: userId,
      modelId,
    });

    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Error in POST /api/chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}