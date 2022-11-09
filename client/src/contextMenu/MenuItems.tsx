import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PinIcon from '@mui/icons-material/Pin';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { FC, useState } from 'react';

interface MenuItemProps {
    close: () => void;
}

interface MenuItemCopyIDProps extends MenuItemProps {
    id: string;
}

export const MenuItemCopyID: FC<MenuItemCopyIDProps> = ({ id, close }) => (
    <MenuItem
        onClick={async (e) => {
            e.stopPropagation();
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

interface MenuItemCopyContentProps extends MenuItemProps {
    label: string;
    content: string;
}

export const MenuItemCopyContent: FC<MenuItemCopyContentProps> = ({
    label,
    content,
    close,
}) => (
    <MenuItem
        onClick={async (e) => {
            e.stopPropagation();
            await navigator.clipboard.writeText(content);
            close();
        }}
    >
        <ListItemIcon>
            <ContentCopyIcon />
        </ListItemIcon>
        <ListItemText>Copy {label}</ListItemText>
    </MenuItem>
);

interface MenuItemDeleteProps extends MenuItemProps {
    label: string;
    name: string;
    onClick: () => void;
}

export const MenuItemDelete: FC<MenuItemDeleteProps> = ({
    label,
    name,
    onClick,
    close,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <MenuItem
            onClick={async (e) => {
                e.stopPropagation();

                if (e.shiftKey) {
                    onClick();
                    close();
                    return;
                }

                setOpen(true);
            }}
        >
            <ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
            <Dialog open={open}>
                <DialogTitle>Delete {label}?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete <strong>{name}</strong>?
                        This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button
                        onClick={() => {
                            onClick();
                            close();
                        }}
                        startIcon={<DeleteIcon />}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </MenuItem>
    );
};
