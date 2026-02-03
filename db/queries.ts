import { eq, desc, and, or } from 'drizzle-orm';
import { db } from './drizzleclient';
import { chats, messages, users, type Chat, type Message, type User, type NewChat, type NewMessage } from './schema';

// Chat queries
export const chatQueries = {
  // Get all chats for a user
  getChats: async (userId: string) => {
    return await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));
  },

  // Get a specific chat by ID
  getChatById: async (chatId: string, userId: string) => {
    const result = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .limit(1);
    
    return result[0] || null;
  },

  // Create a new chat
  createChat: async (chatData: NewChat) => {
    const result = await db
      .insert(chats)
      .values(chatData)
      .returning();
    
    return result[0];
  },

  // Update chat title
  updateChatTitle: async (chatId: string, title: string) => {
    const result = await db
      .update(chats)
      .set({ title, updatedAt: new Date() })
      .where(eq(chats.id, chatId))
      .returning();
    
    return result[0];
  },

  // Delete a chat
  deleteChat: async (chatId: string, userId: string) => {
    const result = await db
      .delete(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .returning();
    
    return result[0];
  },

  // Update chat's updated_at timestamp
  touchChat: async (chatId: string) => {
    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, chatId));
  },
};

// Message queries
export const messageQueries = {
  // Get all messages for a chat
  getMessagesByChat: async (chatId: string) => {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);
  },

  // Get a specific message by ID
  getMessageById: async (messageId: string) => {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);
    
    return result[0] || null;
  },

  // Create a new message
  createMessage: async (messageData: NewMessage) => {
    const result = await db
      .insert(messages)
      .values(messageData)
      .returning();
    
    return result[0];
  },

  // Update message content
  updateMessageContent: async (messageId: string, content: string) => {
    const result = await db
      .update(messages)
      .set({ content, updatedAt: new Date() })
      .where(eq(messages.id, messageId))
      .returning();
    
    return result[0];
  },

  // Delete messages by chat ID
  deleteMessagesByChat: async (chatId: string) => {
    return await db
      .delete(messages)
      .where(eq(messages.chatId, chatId))
      .returning();
  },

  // Delete a specific message
  deleteMessage: async (messageId: string) => {
    const result = await db
      .delete(messages)
      .where(eq(messages.id, messageId))
      .returning();
    
    return result[0];
  },

  // Get chat history for AI providers (formatted)
  getChatHistory: async (chatId: string, provider: 'google' | 'groq') => {
    const chatMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    if (provider === 'google') {
      return chatMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
    } else if (provider === 'groq') {
      return chatMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
    }

    return [];
  },
};

// User queries
export const userQueries = {
  // Get user by email
  getUserByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result[0] || null;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result[0] || null;
  },

  // Create a new user
  createUser: async (userData: { email: string; hashedPassword: string; username: string }) => {
    const result = await db
      .insert(users)
      .values(userData)
      .returning();
    
    return result[0];
  },

  // Decrease message count
  decreaseMessageCount: async (userId: string) => {
    const user = await db
      .select({ messageCount: users.messageCount })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!user[0] || user[0].messageCount <= 0) {
      return null;
    }

    const result = await db
      .update(users)
      .set({ messageCount: user[0].messageCount - 1 })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0];
  },

  // Get message count
  getMessageCount: async (userId: string) => {
    const result = await db
      .select({ messageCount: users.messageCount })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return result[0]?.messageCount ?? 0;
  },
};