import { Dispatch, FC, SetStateAction } from 'react';
import { trpc } from '..';
import {
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
    const { handle, close, menuProps } = useContextMenu();

    return (
        <ListItemButton
            onContextMenu={handle}
            selected={thread.id === selected}
            onClick={() => setSelected(thread.id)}
        >
            <ListItemIcon>
                <TagIcon />
            </ListItemIcon>
            <ListItemText>{thread.name}</ListItemText>

            <Menu {...menuProps}>
                <MenuItemCopyID close={close} id={thread.id} />
                <MenuItemDelete
                    label="thread"
                    name={'#' + thread.name}
                    close={close}
                    onClick={() => {
                        deleteThread(thread);
                        if (selected === thread.id) {
                            setSelected(undefined);
                        }
                    }}
                />
            </Menu>
        </ListItemButton>
    );
};
