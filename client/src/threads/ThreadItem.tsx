import { Dispatch, FC, SetStateAction } from 'react';
import { trpc } from '..';
import { Menu } from '@mui/material';
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
        <div
            onContextMenu={handle}
            onClick={() => setSelected(thread.id)}
            className="bg-slate-700 hover:bg-slate-500  rounded p-4 m-4"
        >
            <TagIcon /> {thread.name}
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
        </div>
    );
};
