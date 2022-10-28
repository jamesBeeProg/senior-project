import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { FC, useState } from 'react';
import { createWSClient, TRPCWebSocketClient, wsLink } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact } from '@trpc/react-query';
import { Router } from 'splist-server';
import {
    createTheme,
    CssBaseline,
    TextField,
    ThemeProvider,
} from '@mui/material';

export const trpc = createTRPCReact<Router>();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Connect = ({ client }: { client: TRPCWebSocketClient }) => {
    const [trpcClient] = useState(() => {
        return trpc.createClient({
            links: [
                wsLink({
                    client,
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

export const Index: FC = () => {
    const [url, setUrl] = useState<string>();
    const client = useRef<TRPCWebSocketClient>();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!url) {
            return;
        }
        console.log(url, 'aaa');
        client.current = createWSClient({ url });
        console.log(client.current);
        setReady(true);
        const curret = client.current;
        return () => curret.close();
    }, [url]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {ready ? (
                <Connect client={client.current!} />
            ) : (
                <TextField
                    label="Server URL"
                    onKeyDown={(e) => {
                        if (e.key !== 'Enter') {
                            return;
                        }
                        setUrl(e.target.value as unknown as string);
                        console.log({ url });
                    }}
                />
            )}
        </ThemeProvider>
    );
};

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <Index />
    </StrictMode>,
);
