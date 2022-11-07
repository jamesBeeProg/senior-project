import { Dispatch, FC, SetStateAction, useState } from 'react';
import { trpc } from '..';
import { TextField } from '@mui/material';
import { ThreadItem } from './ThreadItem';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
}

export const Threads: FC<Props> = (props) => {
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
            <TextField
                label="Create Thread"
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
