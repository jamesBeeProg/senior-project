import { CircularProgress, Divider, Grid } from '@mui/material';
import { FC, Suspense, useState } from 'react';
import { Messages } from './messages/Messages';
import { Threads } from './threads/Threads';

export const App: FC = () => {
    const [selected, setSelected] = useState<string>();

    return (
        <Grid container>
            <Grid item xs>
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
