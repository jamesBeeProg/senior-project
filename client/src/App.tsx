import { FC, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Threads } from './Threads';

export const App: FC = () => {
    return (
        <ErrorBoundary fallback={<h1>Error!</h1>}>
            <Suspense fallback={<h1>Loading...</h1>}>
                <Threads />
            </Suspense>
        </ErrorBoundary>
    );
};
