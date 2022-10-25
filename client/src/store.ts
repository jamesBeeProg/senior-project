import create from 'zustand';

export const useStore = create<Store>((set) => ({
    messages: [],
    readMessages: async () => {
        const response = await fetch('http://localhost:3000/messages');
        const messages = await response.json();
        set({ messages });
    },
    sendMessage: async (content) => {
        await fetch('http://localhost:3000/messages', {
            method: 'post',
            body: JSON.stringify({ content }),
            headers: { 'Content-Type': 'application/json' },
        });
    },
    messageCreated: async (message) => {
        set(({ messages }) => ({ messages: [message, ...messages] }));
    },
}));

export interface Store {
    messages: Message[];
    readMessages(): void;
    sendMessage(content: string): Promise<void>;
    messageCreated(message: Message): Promise<void>;
}

export interface Message {
    id: string;
    content: string;
}
