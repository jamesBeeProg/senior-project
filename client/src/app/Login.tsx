interface Props {
    userId: string;
    setUserId(userId: string): void;
    login(user: { id: string }): void;
}

export const Login = ({ userId, setUserId, login }: Props) => {
    return (
        <div className="grid place-items-center h-screen overflow-hidden bg-neutral-900 text-text">
            <input
                className="w-2/6 bg-neutral-700 rounded p-4"
                placeholder="Token"
                value={userId}
                onChange={(e) => {
                    setUserId(e.target.value);
                    localStorage.setItem('userId', e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter' || !userId) {
                        return;
                    }

                    login({ id: userId });
                }}
            />
        </div>
    );
};
