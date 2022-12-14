import { authProcedure, prisma, trpc } from '.';
import z from 'zod';
import { emitEvent, subscribe } from './events';
import { Message, User } from '../prisma/generated';
import { TRPCError } from '@trpc/server';

export interface MessageEvents {
    messageCreated: Message & { author: User };
    messageDeleted: Message;
}

export const messageRouter = trpc.router({
    getMessages: trpc.procedure
        .input(z.object({ threadId: z.string().cuid() }))
        .query(({ input }) => {
            return prisma.message.findMany({
                where: input,
                orderBy: { id: 'desc' },
                include: {
                    author: true,
                },
            });
        }),

    createMessage: authProcedure
        .input(
            z.object({
                threadId: z.string().cuid(),
                content: z.string().max(1000),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const message = await prisma.message.create({
                data: {
                    ...input,
                    authorId: ctx.user.id,
                },
                include: {
                    author: true,
                },
            });
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

    deleteMessage: trpc.procedure
        .input(z.object({ id: z.string().cuid() }))
        .mutation(async ({ input, ctx }) => {
            const message = await prisma.message.findFirstOrThrow({
                where: input,
            });

            if (message.authorId !== ctx.userId) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }

            await prisma.message.delete({ where: input });
            emitEvent('messageDeleted', message);
            return message;
        }),

    messageDeleted: trpc.procedure
        .input(z.object({ threadId: z.string().cuid() }))
        .subscription(({ input }) => {
            return subscribe('messageDeleted', (data) => {
                if (input.threadId === data.threadId) {
                    return data;
                }
            });
        }),
});
