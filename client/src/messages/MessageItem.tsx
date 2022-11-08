import { FC } from 'react';
import type { Message } from 'splist-server/prisma/generated';
import { Menu } from '@mui/material';
import { MenuItemCopyID, MenuItemDelete } from '../contextMenu/MenuItems';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { trpc } from '..';

interface Props {
    userId: string;
    message: Message;
}

export const MessageItem: FC<Props> = ({ message, userId }) => {
    const { mutate: deleteMessage } = trpc.messages.deleteMessage.useMutation();
    const messageContext = useContextMenu();

    return (
        <div className="hover:bg-neutral-700">
            <span
                onContextMenu={messageContext.handle}
                className="block whitespace-pre-wrap ml-14"
            >
                {message.content}
            </span>

            <Menu {...messageContext.menuProps}>
                <MenuItemCopyID close={messageContext.close} id={message.id} />
                {userId === message.authorId && (
                    <MenuItemDelete
                        label="message"
                        name="this message"
                        close={messageContext.close}
                        onClick={() => {
                            deleteMessage(message);
                        }}
                    />
                )}
            </Menu>
        </div>
    );
};
