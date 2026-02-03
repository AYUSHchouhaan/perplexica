'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { userQueries } from '@/db/queries';

export async function getMessageCount() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { messageCount: 0, error: 'Unauthorized' };
  }

  try {
    const messageCount = await userQueries.getMessageCount(session.user.id);
    return { messageCount, error: null };
  } catch (error) {
    console.error('Error fetching message count:', error);
    return { messageCount: 0, error: 'Failed to fetch message count' };
  }
}

export async function decreaseUserMessageCount() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const result = await userQueries.decreaseMessageCount(session.user.id);
    if (!result) {
      return { success: false, error: 'No messages remaining' };
    }
    return { success: true, messageCount: result.messageCount, error: null };
  } catch (error) {
    console.error('Error decreasing message count:', error);
    return { success: false, error: 'Failed to decrease message count' };
  }
}
