import { initTRPC } from '@trpc/server';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { Server } from 'ws';
import { PrismaClient } from '../prisma/generated';

export const trpc = initTRPC.create();
export const prisma = new PrismaClient();

import { threadRouter } from './threads';

const router = trpc.router({
    hello: trpc.procedure.query(() => {
        return 'Hello world!';
    }),

    threads: threadRouter,
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
    prisma.$disconnect();
});
