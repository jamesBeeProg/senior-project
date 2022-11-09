import { FC } from 'react';

interface Props {
    name: string;
    color?: string | null;
    avatar?: string | null;
}

export const UserAvatar: FC<Props> = ({ name, color, avatar }: Props) => {
    const style = avatar
        ? { backgroundImage: `url(https://gravatar.com/avatar/${avatar})` }
        : color
        ? { backgroundColor: '#' + color }
        : {};

    return (
        <div
            className="rounded-full w-10 h-10 grid place-items-center bg-contain"
            style={style}
        >
            {!avatar && name[0]}
        </div>
    );
};
