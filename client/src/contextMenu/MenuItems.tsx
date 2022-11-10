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
import { FC, useContext, useState } from 'react';
import { ContextMenuContext } from './ContextMenu';

interface MenuItemCopyIDProps {
    id: string;
}

export const MenuItemCopyID: FC<MenuItemCopyIDProps> = ({ id }) => {
    const { close } = useContext(ContextMenuContext);
    return (
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
};

interface MenuItemCopyContentProps {
    label: string;
    content: string;
}

export const MenuItemCopyContent: FC<MenuItemCopyContentProps> = ({
    label,
    content,
}) => {
    const { close } = useContext(ContextMenuContext);
    return (
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
};

interface MenuItemDeleteProps {
    label: string;
    name: string;
    onClick: () => void;
}

export const MenuItemDelete: FC<MenuItemDeleteProps> = ({
    label,
    name,
    onClick,
}) => {
    const { close } = useContext(ContextMenuContext);
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
