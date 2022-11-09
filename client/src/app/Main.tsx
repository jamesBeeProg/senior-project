import { CircularProgress } from '@mui/material';
import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import type { User } from 'splist-server/prisma/generated';
import { Messages } from '../messages/Messages';
import { Nav } from '../nav/Nav';
import { SelectedThreadProps, Threads } from '../threads/Threads';
import { Users } from '../users/Users';

interface Props extends SelectedThreadProps {
    logout(): void;
    user: User;
}

export const Main: FC<Props> = ({ selected, setSelected, user, logout }) => {
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
                    <Outlet />
                </Suspense>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-4 bg-neutral-800">
                <Suspense fallback={<CircularProgress />}>
                    <Users user={user} logout={logout} />
                </Suspense>
            </div>
        </div>
    );
};
