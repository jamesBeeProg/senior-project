import { FC } from 'react';
import { Socket } from './Socket';
import { Grid, Divider, TextField } from '@mui/material';
import { Messages } from './Messages';
import { Threads } from './Threads';
import { useStore } from './store';

export const App: FC = () => {
    const token = useStore((state) => state.token);
    const setToken = useStore((state) => state.setToken);

    const selectedThread = useStore((state) => state.selectedThread);

    return (
        <Socket>
            <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid item xs>
                    <TextField
                        label="Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                                setToken('');
                            }
                        }}
                    />
                    <Threads />
                </Grid>
                <Grid item>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid item xs>
                    {selectedThread && <Messages thread={selectedThread} />}
                </Grid>
            </Grid>
        </Socket>
    );
};
