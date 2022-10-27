import { prisma, t } from '.';
import z from 'zod';

const threadRouter = t.router({
    getThreads: t.procedure.query(() => {
        return prisma.thread.findMany();
    }),

    createThread: t.procedure
        .input(z.object({ name: z.string().min(2).max(20).trim() }))
        .mutation(({ input }) => {
            return prisma.thread.create({ data: input });
        }),
});
