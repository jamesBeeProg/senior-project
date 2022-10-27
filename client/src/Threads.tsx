import { FC, useState } from 'react';
import { trpc } from '.';
import produce from 'immer';
import {
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@mui/material';
import Tag from '@mui/icons-material/Tag';
import Add from '@mui/icons-material/Add';

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
    const [selected, setSelected] = useState();

    return (
        <>
            <TextField
                label="Create Thread"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <IconButton
                size="large"
                onClick={async () => {
                    if (!name) {
                        return;
                    }

                    await mutateAsync({ name });
                    setName('');
                }}
            >
                <Add />
            </IconButton>
            <List>
                {data?.map((thread) => (
                    <ListItemButton
                        key={thread.id}
                        selected={thread.id === selected}
                        onClick={() => setSelected(thread.id)}
                    >
                        <ListItemIcon>
                            <Tag />
                        </ListItemIcon>
                        <ListItemText>{thread.name}</ListItemText>
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};
