import { FC } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import type { Thread } from 'splist-server/prisma/generated';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { ThreadContextMenu } from './ThreadContextMenu';
import { Link } from 'react-router-dom';

interface Props {
    thread: Thread;
}

export const ThreadItem: FC<Props> = ({ thread }) => {
    const contextMenu = useContextMenu();

    return (
        <Link
            onContextMenu={contextMenu.handle}
            to={`/${thread.id}`}
            className="bg-neutral-700 hover:bg-primary-400  rounded p-4 m-4"
        >
            <TagIcon /> {thread.name}
            <ThreadContextMenu thread={thread} {...contextMenu} />
        </Link>
    );
};
