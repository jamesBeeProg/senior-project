import { Dispatch, FC, SetStateAction } from 'react';
import { trpc } from '.';
import {
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Thread } from 'splist-server/prisma/generated';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
    thread: Thread;
}

export const ThreadItem: FC<Props> = ({ thread, selected, setSelected }) => {
    const { mutate: deleteThread } = trpc.threads.deleteThread.useMutation();

    return (
        <>
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
        </>
    );
};
