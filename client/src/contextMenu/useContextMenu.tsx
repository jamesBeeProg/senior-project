import { Menu, MenuProps } from '@mui/material';
import {
    createContext,
    FC,
    MouseEventHandler,
    ReactNode,
    useContext,
    useState,
} from 'react';

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

const noop = () => {
    // empty
};

const ContextContext = createContext<UseContextMenu>({
    close: noop,
    handle: noop,
    menuProps: { open: false },
});

interface ContextTriggerProps {
    children(open: MouseEventHandler): ReactNode;
}

export const ContextTrigger: FC<ContextTriggerProps> = ({ children }) => {
    const context = useContextMenu();
    return (
        <ContextContext.Provider value={context}>
            {children(context.handle)}
        </ContextContext.Provider>
    );
};

interface ContextMenuProps {
    children(close: () => void): ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({ children }) => {
    const { menuProps, close } = useContext(ContextContext);
    return <Menu {...menuProps}>{children(close)}</Menu>;
};