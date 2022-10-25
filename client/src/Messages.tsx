import { FC, useEffect, useState } from 'react';
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from '@mui/material';
import { useStore } from './store';

export const Messages: FC = () => {
    const readMessages = useStore((store) => store.readMessages);

    useEffect(() => {
        readMessages();
    }, [readMessages]);

    const messages = useStore((store) => store.messages);
    const sendMessage = useStore((store) => store.sendMessage);

    const [draft, setDraft] = useState('');

    return (
        <>
            <TextField
                label="Message"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                        await sendMessage(draft);
                        setDraft('');
                    }
                }}
            />
            <List>
                {messages.map(({ content, id }) => (
                    <ListItem key={id}>
                        <ListItemAvatar>
                            <Avatar>U</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="User" secondary="c1234567890" />
                        <ListItemText primary={content} secondary={id} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};
