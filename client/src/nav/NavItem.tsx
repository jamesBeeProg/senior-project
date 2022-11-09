import { FC } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import HomeIcon from '@mui/icons-material/Home';
import type { Thread } from 'splist-server/prisma/generated';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { SelectedThreadProps } from '../threads/Threads';
import { ThreadContextMenu } from '../threads/ThreadContextMenu';

interface Props extends SelectedThreadProps {
    thread: Thread;
}

export const NavItem: FC<Props> = (props) => {
    const contextMenu = useContextMenu();

    return (
        <button
            onContextMenu={contextMenu.handle}
            onClick={() => props.setSelected(props.thread.id)}
            className={
                `block hover:bg-primary-400 rounded p-1 text-start` +
                (props.selected === props.thread.id
                    ? ' bg-primary-600'
                    : ' bg-neutral-700')
            }
        >
            <TagIcon />
            {props.thread.name}

            <ThreadContextMenu {...props} {...contextMenu} />
        </button>
    );
};

export const NavHomeItem: FC<Omit<Props, 'thread'>> = ({
    selected,
    setSelected,
}) => {
    return (
        <button
            onClick={() => setSelected(undefined)}
            className={
                `block hover:bg-primary-400 rounded p-1 text-start` +
                (!selected ? ' bg-primary-600' : ' bg-neutral-700')
            }
        >
            <HomeIcon />
            Home
        </button>
    );
};
