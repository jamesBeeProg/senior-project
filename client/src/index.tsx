import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { FC, useState } from 'react';
import { createWSClient, wsLink } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact } from '@trpc/react-query';
import { Router } from 'splist-server';

export const trpc = createTRPCReact<Router>();

export const Index: FC = () => {
    const [trpcClient] = useState(() => {
        return trpc.createClient({
            links: [
                wsLink({
                    client: createWSClient({ url: 'ws://localhost:3000' }),
                }),
            ],
        });
    });

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        suspense: true,
                        useErrorBoundary: true,
                    },
                    mutations: {
                        useErrorBoundary: true,
                    },
                },
            }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </trpc.Provider>
    );
};

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <Index />
    </StrictMode>,
);
