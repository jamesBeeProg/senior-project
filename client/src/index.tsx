import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTRPCReact } from '@trpc/react-query';
import { Router } from 'splist-server';
import { Connect } from './app/Connect';

export const trpc = createTRPCReact<Router>();

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <Connect />
    </StrictMode>,
);
