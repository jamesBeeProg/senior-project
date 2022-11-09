import { FC } from 'react';
import { User } from 'splist-server/prisma/generated';
import { trpc } from '..';
import { MessageAuthor } from '../messages/MessageAuthor';

interface Props {
    user: User;
    logout(): void;
}

export const Users: FC<Props> = ({ user, logout }) => {
    const { data: users } = trpc.users.getUsers.useQuery();

    return (
        <div className="flex flex-col gap-4 p-4 h-screen">
            <MessageAuthor key={user.id} author={user} />
            <button className="hover:underline" onClick={logout}>
                Logout
            </button>

            <div className="flex flex-col gap-4 overflow-auto">
                {users?.map((user) => (
                    <MessageAuthor key={user.id} author={user} />
                ))}
            </div>
        </div>
    );
};
