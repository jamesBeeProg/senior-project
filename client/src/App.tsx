import { Divider, Grid } from '@mui/material';
import { FC, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Messages } from './Messages';
import { Threads } from './Threads';

export const App: FC = () => {
    const [selected, setSelected] = useState<string>();

    return (
        <ErrorBoundary fallback={<h1>Error!</h1>}>
            <Suspense fallback={<h1>Loading...</h1>}>
                <Grid container>
                    <Grid item xs>
                        <Threads
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Grid>
                    <Grid item>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid item xs>
                        {selected && <Messages threadId={selected} />}
                    </Grid>
                </Grid>
            </Suspense>
        </ErrorBoundary>
    );
};
