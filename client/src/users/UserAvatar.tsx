import { Avatar } from '@mui/material';
import { FC } from 'react';

interface Props {
    name: string;
    color?: string | null;
}

export const UserAvatar: FC<Props> = ({ name, color }: Props) => {
    return (
        <Avatar sx={{ bgcolor: color ? '#' + color : '' }}>{name[0]}</Avatar>
    );
};
