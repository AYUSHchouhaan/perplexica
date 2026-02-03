import { NextResponse } from 'next/server';
import { chatQueries, messageQueries } from '@/db/queries';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  return handleGetRequest(req);
}

export async function POST(req: Request) {
  return handlePostRequest(req);
}

async function handleGetRequest(req: Request) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const chatId = pathParts[pathParts.indexOf('chats') + 1];
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chat = await chatQueries.getChatById(chatId, userId);
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found or unauthorized' }, { status: 404 });
    }
    
    const messages = await messageQueries.getMessagesByChat(chatId);
    
    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error in GET /api/chats/[chatId]/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePostRequest(req: Request) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const chatId = pathParts[pathParts.indexOf('chats') + 1];
    const { content } = await req.json();

    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chat = await chatQueries.getChatById(chatId, userId);
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found or unauthorized' }, { status: 404 });
    }
    
    const userMessage = await messageQueries.createMessage({
      chatId,
      role: 'user',
      content
    });
    
    let aiMessage;
   
    try {
      aiMessage = await messageQueries.createMessage({
        chatId,
        role: 'model',
        content: ''
      });
    } catch (error) {
      // If AI message creation fails, delete the user message
      await messageQueries.deleteMessage(userMessage.id);
      throw error;
    }
    
    // Update chat's updated_at timestamp
    await chatQueries.touchChat(chatId);
    
    return NextResponse.json({ userMessage, aiMessage });
  } catch (error) {
    console.error('Error in POST /api/chats/[chatId]/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}