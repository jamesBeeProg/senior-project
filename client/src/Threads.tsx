import { FC, useState } from 'react';
import { trpc } from '.';
import produce from 'immer';

export const Threads: FC = () => {
    const { data } = trpc.threads.getThreads.useQuery();
    const { mutateAsync } = trpc.threads.createThread.useMutation();

    const utils = trpc.useContext();
    trpc.threads.threadCreated.useSubscription(undefined, {
        onData(thread) {
            utils.threads.getThreads.setData(
                produce((threads) => {
                    threads?.push(thread);
                }),
            );
        },
    });

    const [name, setName] = useState('');

    return (
        <div>
            <input
                placeholder="Thread name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
                onClick={async () => {
                    if (!name) {
                        return;
                    }

                    await mutateAsync({ name });
                    setName('');
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
