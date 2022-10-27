import { FC } from 'react';
import type { Message } from 'splist-server/prisma/generated';
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
} from '@mui/material';
import { MenuItemCopyID } from '../contextMenu/MenuItems';
import { useContextMenu } from '../contextMenu/useContextMenu';

interface Props {
    message: Message;
}

export const MessageItem: FC<Props> = ({ message }) => {
    const { onContextMenu, closeContextMenu, contextMenuProps } =
        useContextMenu();

    return (
        <ListItem onContextMenu={onContextMenu}>
            <ListItemAvatar>
                <Avatar>U</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Username" secondary={message.content} />
            <Menu {...contextMenuProps}>
                <MenuItemCopyID close={closeContextMenu} id={message.id} />
            </Menu>
        </ListItem>
    );
};
