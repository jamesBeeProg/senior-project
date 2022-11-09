import { FC } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import HomeIcon from '@mui/icons-material/Home';
import type { Thread } from 'splist-server/prisma/generated';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { ThreadContextMenu } from '../threads/ThreadContextMenu';
import { Link, useParams } from 'react-router-dom';

interface Props {
    thread: Thread;
}

export const NavItem: FC<Props> = ({ thread }) => {
    const { threadId } = useParams();
    const contextMenu = useContextMenu();

    return (
        <Link
            to={`/${thread.id}`}
            onContextMenu={contextMenu.handle}
            className={
                `block hover:bg-primary-400 rounded p-1 text-start` +
                (threadId === thread.id ? ' bg-primary-600' : ' bg-neutral-700')
            }
        >
            <TagIcon /> {thread.name}
            <ThreadContextMenu thread={thread} {...contextMenu} />
        </Link>
    );
};

export const NavHomeItem: FC = () => {
    const { threadId } = useParams();

    return (
        <Link
            to="/"
            className={
                `block hover:bg-primary-400 rounded p-1 text-start` +
                (!threadId ? ' bg-primary-600' : ' bg-neutral-700')
            }
        >
            <HomeIcon />
            Home
        </Link>
    );
};
