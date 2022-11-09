import { Dispatch, FC, SetStateAction } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import type { Thread } from 'splist-server/prisma/generated';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { ThreadContextMenu } from './ThreadContextMenu';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
    thread: Thread;
}

export const ThreadItem: FC<Props> = (props) => {
    const contextMenu = useContextMenu();

    return (
        <div
            onContextMenu={contextMenu.handle}
            onClick={() => props.setSelected(props.thread.id)}
            className="bg-neutral-700 hover:bg-primary-400  rounded p-4 m-4"
        >
            <TagIcon /> {props.thread.name}
            <ThreadContextMenu {...props} {...contextMenu} />
        </div>
    );
};
