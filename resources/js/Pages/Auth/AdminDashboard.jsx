import { useForm } from "@inertiajs/react";

export default function AdminDashboard({
    authUser,
    gameCount,
    users,
    topFavorite,
}) {
    const { post, processing } = useForm({});

    const FetchNewGames = (e) => {
        e.preventDefault();
        post("/fetchGames");
    };

    console.log(topFavorite);

    return (
        <>
            <h1>welcome to the admin page {authUser.name}</h1>
            <h1>Total Game Count: {gameCount}</h1>
            <form onSubmit={FetchNewGames}>
                <button className="text-white">Fetch New Games</button>
            </form>

            <div>
                <table className="table-fixed border-collapse border border-slate-500">
                    <tr>
                        <th className="border border-slate-600">Avatar</th>
                        <th className="border border-slate-600">Username</th>
                        <th className="border border-slate-600">
                            Favorite_Count
                        </th>
                        <th className="border border-slate-600">Is_Admin</th>
                        <th className="border border-slate-600">Other</th>
                    </tr>

                    {users.map((user) => (
                        <tr key={user.steam_id}>
                            <td className="border border-slate-700">
                                <img src={user.avatar} alt="" />
                            </td>
                            <td className="border border-slate-700">
                                <p>{user.nickname}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>{user.favorites_count}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>{user.is_admin}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>promote</p>
                            </td>
                        </tr>
                    ))}
                </table>

                <table className="table-fixed border-collapse mt-1">
                    <tr>
                        <th className="border border-slate-600">Name</th>
                        <th className="border border-slate-600">AppId</th>
                        <th className="border border-slate-600">Developer</th>
                        <th className="border border-slate-600">releaseDate</th>
                        <th className="border border-slate-600">Type</th>
                        <th className="border border-slate-600">
                            Favorite_count
                        </th>
                    </tr>

                    {topFavorite.map((favorite) => (
                        <tr key={favorite.appId} className={`bg-gradient-to-l`}>
                            <td className="border border-slate-700">
                                <p>{favorite.name}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>{favorite.appId}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>{favorite.developer}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>{favorite.releaseDate}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>{favorite.type}</p>
                            </td>
                            <td className="border border-slate-700">
                                <p>{favorite.favorites_count}</p>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </>
    );
}
