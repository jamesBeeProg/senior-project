import { FC, Suspense } from 'react';
import { trpc } from '.';
import { ErrorBoundary } from 'react-error-boundary';

export const App: FC = () => {
    return (
        <ErrorBoundary fallback={<h1>Error!</h1>}>
            <Suspense fallback={<h1>Loading...</h1>}>
                <Hello />
            </Suspense>
        </ErrorBoundary>
    );
};

export const Hello: FC = () => {
    const { data } = trpc.hello.useQuery();
    return <h1>{data}</h1>;
};
