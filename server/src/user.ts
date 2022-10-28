import { z } from 'zod';
import { prisma, trpc } from '.';

export const userRouter = trpc.router({
    login: trpc.procedure
        .input(z.object({ id: z.string().cuid() }))
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findUniqueOrThrow({ where: input });
            ctx.userId = user.id;
            return user;
        }),
});
