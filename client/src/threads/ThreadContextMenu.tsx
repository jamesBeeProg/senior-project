import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Thread } from 'splist-server/prisma/generated';
import { trpc } from '..';
import {
    MenuItemCopyContent,
    MenuItemCopyID,
    MenuItemDelete,
} from '../contextMenu/MenuItems';
import { ContextMenu } from '../contextMenu/ContextMenu';

interface Props {
    thread: Thread;
}

export const ThreadContextMenu: FC<Props> = ({ thread }) => {
    const { threadId } = useParams();
    const navigate = useNavigate();
    const { mutate: deleteThread } = trpc.threads.deleteThread.useMutation();

    return (
        <ContextMenu>
            <MenuItemCopyContent label="Title" content={thread.name} />
            <MenuItemCopyID id={thread.id} />
            <MenuItemDelete
                label="thread"
                name={'#' + thread.name}
                onClick={() => {
                    deleteThread(thread);
                    if (threadId === thread.id) {
                        navigate('/');
                    }
                }}
            />
        </ContextMenu>
    );
};
