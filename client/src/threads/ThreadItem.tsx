import { FC } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import type { Thread } from 'splist-server/prisma/generated';
import { ContextTrigger } from '../contextMenu/ContextMenu';
import { ThreadContextMenu } from './ThreadContextMenu';
import { Link } from 'react-router-dom';

interface Props {
    thread: Thread;
}

export const ThreadItem: FC<Props> = ({ thread }) => {
    return (
        <ContextTrigger>
            {(open) => (
                <Link
                    onContextMenu={open}
                    to={`/${thread.id}`}
                    className="bg-neutral-700 hover:bg-primary-400  rounded p-4 m-4"
                >
                    <TagIcon /> {thread.name}
                    <ThreadContextMenu thread={thread} />
                </Link>
            )}
        </ContextTrigger>
    );
};
