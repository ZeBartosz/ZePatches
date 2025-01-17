import { useForm } from "@inertiajs/react";

export default function AdminDashboard({
    authUser,
    gameCount,
    users,
    topFavorite,
}) {
    const { post, processing } = useForm({});
    console.log(authUser);
    const FetchNewGames = (e) => {
        e.preventDefault();
        post("/fetchGames");
    };

    return (
        <>
            <div className="motion-preset-focus-sm motion-duration-2000">
                <h1 className="m-0 mt-2 border-0 p-0 text-white">
                    Welcome to the Admin Page {authUser.name}
                </h1>
                <h1 className="m-0 mt-2 p-0 pb-1 text-white">
                    Total Game Count: {gameCount}
                </h1>
            </div>
            <form onSubmit={FetchNewGames}>
                <button className="motion-preset-slide-left-sm my-2 me-2 rounded-lg border border-[#9dbebb] bg-[#05283d] px-5 py-2.5 text-sm font-medium text-gray-200 hover:bg-[#47828a] hover:text-white focus:ring-[#9dbebb]">
                    Fetch New Games
                </button>
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
                                {authUser.is_admin && 0 ? (
                                    <button className="rounded-lg border bg-green-600 p-2">
                                        Promote
                                    </button>
                                ) : authUser.id && user.id ? (
                                    <button
                                        disabled
                                        className="rounded-lg border bg-gray-900 p-2"
                                    >
                                        Demote
                                    </button>
                                ) : (
                                    <button
                                        className="rounded-lg border bg-red-600 p-2"
                                        type="submit"
                                    >
                                        Demote
                                    </button>
                                )}
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
