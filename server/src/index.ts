import { initTRPC, TRPCError } from '@trpc/server';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { Server } from 'ws';
import { PrismaClient } from '../prisma/generated';

interface Context extends Record<string, unknown> {
    userId?: string;
}

export const trpc = initTRPC.context<Context>().create();
export const prisma = new PrismaClient();

const auth = trpc.middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const user = await prisma.user.findUniqueOrThrow({
        where: { id: ctx.userId },
    });

    return next({ ctx: { user } });
});

export const authProcedure = trpc.procedure.use(auth);

import { threadRouter } from './threads';
import { messageRouter } from './messages';
import { userRouter } from './user';

const router = trpc.router({
    threads: threadRouter,
    messages: messageRouter,
    users: userRouter,
});

export type Router = typeof router;

const wss = new Server({ port: 3000 });
const handler = applyWSSHandler({
    wss,
    router,
    createContext() {
        return {};
    },
});

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
