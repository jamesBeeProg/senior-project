import useWebSocket, { ReadyState } from 'react-use-websocket';
import { FC, ReactNode, useEffect } from 'react';
import { useStore } from './store';

export const Socket: FC<{ children: ReactNode }> = ({ children }) => {
    const { lastJsonMessage, readyState } = useWebSocket(
        'ws://localhost:3000/ws',
    );
    const handleEvent = useStore((store) => store.handleEvent);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log(lastJsonMessage);
            handleEvent(lastJsonMessage);
        }
    }, [lastJsonMessage, handleEvent]);

    if (readyState === ReadyState.CONNECTING) {
        return <h1>Loading...</h1>;
    }

    if (readyState === ReadyState.OPEN) {
        return <>{children}</>;
    }

    return <h1>Connection closed or error has occurred</h1>;
};
