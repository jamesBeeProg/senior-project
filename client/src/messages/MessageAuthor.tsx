import { FC } from 'react';
import type { User } from 'splist-server/prisma/generated';
import { MenuItemCopyID } from '../contextMenu/MenuItems';
import { ContextMenu, ContextTrigger } from '../contextMenu/useContextMenu';
import { UserAvatar } from '../users/UserAvatar';

interface Props {
    author: User;
}

export const MessageAuthor: FC<Props> = ({ author }) => {
    return (
        <ContextTrigger>
            {(open) => (
                <div className="flex items-center gap-4 p-1">
                    <UserAvatar
                        name={author.name}
                        color={author.color}
                        avatar={author.avatar}
                    />

                    <span
                        onContextMenu={open}
                        className="block hover:underline hover:!text-text"
                        style={{ color: '#' + author.color }}
                    >
                        {author.name}
                    </span>

                    <ContextMenu>
                        {(close) => (
                            <MenuItemCopyID close={close} id={author.id} />
                        )}
                    </ContextMenu>
                </div>
            )}
        </ContextTrigger>
    );
};
