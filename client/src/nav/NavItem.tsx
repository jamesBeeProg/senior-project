import { FC, MouseEventHandler, ReactNode } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import type { Thread } from 'splist-server/prisma/generated';
import { ContextTrigger } from '../contextMenu/ContextMenu';
import { ThreadContextMenu } from '../threads/ThreadContextMenu';
import { Link, useMatch } from 'react-router-dom';

interface NavItemProps {
    to: string;
    children: ReactNode;
    onContextMenu?: MouseEventHandler;
}

export const NavItem: FC<NavItemProps> = ({ to, children, onContextMenu }) => {
    const selected = useMatch(to);

    return (
        <Link
            to={to}
            onContextMenu={onContextMenu}
            className={
                `block hover:bg-primary-400 rounded p-1 text-start ` +
                (selected ? 'bg-primary-600' : 'bg-neutral-700')
            }
        >
            {children}
        </Link>
    );
};

interface ThreadNavItemProps {
    thread: Thread;
}

export const ThreadNavItem: FC<ThreadNavItemProps> = ({ thread }) => {
    return (
        <ContextTrigger>
            {(open) => (
                <NavItem to={`/${thread.id}`} onContextMenu={open}>
                    <TagIcon /> {thread.name}
                    <ThreadContextMenu thread={thread} />
                </NavItem>
            )}
        </ContextTrigger>
    );
};

export const NavHomeItem: FC = () => {
    return (
        <NavItem to="/">
            <HomeIcon /> Home
        </NavItem>
    );
};

export const NavUserItem: FC = () => {
    return (
        <NavItem to="/user">
            <PersonIcon /> User
        </NavItem>
    );
};
