import { MenuProps } from '@mui/material';
import { MouseEventHandler, useState } from 'react';

interface MousePos {
    left: number;
    top: number;
}

export type UseContextMenu = ReturnType<typeof useContextMenu>;

export const useContextMenu = () => {
    const [mousePos, setMousePos] = useState<MousePos>();

    const handle: MouseEventHandler = (event) => {
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

    const close = () => setMousePos(undefined);

    const menuProps: MenuProps = {
        open: mousePos !== undefined,
        onClose: close,
        anchorReference: 'anchorPosition',
        anchorPosition: mousePos,
    };

    return {
        handle,
        close,
        menuProps,
    };
};
