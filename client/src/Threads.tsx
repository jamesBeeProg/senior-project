import { FC, Fragment, useState } from 'react';
import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material';

export const Threads: FC = () => {
    const [selected, setSelected] = useState(0);

    return (
        <List>
            {Array.from({ length: 10 }).map((_, key) => (
                <Fragment key={key}>
                    <Divider />
                    <ListItemButton
                        selected={selected === key}
                        onClick={() => setSelected(key)}
                    >
                        <ListItemAvatar>
                            <Avatar>#</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`Thread ${key}`}
                            secondary="c1234567890"
                        />
                    </ListItemButton>
                </Fragment>
            ))}
        </List>
    );
};
