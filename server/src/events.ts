import { Observer, observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { Thread } from '../prisma/generated';

interface Events {
    threadCreated: Thread;
    threadDeleted: Thread;
}

const eventEmitter = new EventEmitter();

export const emitEvent = <E extends keyof Events>(
    event: E,
    data: Events[E],
) => {
    eventEmitter.emit(event, data);
};

export const subscribe = <E extends keyof Events>(
    event: E,
    body: (data: Events[E], observer: Observer<Events[E], unknown>) => void,
) => {
    return observable<Events[E]>((observer) => {
        const handler = (data: Events[E]) => body(data, observer);
        eventEmitter.on(event, handler);
        return () => eventEmitter.off(event, handler);
    });
};
