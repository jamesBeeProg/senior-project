import { CircularProgress } from '@mui/material';
import { FC, Suspense, useEffect, useState } from 'react';
import { trpc } from '.';
import { Messages } from './messages/Messages';
import { Nav } from './nav/Nav';
import { Threads } from './threads/Threads';
import { UserAvatar } from './users/UserAvatar';

export const App: FC = () => {
    const [selected, setSelected] = useState<string>();
    const {
        mutate,
        data: user,
        error,
        reset,
    } = trpc.users.login.useMutation({
        useErrorBoundary: false,
    });
    const [userId, setUserId] = useState(localStorage.getItem('userId') ?? '');

    useEffect(() => {
        if (userId) {
            mutate({ id: userId });
        }
    }, []);

    if (error || !user) {
        return (
            <div className="grid place-items-center h-screen overflow-hidden bg-neutral-900 text-text">
                <input
                    className="w-2/6 bg-neutral-700 rounded p-4"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => {
                        setUserId(e.target.value);
                        localStorage.setItem('userId', e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key !== 'Enter' || !userId) {
                            return;
                        }

                        mutate({ id: userId });
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className="grid grid-cols-6 h-screen w-screen overflow-hidden bg-neutral-900 gap-2 text-text"
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="col-span-1 bg-neutral-800 ">
                <Suspense fallback={<CircularProgress />}>
                    <Nav selected={selected} setSelected={setSelected} />
                </Suspense>
            </div>
            <div className="col-span-4 bg-neutral-800">
                <Suspense fallback={<CircularProgress />}>
                    {selected ? (
                        <Messages threadId={selected} />
                    ) : (
                        <Threads
                            selected={selected}
                            setSelected={setSelected}
                        />
                    )}
                </Suspense>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-4 bg-neutral-800">
                <UserAvatar {...user} />
                <span className="block">{user.name}</span>
                <button className="hover:underline" onClick={reset}>
                    Logout
                </button>
            </div>
        </div>
    );
};
