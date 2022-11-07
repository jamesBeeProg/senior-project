import {
    Button,
    CircularProgress,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from '@mui/material';
import { FC, Suspense, useEffect, useState } from 'react';
import { trpc } from '.';
import { Messages } from './messages/Messages';
import { Nav } from './nav/Nav';
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
        <div className="grid grid-cols-6 h-screen w-screen overflow-hidden">
            <div className="col-span-1">
                <Suspense fallback={<CircularProgress />}>
                    <Nav selected={selected} setSelected={setSelected} />
                </Suspense>
            </div>
            <div className="col-span-4">
                <Suspense fallback={<CircularProgress />}>
                    {selected ? (
                        <Messages threadId={selected} />
                    ) : (
                        <Threads
                            selected={selected}
                            setSelected={setSelected}
                        />
                    )}
                </Suspense>
            </div>
            <div className="col-span-1">
                <ListItem
                    secondaryAction={<Button onClick={reset}>Logout</Button>}
                >
                    <ListItemAvatar>
                        <UserAvatar {...user} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                </ListItem>
            </div>
        </div>
    );
};
