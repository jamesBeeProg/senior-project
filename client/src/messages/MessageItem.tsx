import { FC } from 'react';
import type { Message } from 'splist-server/prisma/generated';
import {
    MenuItemCopyContent,
    MenuItemCopyID,
    MenuItemDelete,
} from '../contextMenu/MenuItems';
import { ContextMenu, ContextTrigger } from '../contextMenu/useContextMenu';
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

    return (
        <ContextTrigger>
            {(open) => (
                <div className="hover:bg-neutral-700 p-1 rounded">
                    <span
                        onContextMenu={open}
                        className="block whitespace-pre-wrap ml-14"
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeHighlight]}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </span>

                    <ContextMenu>
                        {(close) => (
                            <>
                                {' '}
                                <MenuItemCopyContent
                                    close={close}
                                    label={'Content'}
                                    content={message.content}
                                />
                                <MenuItemCopyID close={close} id={message.id} />
                                {user.id === message.authorId && (
                                    <MenuItemDelete
                                        label="message"
                                        name="this message"
                                        close={close}
                                        onClick={() => {
                                            deleteMessage(message);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </ContextMenu>
                </div>
            )}
        </ContextTrigger>
    );
};
