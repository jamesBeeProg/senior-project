import { FC } from 'react';
import type { Message } from 'splist-server/prisma/generated';
import { Menu } from '@mui/material';
import {
    MenuItemCopyContent,
    MenuItemCopyID,
    MenuItemDelete,
} from '../contextMenu/MenuItems';
import { useContextMenu } from '../contextMenu/useContextMenu';
import { trpc } from '..';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { useAuth } from '../app/Auth';

interface Props {
    message: Message;
}

export const MessageItem: FC<Props> = ({ message }) => {
    const { user } = useAuth();
    const { mutate: deleteMessage } = trpc.messages.deleteMessage.useMutation();
    const contextMenu = useContextMenu();

    return (
        <div className="hover:bg-neutral-700 p-1 rounded">
            <span
                onContextMenu={contextMenu.handle}
                className="block whitespace-pre-wrap ml-14"
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeHighlight]}
                >
                    {message.content}
                </ReactMarkdown>
            </span>

            <Menu {...contextMenu.menuProps}>
                <MenuItemCopyContent
                    close={contextMenu.close}
                    label={'Content'}
                    content={message.content}
                />
                <MenuItemCopyID close={contextMenu.close} id={message.id} />
                {user.id === message.authorId && (
                    <MenuItemDelete
                        label="message"
                        name="this message"
                        close={contextMenu.close}
                        onClick={() => {
                            deleteMessage(message);
                        }}
                    />
                )}
            </Menu>
        </div>
    );
};
