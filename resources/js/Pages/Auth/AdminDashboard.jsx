import { useForm } from "@inertiajs/react";

export default function AdminDashboard({ authUser, gameCount }) {
    const { post, processing } = useForm({});

    const FetchNewGames = (e) => {
        e.preventDefault();
        post("/fetchGames");
    };

    return (
        <>
            <h1>welcome to the admin page {authUser.name}</h1>
            <h1>Total Game Count: {gameCount}</h1>
            <form onSubmit={FetchNewGames}>
                <button className="text-white">Fetch New Games</button>
            </form>
        </>
    );
}
