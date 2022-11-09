import { FC, useEffect, useState } from 'react';
import { trpc } from '..';
import { Login } from './Login';
import { Main } from './Main';

export const Auth: FC = () => {
    const [selected, setSelected] = useState<string>();
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
        <Main
            selected={selected}
            setSelected={setSelected}
            user={user}
            logout={logout}
        />
    );
};
