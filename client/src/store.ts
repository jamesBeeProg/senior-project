import create from 'zustand';

export const useStore = create<Store>((set, get) => ({
    token: localStorage.getItem('token'),
    setToken: (token: string) => {
        localStorage.setItem('token', token);
        set({ token });
    },

    threads: [],
    getThreads: async () => {
        const threads = (await get().getRest('/threads')) as Thread[];
        set({ threads });
    },
    createThread: async (name) => {
        await get().postRest('/threads', { name });
    },
    threadCreated: async (thread) => {
        set(({ threads }) => ({ threads: [thread, ...threads] }));
    },

    messages: [],
    readMessages: async () => {
        const messages = (await get().getRest('/messages')) as Message[];
        set({ messages });
    },
    sendMessage: async (content) => {
        await get().postRest('/messages', { content });
    },
    messageCreated: (message) => {
        set(({ messages }) => ({ messages: [message, ...messages] }));
    },

    getRest: async (url) => {
        const response = await fetch('http://localhost:3000' + url, {
            headers: {
                Authorization: 'Bearer ' + get().token,
            },
        });
        if (!response.ok) {
            throw Error(`${response.statusText} ${await response.text()}`);
        }
        return await response.json();
    },
    postRest: async (url, body) => {
        const response = await fetch('http://localhost:3000' + url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + get().token,
            },
        });
        if (!response.ok) {
            throw Error(`${response.statusText} ${await response.text()}`);
        }
        return await response.json();
    },
    handleEvent: (raw: unknown) => {
        const { e: event, c: payload } = raw as Event;

        if (event === 'message_created') {
            get().messageCreated(payload);
        } else if (event === 'thread_created') {
            get().threadCreated(payload);
        }
    },
}));

export interface Store {
    token: string | null;
    setToken(token: string): void;

    threads: Thread[];
    getThreads(): Promise<void>;
    createThread(name: string): Promise<void>;
    threadCreated(thread: Thread): void;

    messages: Message[];
    readMessages(): Promise<void>;
    sendMessage(content: string): Promise<void>;
    messageCreated(message: Message): void;

    getRest(url: string): Promise<unknown>;
    postRest(url: string, body: unknown): Promise<unknown>;
    handleEvent(raw: unknown): void;
}

export interface Message {
    id: string;
    content: string;
    author?: {
        id: string;
        name: string;
        color?: string;
    };
}

interface Thread {
    id: string;
    name: string;
}

interface EventTypes {
    message_created: Message;
    thread_created: Thread;
}

type Event = {
    [E in keyof EventTypes]: { e: E; c: EventTypes[E] };
}[keyof EventTypes];
