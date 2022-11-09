import { Menu } from '@mui/material';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Thread } from 'splist-server/prisma/generated';
import { trpc } from '..';
import {
    MenuItemCopyContent,
    MenuItemCopyID,
    MenuItemDelete,
} from '../contextMenu/MenuItems';
import { UseContextMenu } from '../contextMenu/useContextMenu';

interface Props extends Omit<UseContextMenu, 'handle'> {
    thread: Thread;
}

export const ThreadContextMenu: FC<Props> = ({ thread, close, menuProps }) => {
    const { threadId } = useParams();
    const navigate = useNavigate();
    const { mutate: deleteThread } = trpc.threads.deleteThread.useMutation();

    return (
        <Menu {...menuProps}>
            <MenuItemCopyContent
                close={close}
                label="Title"
                content={thread.name}
            />
            <MenuItemCopyID close={close} id={thread.id} />
            <MenuItemDelete
                label="thread"
                name={'#' + thread.name}
                close={close}
                onClick={() => {
                    deleteThread(thread);
                    if (threadId === thread.id) {
                        navigate('/');
                    }
                }}
            />
        </Menu>
    );
};
