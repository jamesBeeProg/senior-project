import { FC } from 'react';
import { Socket } from './Socket';
import { Grid, Divider } from '@mui/material';
import { Messages } from './Messages';
import { Threads } from './Threads';

export const App: FC = () => {
    return (
        <Socket>
            <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid item xs>
                    <Threads />
                </Grid>
                <Grid item>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid item xs>
                    <Messages />
                </Grid>
            </Grid>
        </Socket>
    );
};
