import { FC, useState } from 'react';
import { trpc } from '.';

export const Threads: FC = () => {
    const { data } = trpc.threads.getThreads.useQuery();
    const { mutate } = trpc.threads.createThread.useMutation();

    const [name, setName] = useState('');

    return (
        <div>
            <input
                placeholder="Thread name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
                onClick={() => {
                    if (!name) {
                        return;
                    }

                    mutate({ name });
                }}
            >
                Create
            </button>
            <ul>
                {data?.map((thread) => (
                    <li key={thread.id}>{thread.name}</li>
                ))}
            </ul>
        </div>
    );
};
