import { prisma, trpc } from '.';
import z from 'zod';
import { emitEvent, subscribe } from './events';
import { Message, Thread } from '../prisma/generated';

export interface ThreadEvents {
    threadCreated: Thread;
    threadDeleted: Thread;
    messageCreated: Message;
}

export const threadRouter = trpc.router({
    getThreads: trpc.procedure.query(() => {
        return prisma.thread.findMany();
    }),

    createThread: trpc.procedure
        .input(z.object({ name: z.string().trim().min(2).max(20) }))
        .mutation(async ({ input }) => {
            const thread = await prisma.thread.create({ data: input });
            emitEvent('threadCreated', thread);
            return thread;
        }),

    threadCreated: trpc.procedure.subscription(() => {
        return subscribe('threadCreated', (data) => data);
    }),

    deleteThread: trpc.procedure
        .input(z.object({ id: z.string().cuid() }))
        .mutation(async ({ input }) => {
            const thread = await prisma.thread.delete({ where: input });
            emitEvent('threadDeleted', thread);
            return thread;
        }),

    threadDeleted: trpc.procedure.subscription(() => {
        return subscribe('threadDeleted', (data) => data);
    }),

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
