import { createBrowserRouter } from 'react-router-dom';
import { Messages } from '../messages/Messages';
import { Threads } from '../threads/Threads';
import { Connect } from './Connect';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Connect />,
        children: [
            {
                index: true,
                element: <Threads />,
            },
            {
                path: ':threadId',
                element: <Messages />,
            },
        ],
    },
]);
