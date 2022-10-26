import create from 'zustand';
import produce from 'immer';

export const useStore = create<Store>((set, get) => ({
    token: localStorage.getItem('token'),
    setToken: (token: string) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    baseUrl: localStorage.getItem('baseUrl') ?? 'localhost:3000',
    setBaseUrl: (baseUrl: string) => {
        localStorage.setItem('baseUrl', baseUrl);
        set({ baseUrl });
    },

    threads: [],
    getThreads: async () => {
        const threads = (await get().rest('get', '/threads')) as Thread[];
        set({ threads });
    },
    createThread: async (name) => {
        await get().rest('post', '/threads', { name });
    },
    threadCreated: async (thread) => {
        set(
            produce((draft: Store) => {
                draft.threads.unshift(thread);
            }),
        );
    },

    selectedThread: null,
    setSelectedThread: async (selectedThread) => {
        set({ selectedThread });
        if (!get().messages[selectedThread]) {
            get().readMessages(selectedThread);
        }
    },

    messages: {},
    readMessages: async (thread: string) => {
        const newMessages = (await get().rest(
            'get',
            `/threads/${thread}/messages`,
        )) as Message[];

        set(
            produce((draft: Store) => {
                draft.messages[thread] = newMessages;
            }),
        );
    },
    sendMessage: async (content) => {
        const selectedThread = get().selectedThread;
        await get().rest('post', `/threads/${selectedThread}/messages`, {
            content,
        });
    },
    messageCreated: (message) => {
        set(
            produce((draft: Store) => {
                draft.messages[message.thread_id]?.unshift(message);
            }),
        );
    },

    rest: async (method, url, body) => {
        const { baseUrl, token } = get();

        if (!baseUrl || !token) {
            throw new Error('Missing baseUrl or token');
        }

        const response = await fetch(new URL(url, 'http://' + baseUrl), {
            method,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
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
    baseUrl: string | null;
    setBaseUrl(url: string): void;

    threads: Thread[];
    getThreads(): Promise<void>;
    createThread(name: string): Promise<void>;
    threadCreated(thread: Thread): void;

    selectedThread: string | null;
    setSelectedThread(selectedThread: string): Promise<void>;

    messages: Record<string, Message[] | undefined>;
    readMessages(thread: string): Promise<void>;
    sendMessage(content: string): Promise<void>;
    messageCreated(message: Message): void;

    rest(method: 'get' | 'post', url: string, body?: unknown): Promise<unknown>;
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
