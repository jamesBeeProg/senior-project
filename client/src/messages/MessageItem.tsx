import { FC } from 'react';
import type { Message, User } from 'splist-server/prisma/generated';
import { ListItem, ListItemAvatar, ListItemText, Menu } from '@mui/material';
import { MenuItemCopyID } from '../contextMenu/MenuItems';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { UserAvatar } from '../users/UserAvatar';
interface Props {
    message: Message & { author: User | null };
}

export const MessageItem: FC<Props> = ({ message }) => {
    const messageContext = useContextMenu();
    const authorContext = useContextMenu();

    const author = message.author ?? { name: 'Server', id: '' };

    return (
        <ListItem>
            <ListItemAvatar>
                <UserAvatar {...author} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <span
                        onContextMenu={authorContext.handle}
                        style={{ display: 'block' }}
                    >
                        {author.name}
                    </span>
                }
                secondary={
                    <span
                        onContextMenu={messageContext.handle}
                        style={{ display: 'block', whiteSpace: 'pre-wrap' }}
                    >
                        {message.content}
                    </span>
                }
            />

            <Menu {...messageContext.menuProps}>
                <MenuItemCopyID close={messageContext.close} id={message.id} />
            </Menu>
            <Menu {...authorContext.menuProps}>
                <MenuItemCopyID close={authorContext.close} id={author.id} />
            </Menu>
        </ListItem>
    );
};
