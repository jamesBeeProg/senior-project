import { FC } from 'react';
import { trpc } from '.';

export const Threads: FC = () => {
    const { data } = trpc.threads.getThreads.useQuery();

    return (
        <ul>
            {data?.map((thread) => (
                <li key={thread.id}>{thread.name}</li>
            ))}
        </ul>
    );
};
