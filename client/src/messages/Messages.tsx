import { FC, Fragment, useState } from 'react';
import { Divider, List, TextField } from '@mui/material';
import produce from 'immer';
import { trpc } from '..';
import { MessageItem } from './MessageItem';

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
        <>
            <TextField
                label="Send Message"
                autoComplete="off"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter') {
                        return;
                    }
                    createMessage({ content, threadId });
                    setContent('');
                }}
            />
            <List>
                {messages?.map((message) => (
                    <Fragment key={message.id}>
                        <Divider />
                        <MessageItem message={message} />
                    </Fragment>
                ))}
            </List>
        </>
    );
};
