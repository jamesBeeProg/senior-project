import produce from 'immer';
import { FC } from 'react';
import { trpc } from '..';
import { useAuth } from '../app/Auth';
import { MessageAuthor } from '../messages/MessageAuthor';

export const Users: FC = () => {
    const { user, logout } = useAuth();
    const { data: users } = trpc.users.getUsers.useQuery();

    const context = trpc.useContext();
    trpc.users.userUpdated.useSubscription(undefined, {
        onData(updatedUser) {
            context.users.getUsers.setData(
                produce((users) => {
                    const index = users?.findIndex(
                        (user) => user.id === updatedUser.id,
                    );

                    if (!users || index === undefined) {
                        return;
                    }

                    users[index] = updatedUser;
                }),
            );
        },
    });

    return (
        <div className="flex flex-col gap-4 p-4 h-screen w-full">
            <MessageAuthor key={user.id} author={user} />
            <button
                className="mt-4 p-2 rounded bg-primary-600 hover:bg-primary-400"
                onClick={logout}
            >
                Logout
            </button>

            <div className="flex flex-col gap-4 overflow-y-auto">
                {users?.map((user) => (
                    <MessageAuthor key={user.id} author={user} />
                ))}
            </div>
        </div>
    );
};
