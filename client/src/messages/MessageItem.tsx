import { FC } from 'react';
import type { Message, User } from 'splist-server/prisma/generated';
import { ListItem, ListItemAvatar, ListItemText, Menu } from '@mui/material';
import { MenuItemCopyID } from '../contextMenu/MenuItems';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { UserAvatar } from '../users/UserAvatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
    message: Message & { author: User | null };
}

export const MessageItem: FC<Props> = ({ message }) => {
    const { onContextMenu, closeContextMenu, contextMenuProps } =
        useContextMenu();

    const author = message.author ?? { name: 'Server' };

    return (
        <ListItem onContextMenu={onContextMenu}>
            <ListItemAvatar>
                <UserAvatar {...author} />
            </ListItemAvatar>
            <ListItemText
                primary={author.name}
                secondary={
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                }
            />

            <Menu {...contextMenuProps}>
                <MenuItemCopyID close={closeContextMenu} id={message.id} />
            </Menu>
        </ListItem>
    );
};
