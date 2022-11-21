import { FC, Fragment, useState } from 'react';
import produce from 'immer';
import { trpc } from '..';
import { MessageItem } from './MessageItem';
import { User } from '../users/User';
import { useParams } from 'react-router-dom';
import { useTitle } from '../misc';

export const Messages: FC = () => {
    const threadId = useParams().threadId!;
    const { data: thread } = trpc.threads.getThread.useQuery({ id: threadId });
    const { data: messages } = trpc.messages.getMessages.useQuery({ threadId });
    const { mutate: createMessage } = trpc.messages.createMessage.useMutation();

    useTitle(`Splist # ${thread?.name}`);

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
                        <MessageItem message={message} />

                        {messages[index + 1]?.authorId !== message.authorId && (
                            <User user={message.author} />
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
