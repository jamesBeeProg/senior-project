import { prisma, trpc } from '.';
import z from 'zod';

export const threadRouter = trpc.router({
    getThreads: trpc.procedure.query(() => {
        return prisma.thread.findMany();
    }),

    createThread: trpc.procedure
        .input(z.object({ name: z.string().min(2).max(20).trim() }))
        .mutation(({ input }) => {
            return prisma.thread.create({ data: input });
        }),
});
