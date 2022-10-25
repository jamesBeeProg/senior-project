import { FC } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const App: FC = () => {
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        'wss://ws.postman-echo.com/raw',
    );

    return (
        <>
            <h3>{ReadyState[readyState]}</h3>
            <h3>{lastMessage?.data}</h3>
            <input onChange={(e) => sendMessage(e.target.value)} />
        </>
    );
};
