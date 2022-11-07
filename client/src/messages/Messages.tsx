import { FC, Fragment, useState } from 'react';
import { TextField } from '@mui/material';
import produce from 'immer';
import { trpc } from '..';
import { MessageItem } from './MessageItem';
import { MessageAuthor } from './MessageAuthor';

interface Props {
    threadId: string;
}

export const Messages: FC<Props> = ({ threadId }) => {
    const { data: messages } = trpc.messages.getMessages.useQuery({ threadId });
    const { mutate: createMessage } = trpc.messages.createMessage.useMutation();

    const context = trpc.useContext();
    trpc.messages.messageCreated.useSubscription(
        { threadId },
        {
            onData(messageCreated) {
                context.messages.getMessages.setData(
                    produce((messages) => {
                        messages?.unshift(messageCreated);
                    }),
                    { threadId },
                );
            },
        },
    );

    const [content, setContent] = useState('');

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-grow flex-col-reverse overflow-auto mb-4">
                {messages?.map((message, index, messages) => (
                    <Fragment key={message.id}>
                        <MessageItem message={message} />

                        {messages[index + 1]?.authorId !== message.authorId && (
                            <MessageAuthor author={message.author} />
                        )}
                    </Fragment>
                ))}
            </div>
            <TextField
                label="Send Message"
                autoComplete="off"
                multiline
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter' || e.getModifierState('Shift')) {
                        return;
                    }
                    e.preventDefault();
                    createMessage({ content, threadId });
                    setContent('');
                }}
            />
        </div>
    );
};
