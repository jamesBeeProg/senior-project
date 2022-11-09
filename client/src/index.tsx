import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTRPCReact } from '@trpc/react-query';
import { Router } from 'splist-server';
import { App } from './app/App';

export const trpc = createTRPCReact<Router>();

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
