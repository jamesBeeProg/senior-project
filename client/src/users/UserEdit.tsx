import { FC, useMemo, useState } from 'react';
import { trpc } from '..';
import { useAuth } from '../app/Auth';
import { MessageAuthor } from '../messages/MessageAuthor';

export const UserEdit: FC = () => {
    const { user } = useAuth();

    const [nameDraft, setName] = useState(user.name);
    const [colorDraft, setColor] = useState(user.color ?? '');
    const [avatarDraft, setAvatar] = useState(user.avatar ?? '');

    const { mutate: updateUser } = trpc.users.updateUser.useMutation();

    const color = useMemo(() => {
        if (colorDraft.length === 0) {
            return null;
        }

        if (/^[a-f0-9]{6}$/i.test(colorDraft)) {
            return colorDraft;
        } else {
            return undefined;
        }
    }, [colorDraft]);

    const avatar = useMemo(() => {
        if (avatarDraft.length === 0) {
            return null;
        }

        if (/^[a-f0-9]{32}$/i.test(avatarDraft)) {
            return avatarDraft;
        } else {
            return undefined;
        }
    }, [avatarDraft]);

    const submit = () =>
        updateUser({
            id: user.id,
            name: nameDraft,
            color,
            avatar,
        });

    return (
        <div className="grid h-full place-items-center">
            <div className="flex flex-col w-1/2">
                <label>Name</label>
                <input
                    className="bg-neutral-700 rounded p-1"
                    value={nameDraft}
                    onChange={(e) => setName(e.target.value)}
                />

                <label
                    className={
                        'mt-4 ' +
                        (typeof color === 'undefined' ? 'text-error-500' : '')
                    }
                >
                    Color
                </label>
                <input
                    className="bg-neutral-700 rounded p-1"
                    value={colorDraft ?? ''}
                    onChange={(e) => setColor(e.target.value)}
                />

                <label
                    className={
                        'mt-4 ' +
                        (typeof avatar === 'undefined' ? 'text-error-500' : '')
                    }
                >
                    Avatar
                </label>
                <input
                    className="mb-4 p-1 bg-neutral-700 rounded"
                    value={avatarDraft ?? ''}
                    onChange={(e) => setAvatar(e.target.value)}
                />

                <MessageAuthor
                    author={{
                        id: user.id,
                        name: nameDraft,
                        color: colorDraft,
                        avatar: avatarDraft,
                        updatedAt: new Date(),
                        createdAt: new Date(),
                    }}
                />

                <button
                    className="mt-4 p-2 rounded bg-primary-600 hover:bg-primary-400"
                    onClick={submit}
                >
                    Update User
                </button>
            </div>
        </div>
    );
};
