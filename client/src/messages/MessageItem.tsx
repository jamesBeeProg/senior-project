import { FC } from 'react';
import type { Message } from 'splist-server/prisma/generated';
import { Menu } from '@mui/material';
import { MenuItemCopyID } from '../contextMenu/MenuItems';
import { useContextMenu } from '../contextMenu/useContextMenu';

interface Props {
    message: Message;
}

export const MessageItem: FC<Props> = ({ message }) => {
    const messageContext = useContextMenu();
    return (
        <div>
            <span
                onContextMenu={messageContext.handle}
                className="block whitespace-pre-wrap ml-14"
            >
                {message.content}
            </span>

            <Menu {...messageContext.menuProps}>
                <MenuItemCopyID close={messageContext.close} id={message.id} />
            </Menu>
        </div>
    );
};
