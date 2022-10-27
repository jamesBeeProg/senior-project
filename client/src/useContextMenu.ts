import { MenuProps } from '@mui/material';
import { MouseEventHandler, useState } from 'react';

interface MousePos {
    left: number;
    top: number;
}

export const useContextMenu = () => {
    const [mousePos, setMousePos] = useState<MousePos>();

    const onContextMenu: MouseEventHandler = (event) => {
        event.preventDefault();
        if (mousePos) {
            setMousePos(undefined);
        } else {
            setMousePos({
                left: event.clientX + 2,
                top: event.clientY - 6,
            });
        }
    };

    const closeContextMenu = () => setMousePos(undefined);

    const contextMenuProps: MenuProps = {
        open: mousePos !== undefined,
        onClose: closeContextMenu,
        anchorReference: 'anchorPosition',
        anchorPosition: mousePos,
    };

    return {
        onContextMenu,
        closeContextMenu,
        contextMenuProps,
    };
};
