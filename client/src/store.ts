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
        set({ threads, selectedThread: threads[0].id });
    },
    createThread: async (name) => {
        await get().postRest('/threads', { name });
    },
    threadCreated: async (thread) => {
        set(({ threads }) => ({ threads: [thread, ...threads] }));
    },

    selectedThread: '',
    setSelectedThread: async (selectedThread) => {
        set({ selectedThread });
        if (!get().messages[selectedThread]) {
            get().readMessages();
        }
    },

    messages: {},
    readMessages: async () => {
        const selectedThread = get().selectedThread;
        const newMessages = (await get().getRest(
            `/threads/${selectedThread}/messages`,
        )) as Message[];

        set(({ messages }) => ({
            messages: {
                ...messages,
                [selectedThread]: [
                    ...newMessages,
                    ...(messages[selectedThread] ?? []),
                ],
            },
        }));
    },
    sendMessage: async (content) => {
        const selectedThread = get().selectedThread;
        await get().postRest(`/threads/${selectedThread}/messages`, {
            content,
        });
    },
    messageCreated: (message) => {
        set(({ messages }) => ({
            messages: {
                ...messages,
                [message.thread_id]: [
                    message,
                    ...(messages[message.thread_id] ?? []),
                ],
            },
        }));
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

    selectedThread: string;
    setSelectedThread(selectedThread: string): Promise<void>;

    messages: Record<string, Message[] | undefined>;
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
    thread_id: string;
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
