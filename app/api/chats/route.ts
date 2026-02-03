import { NextResponse } from 'next/server';
import { chatQueries } from '@/db/queries';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    
    console.log('[GET /api/chats] User ID:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const chats = await chatQueries.getChats(userId);
    
    console.log('[GET /api/chats] Found chats:', chats?.length);

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error in GET /api/chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
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