import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from '@mui/material';
import { FC, Suspense, useEffect, useState } from 'react';
import { trpc } from '.';
import { Messages } from './messages/Messages';
import { Threads } from './threads/Threads';
import { UserAvatar } from './users/UserAvatar';

export const App: FC = () => {
    const [selected, setSelected] = useState<string>();
    const {
        mutate,
        data: user,
        error,
        reset,
    } = trpc.users.login.useMutation({
        useErrorBoundary: false,
    });
    const [userId, setUserId] = useState(localStorage.getItem('userId') ?? '');

    useEffect(() => {
        if (userId) {
            mutate({ id: userId });
        }
    }, []);

    if (error || !user) {
        return (
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item>
                    <TextField
                        label="User ID"
                        value={userId}
                        error={!!error}
                        helperText={error && 'Unable to login'}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            localStorage.setItem('userId', e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== 'Enter' || !userId) {
                                return;
                            }

                            mutate({ id: userId });
                        }}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container>
            <Grid item xs>
                <ListItem
                    secondaryAction={<Button onClick={reset}>Logout</Button>}
                >
                    <ListItemAvatar>
                        <UserAvatar {...user} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                </ListItem>
                <Divider />
                <Suspense fallback={<CircularProgress />}>
                    <Threads selected={selected} setSelected={setSelected} />
                </Suspense>
            </Grid>
            <Grid item>
                <Divider orientation="vertical" />
            </Grid>
            <Grid item xs>
                <Suspense fallback={<CircularProgress />}>
                    {selected && <Messages threadId={selected} />}
                </Suspense>
            </Grid>
        </Grid>
    );
};
