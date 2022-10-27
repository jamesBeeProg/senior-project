import { Observer, observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { MessageEvents } from './messages';
import { ThreadEvents } from './threads';

interface Events extends ThreadEvents, MessageEvents {}

const eventEmitter = new EventEmitter();

export const emitEvent = <E extends keyof Events>(
    event: E,
    data: Events[E],
) => {
    eventEmitter.emit(event, data);
};

export const subscribe = <E extends keyof Events, T>(
    event: E,
    body: (data: Events[E]) => T | undefined,
) => {
    return observable<T>((observer) => {
        const handler = (data: Events[E]) => {
            const output = body(data);
            if (output) {
                observer.next(output);
            }
        };
        eventEmitter.on(event, handler);
        return () => eventEmitter.off(event, handler);
    });
};
