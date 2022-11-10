import { FC } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import type { Thread } from 'splist-server/prisma/generated';
import { ContextTrigger } from '../contextMenu/useContextMenu';
import { ThreadContextMenu } from '../threads/ThreadContextMenu';
import { Link, useMatch } from 'react-router-dom';

interface Props {
    thread: Thread;
}

export const NavItem: FC<Props> = ({ thread }) => {
    const url = `/${thread.id}`;
    const selected = useMatch(url);

    return (
        <ContextTrigger>
            {(open) => (
                <Link
                    to={url}
                    onContextMenu={open}
                    className={
                        `block hover:bg-primary-400 rounded p-1 text-start ` +
                        (selected ? 'bg-primary-600' : 'bg-neutral-700')
                    }
                >
                    <TagIcon /> {thread.name}
                    <ThreadContextMenu thread={thread} />
                </Link>
            )}
        </ContextTrigger>
    );
};

export const NavHomeItem: FC = () => {
    const selected = useMatch('/');

    return (
        <Link
            to="/"
            className={
                `block hover:bg-primary-400 rounded p-1 text-start` +
                (selected ? ' bg-primary-600' : ' bg-neutral-700')
            }
        >
            <HomeIcon />
            Home
        </Link>
    );
};

export const NavUserItem: FC = () => {
    const selected = useMatch('/user');

    return (
        <Link
            to="/user"
            className={
                `block hover:bg-primary-400 rounded p-1 text-start` +
                (selected ? ' bg-primary-600' : ' bg-neutral-700')
            }
        >
            <PersonIcon />
            User
        </Link>
    );
};
