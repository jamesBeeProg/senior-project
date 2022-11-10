import { FC } from 'react';
import type { User } from 'splist-server/prisma/generated';
import { MenuItemCopyID } from '../contextMenu/MenuItems';
import { ContextMenu, ContextTrigger } from '../contextMenu/ContextMenu';
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
                        className="hover:underline hover:!text-text text-ellipsis overflow-hidden"
                        style={{
                            color: author.color ? '#' + author.color : '',
                        }}
                    >
                        {author.name}
                    </span>

                    <ContextMenu>
                        <MenuItemCopyID id={author.id} />
                    </ContextMenu>
                </div>
            )}
        </ContextTrigger>
    );
};
