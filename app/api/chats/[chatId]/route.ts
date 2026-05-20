import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { chatQueries, messageQueries } from '@/db/queries';

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const chatId = pathParts[pathParts.length - 1];

    const chat = await chatQueries.getChatById(chatId, userId);

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Delete messages first
    await messageQueries.deleteMessagesByChat(chatId);

    // Then delete the chat
    await chatQueries.deleteChat(chatId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
