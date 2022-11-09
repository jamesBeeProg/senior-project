import { CircularProgress } from '@mui/material';
import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Nav } from '../nav/Nav';
import { Users } from '../users/Users';

export const Main: FC = () => {
    return (
        <div
            className="grid grid-cols-6 h-screen w-screen overflow-hidden bg-neutral-900 gap-2 text-text"
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="col-span-1 bg-neutral-800 ">
                <Suspense fallback={<CircularProgress />}>
                    <Nav />
                </Suspense>
            </div>
            <div className="col-span-4 bg-neutral-800">
                <Suspense fallback={<CircularProgress />}>
                    <Outlet />
                </Suspense>
            </div>
            <div className="col-span-1 flex justify-center items-center gap-4 bg-neutral-800">
                <Suspense fallback={<CircularProgress />}>
                    <Users />
                </Suspense>
            </div>
        </div>
    );
};
