import { FC, useEffect, useState } from 'react';
import create from 'zustand';

interface Store {
    messages: {
        id: string;
        content: string;
    }[];
    readMessages(): void;
    sendMessage(content: string): Promise<void>;
}

const useStore = create<Store>((set, get) => ({
    messages: [],
    readMessages: async () => {
        const response = await fetch('http://localhost:3000/messages');
        const messages = await response.json();
        set({ messages });
    },
    sendMessage: async (content: string) => {
        await fetch('http://localhost:3000/messages', {
            method: 'post',
            body: JSON.stringify({ content }),
            headers: { 'Content-Type': 'application/json' },
        });
    },
}));

export const App: FC = () => {
    const readMessages = useStore((store) => store.readMessages);

    useEffect(() => {
        readMessages();
    }, []);

    const messages = useStore((store) => store.messages);
    const sendMessage = useStore((store) => store.sendMessage);

    const [draft, setDraft] = useState('');

    return (
        <>
            <input
                placeholder="Message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={async (e) => {
                    if (e.key !== 'Enter') {
                        return;
                    }
                    sendMessage(draft);
                    setDraft('');
                }}
            />
            <ul>
                {messages.map(({ content, id }) => (
                    <li key={id}>{content}</li>
                ))}
            </ul>
        </>
    );
};
