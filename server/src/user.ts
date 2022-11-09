import { TRPCError } from '@trpc/server';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';
import { prisma, trpc } from '.';
import { User } from '../prisma/generated';
import { emitEvent, subscribe } from './events';

export interface UserEvents {
    userCreated: User;
    userUpdated: User;
}

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

    getUsers: trpc.procedure.query(async () => {
        return await prisma.user.findMany();
    }),

    createUser: trpc.procedure
        .input(
            z.object({
                name: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const user = await prisma.user.create({ data: input });
            emitEvent('userCreated', user);
            return user;
        }),

    userCreated: trpc.procedure.subscription(() => {
        return subscribe('userCreated', (data) => data);
    }),

    updateUser: trpc.procedure
        .input(
            z.object({
                id: z.string().cuid(),
                name: z.string().optional(),
                color: z
                    .string()
                    .regex(/^[a-f0-9]{6}$/i)
                    .optional(),
                avatar: z
                    .string()
                    .regex(/^[a-f0-9]{32}$/i)
                    .optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const user = await prisma.user.update({
                where: {
                    id: input.id,
                },
                data: input,
            });
            emitEvent('userUpdated', user);
            return user;
        }),
});
