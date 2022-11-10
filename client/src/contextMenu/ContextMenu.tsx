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

export const ContextMenuContext = createContext({
    menuProps: { open: false },
    close() {
        // empty
    },
});

interface ContextTriggerProps {
    children(open: MouseEventHandler): ReactNode;
}

export const ContextTrigger: FC<ContextTriggerProps> = ({ children }) => {
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

    return (
        <ContextMenuContext.Provider value={{ close, menuProps }}>
            {children(handle)}
        </ContextMenuContext.Provider>
    );
};

interface ContextMenuProps {
    children: ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({ children }) => {
    const { menuProps } = useContext(ContextMenuContext);
    return <Menu {...menuProps}>{children}</Menu>;
};
