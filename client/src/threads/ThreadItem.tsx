import { Dispatch, FC, SetStateAction } from 'react';
import { trpc } from '..';
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import type { Thread } from 'splist-server/prisma/generated';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { MenuItemCopyID, MenuItemDelete } from '../contextMenu/MenuItems';

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
                <MenuItemCopyID close={closeContextMenu} id={thread.id} />
                <MenuItemDelete
                    close={closeContextMenu}
                    onClick={() => {
                        deleteThread(thread);
                        if (selected === thread.id) {
                            setSelected(undefined);
                        }
                    }}
                />
            </Menu>
        </ListItem>
    );
};
