import { Dispatch, FC, SetStateAction } from 'react';
import { trpc } from '..';
import { Menu } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import HomeIcon from '@mui/icons-material/Home';
import type { Thread } from 'splist-server/prisma/generated';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { MenuItemCopyID, MenuItemDelete } from '../contextMenu/MenuItems';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
    thread: Thread;
}

export const NavItem: FC<Props> = ({ thread, selected, setSelected }) => {
    const { mutate: deleteThread } = trpc.threads.deleteThread.useMutation();
    const { handle, close, menuProps } = useContextMenu();

    return (
        <button
            onContextMenu={handle}
            onClick={() => setSelected(thread.id)}
            className={
                `block hover:bg-primary-400 rounded p-1 text-start` +
                (selected === thread.id ? ' bg-primary-600' : ' bg-neutral-700')
            }
        >
            <TagIcon />
            {thread.name}

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
