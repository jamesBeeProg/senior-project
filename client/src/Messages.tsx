import { FC, Fragment, useState } from 'react';
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from '@mui/material';
import { useStore } from './store';

export const Messages: FC = () => {
    const selectedThread = useStore((store) => store.selectedThread);
    const messages = useStore((store) => store.messages[selectedThread]);

    const sendMessage = useStore((store) => store.sendMessage);

    const [draft, setDraft] = useState('');

    if (!messages) {
        console.log(selectedThread);
        return;
    }

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
                {messages.map(({ content, id, author }) => (
                    <Fragment key={id}>
                        <Divider />
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: '#' + author?.color,
                                    }}
                                >
                                    {author?.name?.[0] ?? 'S'}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={author?.name ?? 'Server'}
                                secondary={author?.id ?? '---------'}
                            />
                        </ListItem>
                        <ListItem key={id}>
                            <ListItemText primary={content} secondary={id} />
                        </ListItem>
                    </Fragment>
                ))}
            </List>
        </>
    );
};
