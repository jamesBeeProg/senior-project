import { TRPCError } from '@trpc/server';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';
import { prisma, trpc } from '.';

export const userRouter = trpc.router({
    login: trpc.procedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const token = verify(input.id, process.env.TOKEN_SECRET ?? '');
            if (typeof token === 'string' || !token.sub) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    id: token.sub,
                },
            });
            ctx.userId = user.id;
            return user;
        }),
});
