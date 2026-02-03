export interface Message {
    id: string;
    chatId: string;
    role: 'user' | 'model';
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Chat {
    id: string;
    title: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    modelId: string | null;
} 

export type AppFont = 'proxima-nova' | 'inter' | 'comic-sans';