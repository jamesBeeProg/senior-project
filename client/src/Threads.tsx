import { FC, Fragment, useEffect, useState } from 'react';
import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Divider,
    TextField,
} from '@mui/material';
import { useStore } from './store';

export const Threads: FC = () => {
    const getThreads = useStore((store) => store.getThreads);

    useEffect(() => {
        getThreads();
    }, [getThreads]);

    const threads = useStore((store) => store.threads);
    const createThread = useStore((store) => store.createThread);

    const [selected, setSelected] = useState(null as string | null);
    const [draft, setDraft] = useState('');

    return (
        <>
            <TextField
                label="Create Thread"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                        await createThread(draft);
                        setDraft('');
                    }
                }}
            />
            <List>
                {threads.map(({ id, name }) => (
                    <Fragment key={id}>
                        <Divider />
                        <ListItemButton
                            selected={selected === id}
                            onClick={() => setSelected(id)}
                        >
                            <ListItemAvatar>
                                <Avatar>#</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={name} secondary={id} />
                        </ListItemButton>
                    </Fragment>
                ))}
            </List>
        </>
    );
};
