import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from '@mui/material';
import produce from 'immer';
import { FC, Fragment, useState } from 'react';
import { trpc } from '..';

interface Props {
    threadId: string;
}

export const Messages: FC<Props> = ({ threadId }) => {
    const { data: messages } = trpc.threads.getMessages.useQuery({ threadId });
    const { mutate: createMessage } = trpc.threads.createMessage.useMutation();

    const context = trpc.useContext();
    trpc.threads.messageCreated.useSubscription(
        { threadId },
        {
            onData(messageCreated) {
                context.threads.getMessages.setData(
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
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>U</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Username"
                                secondary={message.content}
                            />
                        </ListItem>
                    </Fragment>
                ))}
            </List>
        </>
    );
};
