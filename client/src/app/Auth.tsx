import { createContext, FC, useContext, useEffect, useState } from 'react';
import { User } from 'splist-server/prisma/generated';
import { trpc } from '..';
import { Login } from './Login';
import { Main } from './Main';

interface AuthContext {
    logout(): void;
    user: User;
}

const AuthContext = createContext(null as unknown as AuthContext);

export const useAuth = () => useContext(AuthContext);

export const Auth: FC = () => {
    const [user, setUser] = useState<User | undefined>();

    const { mutate: login, error } = trpc.users.login.useMutation({
        useErrorBoundary: false,
        onSuccess(data) {
            setUser(data);
        },
    });
    const [userId, setUserId] = useState(localStorage.getItem('userId') ?? '');

    useEffect(() => {
        if (userId) {
            login({ id: userId });
        }
    }, []);

    trpc.users.userUpdated.useSubscription(undefined, {
        onData(updatedUser) {
            setUser((user) => {
                if (user && updatedUser.id === user.id) {
                    return updatedUser;
                } else {
                    return user;
                }
            });
        },
    });

    if (error || !user) {
        return <Login userId={userId} setUserId={setUserId} login={login} />;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                logout() {
                    setUser(undefined);
                },
            }}
        >
            <Main />
        </AuthContext.Provider>
    );
};
