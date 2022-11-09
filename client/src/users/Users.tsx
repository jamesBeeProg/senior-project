import { FC } from 'react';
import { trpc } from '..';
import { useAuth } from '../app/Auth';
import { MessageAuthor } from '../messages/MessageAuthor';

export const Users: FC = () => {
    const { user, logout } = useAuth();
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
