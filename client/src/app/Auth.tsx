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
    const {
        mutate: login,
        data: user,
        error,
        reset: logout,
    } = trpc.users.login.useMutation({
        useErrorBoundary: false,
    });
    const [userId, setUserId] = useState(localStorage.getItem('userId') ?? '');

    useEffect(() => {
        if (userId) {
            login({ id: userId });
        }
    }, []);

    if (error || !user) {
        return <Login userId={userId} setUserId={setUserId} login={login} />;
    }

    return (
        <AuthContext.Provider value={{ user, logout }}>
            <Main />
        </AuthContext.Provider>
    );
};
