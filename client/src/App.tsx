import useWebSocket, { ReadyState } from 'react-use-websocket';
import { FC, useEffect, useState } from 'react';
import create from 'zustand';

interface EventTypes {
    message_created: Message;
    test: null;
}

type Event = {
    [E in keyof EventTypes]: { e: E; c: EventTypes[E] };
}[keyof EventTypes];

interface Message {
    id: string;
    content: string;
}

interface Store {
    messages: Message[];
    readMessages(): void;
    sendMessage(content: string): Promise<void>;
    messageCreated(message: Message): Promise<void>;
}

const useStore = create<Store>((set, get) => ({
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

export const App: FC = () => {
    const { lastJsonMessage, readyState } = useWebSocket(
        'ws://localhost:3000/ws',
    );
    const messageCreated = useStore((store) => store.messageCreated);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log(lastJsonMessage);
            const event = lastJsonMessage as unknown as Event;

            if (event.e === 'message_created') {
                messageCreated(event.c);
            }
        }
    }, [lastJsonMessage, messageCreated]);

    const readMessages = useStore((store) => store.readMessages);

    useEffect(() => {
        readMessages();
    }, []);

    const messages = useStore((store) => store.messages);
    const sendMessage = useStore((store) => store.sendMessage);

    const [draft, setDraft] = useState('');

    return (
        <>
            <h3>{ReadyState[readyState]}</h3>
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
