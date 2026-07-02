type WelcomeCardProps = {
    name: string;
};

export default function WelcomeCard({
    name,
}: WelcomeCardProps) {
    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <h1 className="text-3xl font-bold">
                Welcome, {name} 👋
            </h1>

            <p className="mt-2 text-gray-600">
                Ready to solve today's challenge?
            </p>
        </div>
    );
}