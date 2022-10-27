import { prisma, trpc } from '.';
import z from 'zod';
import { emitEvent, subscribe } from './events';
import { Message } from '../prisma/generated';

export interface MessageEvents {
    messageCreated: Message;
}

export const messageRouter = trpc.router({
    getMessages: trpc.procedure
        .input(z.object({ threadId: z.string().cuid() }))
        .query(({ input }) => {
            return prisma.message.findMany({
                where: input,
                orderBy: { id: 'desc' },
            });
        }),

    createMessage: trpc.procedure
        .input(
            z.object({
                threadId: z.string().cuid(),
                content: z.string().trim().min(1).max(1000),
            }),
        )
        .mutation(async ({ input }) => {
            const message = await prisma.message.create({ data: input });
            emitEvent('messageCreated', message);
            return message;
        }),

    messageCreated: trpc.procedure
        .input(z.object({ threadId: z.string().cuid() }))
        .subscription(({ input }) => {
            return subscribe('messageCreated', (data) => {
                if (input.threadId === data.threadId) {
                    return data;
                }
            });
        }),
});
