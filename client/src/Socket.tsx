import useWebSocket, { ReadyState } from 'react-use-websocket';
import { FC, ReactNode, useEffect } from 'react';
import { Message, useStore } from './store';

interface EventTypes {
    message_created: Message;
    test: null;
}

type Event = {
    [E in keyof EventTypes]: { e: E; c: EventTypes[E] };
}[keyof EventTypes];

export const Socket: FC<{ children: ReactNode }> = ({ children }) => {
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

    if (readyState === ReadyState.CONNECTING) {
        return <h1>Loading...</h1>;
    }

    if (readyState === ReadyState.OPEN) {
        return <>{children}</>;
    }

    return <h1>Connection closed or error has occurred</h1>;
};
