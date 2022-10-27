import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PinIcon from '@mui/icons-material/Pin';
import { FC } from 'react';

interface MenuItemProps {
    close: () => void;
}

interface MenuItemCopyIDProps extends MenuItemProps {
    id: string;
}

export const MenuItemCopyID: FC<MenuItemCopyIDProps> = ({ id, close }) => (
    <MenuItem
        onClick={async () => {
            await navigator.clipboard.writeText(id);
            close();
        }}
    >
        <ListItemIcon>
            <PinIcon />
        </ListItemIcon>
        <ListItemText>Copy ID</ListItemText>
    </MenuItem>
);

interface MenuItemDeleteProps extends MenuItemProps {
    onClick: () => void;
}

export const MenuItemDelete: FC<MenuItemDeleteProps> = ({ onClick, close }) => (
    <MenuItem
        onClick={async () => {
            onClick();
            close();
        }}
    >
        <ListItemIcon>
            <DeleteIcon />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
    </MenuItem>
);
