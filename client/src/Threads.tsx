import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { trpc } from '.';
import produce from 'immer';
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
}

export const Threads: FC<Props> = ({ selected, setSelected }) => {
    const { data: threads } = trpc.threads.getThreads.useQuery();
    const { mutate: createThread } = trpc.threads.createThread.useMutation();
    const { mutate: deleteThread } = trpc.threads.deleteThread.useMutation();

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
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
            <List>
                {threads?.map((thread) => (
                    <Fragment key={thread.id}>
                        <Divider />
                        <ListItem>
                            <ListItemButton
                                selected={thread.id === selected}
                                onClick={() => setSelected(thread.id)}
                            >
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                <ListItemText>{thread.name}</ListItemText>
                            </ListItemButton>
                            <IconButton
                                edge="end"
                                onClick={() => {
                                    deleteThread(thread);
                                    if (selected === thread.id) {
                                        setSelected(undefined);
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    </Fragment>
                ))}
            </List>
        </>
    );
};
