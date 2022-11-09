import { Dispatch, FC, SetStateAction, useState } from 'react';
import { trpc } from '..';
import { ThreadItem } from './ThreadItem';

export interface SelectedThreadProps {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
}

export const Threads: FC<SelectedThreadProps> = (props) => {
    const { data: threads } = trpc.threads.getThreads.useQuery();
    const { mutate: createThread } = trpc.threads.createThread.useMutation();

    const [name, setName] = useState('');

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-grow flex-col overflow-auto mb-4">
                {threads?.map((thread) => (
                    <ThreadItem key={thread.id} thread={thread} {...props} />
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
