import { prisma, trpc } from '.';
import z from 'zod';
import { emitEvent, subscribe } from './events';

export const threadRouter = trpc.router({
    getThreads: trpc.procedure.query(() => {
        return prisma.thread.findMany();
    }),

    createThread: trpc.procedure
        .input(z.object({ name: z.string().min(2).max(20).trim() }))
        .mutation(async ({ input }) => {
            const thread = await prisma.thread.create({ data: input });
            emitEvent('threadCreated', thread);
            return thread;
        }),

    threadCreated: trpc.procedure.subscription(() => {
        return subscribe('threadCreated', (data, observer) => {
            observer.next(data);
        });
    }),

    deleteThread: trpc.procedure
        .input(z.object({ id: z.string().cuid() }))
        .mutation(async ({ input }) => {
            const thread = await prisma.thread.delete({ where: input });
            emitEvent('threadDeleted', thread);
            return thread;
        }),

    threadDeleted: trpc.procedure.subscription(() => {
        return subscribe('threadDeleted', (data, observer) => {
            observer.next(data);
        });
    }),
});
