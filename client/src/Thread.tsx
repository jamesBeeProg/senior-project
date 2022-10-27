import { Dispatch, FC, SetStateAction } from 'react';
import { trpc } from '.';
import {
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import DeleteIcon from '@mui/icons-material/Delete';
import PinIcon from '@mui/icons-material/Pin';
import type { Thread } from 'splist-server/prisma/generated';
import { useContextMenu } from './useContextMenu';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
    thread: Thread;
}

export const ThreadItem: FC<Props> = ({ thread, selected, setSelected }) => {
    const { mutate: deleteThread } = trpc.threads.deleteThread.useMutation();
    const { onContextMenu, closeContextMenu, contextMenuProps } =
        useContextMenu();

    return (
        <>
            <Divider />
            <ListItem onContextMenu={onContextMenu}>
                <ListItemButton
                    selected={thread.id === selected}
                    onClick={() => setSelected(thread.id)}
                >
                    <ListItemIcon>
                        <TagIcon />
                    </ListItemIcon>
                    <ListItemText>{thread.name}</ListItemText>
                </ListItemButton>
                <Menu {...contextMenuProps}>
                    <MenuItem
                        onClick={async () => {
                            await navigator.clipboard.writeText(thread.id);
                            closeContextMenu();
                        }}
                    >
                        <ListItemIcon>
                            <PinIcon />
                        </ListItemIcon>
                        <ListItemText>Copy ID</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            deleteThread(thread);
                            if (selected === thread.id) {
                                setSelected(undefined);
                            }
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </Menu>
            </ListItem>
        </>
    );
};
