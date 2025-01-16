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

    return (
        <>
            <h1 className="m-0 mt-2 border-0 p-0 text-white">
                Welcome to the admin page {authUser.name}
            </h1>
            <h1 className="m-0 mt-2 p-0 pb-1 text-white">
                Total Game Count: {gameCount}
            </h1>
            <form onSubmit={FetchNewGames}>
                <button className="mt-1 text-white">Fetch New Games</button>
            </form>

            <div className="mt-5 flex flex-col justify-center bg-[#05283d] bg-opacity-75 text-white">
                <table className="table-fixed border-collapse rounded-md border border-[#9dbebb] text-center">
                    <tr>
                        <th>Avatar</th>
                        <th>Username</th>
                        <th>Favorite_Count</th>
                        <th>Is_Admin</th>
                        <th>Other</th>
                    </tr>

                    {users.map((user) => (
                        <tr key={user.steam_id}>
                            <td className="flex items-center justify-center border-b-0">
                                <img src={user.avatar} alt="" />
                            </td>
                            <td>
                                <p>{user.nickname}</p>
                            </td>
                            <td>
                                <p>{user.favorites_count}</p>
                            </td>
                            <td>
                                <p>{user.is_admin}</p>
                            </td>
                            <td>
                                <p>promote</p>
                            </td>
                        </tr>
                    ))}
                </table>

                <table className="mt-1 table-fixed border-collapse text-center">
                    <tr>
                        <th>Name</th>
                        <th>AppId</th>
                        <th>Developer</th>
                        <th>releaseDate</th>
                        <th>Type</th>
                        <th>Favorite_count</th>
                    </tr>

                    {topFavorite.map((favorite) => (
                        <tr
                            key={favorite.appId}
                            className={`bg-gradient-to-l text-white`}
                        >
                            <td>
                                <p>{favorite.name}</p>
                            </td>
                            <td>
                                <p>{favorite.appId}</p>
                            </td>
                            <td>
                                <p>{favorite.developer}</p>
                            </td>
                            <td>
                                <p>{favorite.releaseDate}</p>
                            </td>
                            <td>
                                <p>{favorite.type}</p>
                            </td>
                            <td>
                                <p>{favorite.favorites_count}</p>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </>
    );
}
