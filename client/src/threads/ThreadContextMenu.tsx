import { Menu } from '@mui/material';
import { FC } from 'react';
import type { Thread } from 'splist-server/prisma/generated';
import { trpc } from '..';
import { MenuItemCopyID, MenuItemDelete } from '../contextMenu/MenuItems';
import { UseContextMenu } from '../contextMenu/useContextMenu';
import { SelectedThreadProps } from './Threads';

interface Props extends SelectedThreadProps, Omit<UseContextMenu, 'handle'> {
    thread: Thread;
}

export const ThreadContextMenu: FC<Props> = ({
    thread,
    close,
    menuProps,
    selected,
    setSelected,
}) => {
    const { mutate: deleteThread } = trpc.threads.deleteThread.useMutation();

    return (
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
    );
};
