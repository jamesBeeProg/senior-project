import { prisma, trpc } from '.';
import z from 'zod';
import { emitEvent, subscribe } from './events';
import { Thread } from '../prisma/generated';

export interface ThreadEvents {
    threadCreated: Thread;
    threadDeleted: Thread;
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
});
