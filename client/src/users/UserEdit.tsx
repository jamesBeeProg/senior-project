import { FC, useMemo, useState } from 'react';
import { trpc } from '..';
import { useAuth } from '../app/Auth';
import { MessageAuthor } from '../messages/MessageAuthor';

export const UserEdit: FC = () => {
    const { user } = useAuth();

    const [nameDraft, setName] = useState(user.name);
    const [colorDraft, setColor] = useState(user.color ?? '');
    const [avatarDraft, setAvatar] = useState(user.avatar ?? '');

    const colorIsValid = useMemo(() => {
        if (colorDraft.length === 0) {
            return true;
        }

        return /^[a-f0-9]{6}$/i.test(colorDraft);
    }, [colorDraft]);

    const avatarIsValid = useMemo(() => {
        if (avatarDraft.length === 0) {
            return true;
        }

        return /^[a-f0-9]{32}$/i.test(avatarDraft);
    }, [avatarDraft]);

    return (
        <div className="grid h-full place-items-center">
            <div className="flex flex-col">
                <label>Name</label>
                <input
                    className="bg-neutral-700 rounded"
                    value={nameDraft}
                    onChange={(e) => setName(e.target.value)}
                />

                <label
                    className={'mt-4 ' + (colorIsValid ? '' : 'text-error-500')}
                >
                    Color
                </label>
                <input
                    className="bg-neutral-700 rounded"
                    value={colorDraft ?? ''}
                    onChange={(e) => setColor(e.target.value)}
                />

                <label
                    className={
                        'mt-4 ' + (avatarIsValid ? '' : 'text-error-500')
                    }
                >
                    Avatar
                </label>
                <input
                    className="mb-4 bg-neutral-700 rounded"
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
            </div>
        </div>
    );
};
