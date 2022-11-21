import { FC, useState } from 'react';
import { trpc } from '..';
import { useTitle } from '../misc';
import { ThreadItem } from './ThreadItem';

export const Threads: FC = () => {
    const { data: threads } = trpc.threads.getThreads.useQuery();
    const { mutate: createThread } = trpc.threads.createThread.useMutation();

    const [name, setName] = useState('');

    useTitle('Splist - Home');

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-grow flex-col overflow-auto mb-4">
                {threads?.map((thread) => (
                    <ThreadItem key={thread.id} thread={thread} />
                ))}
            </div>
            <input
                className="bg-neutral-700 m-4 rounded p-4"
                placeholder="Create Thread"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter' || name.trim().length < 1) {
                        return;
                    }
                    createThread({ name });
                    setName('');
                }}
            />
        </div>
    );
};
