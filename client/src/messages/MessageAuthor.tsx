import { FC } from 'react';
import type { User } from 'splist-server/prisma/generated';
import { Menu } from '@mui/material';
import { MenuItemCopyID } from '../contextMenu/MenuItems';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { UserAvatar } from '../users/UserAvatar';

interface Props {
    author: User;
}

export const MessageAuthor: FC<Props> = ({ author }) => {
    const authorContext = useContextMenu();

    return (
        <div className="flex items-center gap-4">
            <UserAvatar name={author.name} color={author?.color} />

            <span
                onContextMenu={authorContext.handle}
                className="block hover:underline hover:!text-text"
                style={{ color: '#' + author.color }}
            >
                {author.name}
            </span>

            <Menu {...authorContext.menuProps}>
                <MenuItemCopyID close={authorContext.close} id={author.id} />
            </Menu>
        </div>
    );
};
