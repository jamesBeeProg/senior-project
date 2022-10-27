import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PinIcon from '@mui/icons-material/Pin';
import { FC, useState } from 'react';

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

export const MenuItemDelete: FC<MenuItemDeleteProps> = ({ onClick, close }) => {
    const [open, setOpen] = useState(false);

    return (
        <MenuItem
            onClick={async () => {
                setOpen(true);
            }}
        >
            <ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
            <Dialog open={open}>
                <DialogTitle>Delete thread?</DialogTitle>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button
                        onClick={() => {
                            onClick();
                            close();
                        }}
                        startIcon={<DeleteIcon />}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </MenuItem>
    );
};
