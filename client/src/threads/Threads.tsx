import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { trpc } from '..';
import produce from 'immer';
import {
    Divider,
    IconButton,
    InputAdornment,
    List,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThreadItem } from './ThreadItem';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
}

export const Threads: FC<Props> = (props) => {
    const { data: threads } = trpc.threads.getThreads.useQuery();
    const { mutate: createThread } = trpc.threads.createThread.useMutation();

    const utils = trpc.useContext();
    trpc.threads.threadCreated.useSubscription(undefined, {
        onData(createdThread) {
            utils.threads.getThreads.setData(
                produce((threads) => {
                    // Add thread to cache
                    threads?.push(createdThread);
                }),
            );
        },
    });

    trpc.threads.threadDeleted.useSubscription(undefined, {
        onData(createdThread) {
            utils.threads.getThreads.setData(
                produce((threads) => {
                    // Find the index of the thread that was deleted
                    const index = threads?.findIndex(
                        (thread) => thread.id === createdThread.id,
                    );

                    if (!index) {
                        return;
                    }

                    // Use index to remove thread from cache
                    threads?.splice(index, 1);
                }),
            );
        },
    });

    const [name, setName] = useState('');

    return (
        <>
            <TextField
                label="Create Thread"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                size="large"
                                onClick={() => {
                                    if (!name) {
                                        return;
                                    }

                                    createThread({ name });
                                    setName('');
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <List>
                {threads?.map((thread) => (
                    <Fragment key={thread.id}>
                        <Divider />
                        <ThreadItem thread={thread} {...props} />
                    </Fragment>
                ))}
            </List>
        </>
    );
};
