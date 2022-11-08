import { FC, Fragment, useState } from 'react';
import produce from 'immer';
import { trpc } from '..';
import { MessageItem } from './MessageItem';
import { MessageAuthor } from './MessageAuthor';

interface Props {
    threadId: string;
    userId: string;
}

export const Messages: FC<Props> = ({ threadId, userId }) => {
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

    trpc.messages.messageDeleted.useSubscription(
        { threadId },
        {
            onData(deletedMessage) {
                context.messages.getMessages.setData(
                    produce((messages) => {
                        const index = messages?.findIndex(
                            (message) => message.id === deletedMessage.id,
                        );

                        if (index === undefined) {
                            return;
                        }

                        messages?.splice(index, 1);
                    }),
                    { threadId },
                );
            },
        },
    );

    const [content, setContent] = useState('');

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-grow flex-col-reverse overflow-auto mb-4 p-4">
                {messages?.map((message, index, messages) => (
                    <Fragment key={message.id}>
                        <MessageItem message={message} userId={userId} />

                        {messages[index + 1]?.authorId !== message.authorId && (
                            <MessageAuthor author={message.author} />
                        )}
                    </Fragment>
                ))}
            </div>
            <textarea
                className="bg-neutral-700 h-fit resize-none m-4 rounded p-4"
                placeholder="Send Message"
                autoComplete="off"
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
