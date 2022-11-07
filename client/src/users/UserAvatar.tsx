import { FC } from 'react';

interface Props {
    name: string;
    color?: string | null;
}

export const UserAvatar: FC<Props> = ({ name, color }: Props) => {
    const backgroundColor = color ? '#' + color : '';
    return (
        <div
            className="rounded-full w-10 h-10 grid place-items-center"
            style={{ backgroundColor }}
        >
            {name[0]}
        </div>
    );
};
