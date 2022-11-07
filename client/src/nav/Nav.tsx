import { Dispatch, FC, Fragment, SetStateAction } from 'react';
import { trpc } from '..';
import produce from 'immer';
import { Divider, List } from '@mui/material';
import { NavHomeItem, NavItem } from './NavItem';

interface Props {
    selected: string | undefined;
    setSelected: Dispatch<SetStateAction<string | undefined>>;
}

export const Nav: FC<Props> = (props) => {
    const { data: threads } = trpc.threads.getThreads.useQuery();

    const utils = trpc.useContext();
    trpc.threads.threadCreated.useSubscription(undefined, {
        onData(createdThread) {
            utils.threads.getThreads.setData(
                produce((threads) => {
                    // Add thread to cache
                    threads?.push(createdThread);
                }),
            );
        },
    });

    trpc.threads.threadDeleted.useSubscription(undefined, {
        onData(createdThread) {
            utils.threads.getThreads.setData(
                produce((threads) => {
                    // Find the index of the thread that was deleted
                    const index = threads?.findIndex(
                        (thread) => thread.id === createdThread.id,
                    );

                    if (index === undefined) {
                        return;
                    }

                    // Use index to remove thread from cache
                    threads?.splice(index, 1);
                }),
            );
        },
    });

    return (
        <List>
            <NavHomeItem {...props} />
            {threads?.map((thread) => (
                <Fragment key={thread.id}>
                    <Divider />
                    <NavItem thread={thread} {...props} />
                </Fragment>
            ))}
        </List>
    );
};
