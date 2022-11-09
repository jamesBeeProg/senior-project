import { FC } from 'react';

interface Props {
    name: string;
    color?: string | null;
    avatar?: string | null;
    online?: boolean | null;
}

export const UserAvatar: FC<Props> = ({
    name,
    color,
    avatar,
    online,
}: Props) => {
    const style = avatar
        ? { backgroundImage: `url(https://gravatar.com/avatar/${avatar})` }
        : color
        ? { backgroundColor: '#' + color }
        : {};

    return (
        <div
            className="rounded-full w-10 h-10 grid place-items-center bg-contain relative"
            style={style}
        >
            {!avatar && name[0]}
            {online && (
                <span className="w-4 h-4 rounded-full border-2 border-neutral-800 absolute bottom-0 right-0 bg-online-500" />
            )}
        </div>
    );
};
