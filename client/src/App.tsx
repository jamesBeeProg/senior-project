import { FC, useEffect, useState } from 'react';
import { Socket } from './Socket';
import { useStore } from './store';
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Grid,
    Divider,
} from '@mui/material';

export const App: FC = () => {
    const readMessages = useStore((store) => store.readMessages);

    useEffect(() => {
        readMessages();
    }, []);

    const messages = useStore((store) => store.messages);
    const sendMessage = useStore((store) => store.sendMessage);

    const [draft, setDraft] = useState('');

    return (
        <Socket>
            <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid item xs>
                    <h1>Test</h1>
                </Grid>
                <Grid item>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid item xs>
                    <TextField
                        label="Message"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key !== 'Enter') {
                                return;
                            }
                            sendMessage(draft);
                            setDraft('');
                        }}
                    />
                    <List>
                        {messages.map(({ content, id }) => (
                            <ListItem key={id}>
                                <ListItemAvatar>
                                    <Avatar>U</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={'User'}
                                    secondary={content}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Socket>
    );
};
