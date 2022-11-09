import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTRPCReact } from '@trpc/react-query';
import { Router } from 'splist-server';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';

export const trpc = createTRPCReact<Router>();

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
