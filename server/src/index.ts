import { initTRPC } from '@trpc/server';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { Server } from 'ws';

const t = initTRPC.create();

const router = t.router({
    hello: t.procedure.query(() => {
        return 'Hello world!';
    }),
});

export type Router = typeof router;

const wss = new Server({ port: 3000 });
const handler = applyWSSHandler({ wss, router });

wss.on('connection', (ws) => {
    console.log(`++ Connection (${wss.clients.size})`);
    ws.once('close', () => {
        console.log(`-- Connection (${wss.clients.size})`);
    });
});
console.log('✅ WebSocket Server listening on ws://localhost:3000');

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
});
