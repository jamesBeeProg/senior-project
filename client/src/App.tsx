import { FC, useEffect, useState } from 'react';
import { Socket } from './Socket';
import { useStore } from './store';

export const App: FC = () => {
    const readMessages = useStore((store) => store.readMessages);

    useEffect(() => {
        readMessages();
    }, []);

    const messages = useStore((store) => store.messages);
    const sendMessage = useStore((store) => store.sendMessage);

    const [draft, setDraft] = useState('');

    return (
        <Socket>
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
        </Socket>
    );
};
