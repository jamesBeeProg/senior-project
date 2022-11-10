import { FC } from 'react';
import type { User as IUser } from 'splist-server/prisma/generated';
import { MenuItemCopyContent, MenuItemCopyID } from '../contextMenu/MenuItems';
import { ContextMenu, ContextTrigger } from '../contextMenu/ContextMenu';
import { UserAvatar } from './UserAvatar';

interface Props {
    user: IUser;
}

export const User: FC<Props> = ({ user }) => {
    return (
        <ContextTrigger>
            {(open) => (
                <div className="flex items-center gap-4 p-1">
                    <UserAvatar
                        name={user.name}
                        color={user.color}
                        avatar={user.avatar}
                    />

                    <span
                        onContextMenu={open}
                        className="hover:underline hover:!text-text text-ellipsis overflow-hidden"
                        style={{
                            color: user.color ? '#' + user.color : '',
                        }}
                    >
                        {user.name}
                    </span>

                    <ContextMenu>
                        <MenuItemCopyContent label="Name" content={user.name} />
                        <MenuItemCopyID id={user.id} />
                    </ContextMenu>
                </div>
            )}
        </ContextTrigger>
    );
};
