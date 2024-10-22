import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home({ games, search, authUser }) {
    const [detailedGames, setDetailedGames] = useState(games.data || []);
    const { post, processing } = useForm({});

    // Update the detailedGames state when the 'games' prop changes
    useEffect(() => {
        // Set detailedGames to the data from the games prop or an empty array
        setDetailedGames(games.data || []);
    }, [games]);

    // Fetch additional details for games with an appId that haven't been fetched yet
    useEffect(() => {
        // Define an asynchronous function to fetch game details
        const fetchGameDetails = async () => {
            // Filter the detailedGames to find those with an appId and that haven't had their details fetched
            const gamesToFetch = detailedGames.filter(
                (game) => game.appId && !game.moreDetails
            );
            console.log(gamesToFetch);

            // Check if there are any games to fetch
            if (gamesToFetch.length > 0) {
                try {
                    // Map the gamesToFetch to extract their appIds
                    const gameIds = gamesToFetch.map((game) => game.appId);

                    // Make a POST request to the API to fetch details for the appIds
                    const response = await axios.post("/games/batchDetails", {
                        appIds: gameIds,
                    });

                    // Update the detailedGames state with the response data
                    const updatedGames = detailedGames.map((game) => {
                        const foundGame = response.data.find(
                            (g) => g.appId === game.appId
                        );
                        return foundGame ? { ...game, ...foundGame } : game;
                    });

                    // Set the updated detailedGames
                    setDetailedGames(updatedGames);
                } catch (error) {
                    // Log any errors encountered during the fetching process
                    console.error("Error fetching game details", error);
                }
            }
        };

        // Call the fetchGameDetails function to initiate the fetching process
        fetchGameDetails();
    }, [detailedGames]);

    const retrieveGameDataSubmit = (e) => {
        e.preventDefault();
        post("/inputGames");
    };

    const addToFavorite = (e, steam) => {
        e.preventDefault();
        post(`/favorite/${steam}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            {authUser ? <h1>{authUser.name}</h1> : "No user"}
            {search && (
                <div className="flex flex-col">
                    <h1 className="">Searched for: {search}</h1>
                    <p className="flex justify-center text-sm text-gray-600">
                        Total Results: {games.total || 0}
                    </p>
                </div>
            )}

            <div className="p-2">
                <form onSubmit={retrieveGameDataSubmit}>
                    <button
                        id="addGames"
                        className={`border-2 p-2 ${
                            processing ? "bg-red-600" : "bg-gray-700"
                        }`}
                        disabled={processing}
                    >
                        {processing ? "Adding games..." : "Add games from API"}
                    </button>
                </form>
            </div>

            {/* Displaying the games */}
            {detailedGames.length > 0 ? (
                detailedGames.map((game) => (
                    <div
                        key={game.id}
                        className="relative my-4 min-w-[500px] max-w-[500px]"
                    >
                        <div
                            className="absolute border-2 border-[#66c0f4] inset-0 bg-cover bg-center filter blur-[2px] rounded-lg"
                            style={{
                                backgroundImage: `url(${game.banner})`,
                                zIndex: 0,
                            }}
                        ></div>
                        <div className="text-white relative z-10 bg-black opacity-75 rounded-lg p-2">
                            <p className="p-1">AppId: {game.appId}</p>
                            <p className="p-1">Type: {game.type}</p>
                            <h2 className="font-medium">{game.name}</h2>
                            <form onSubmit={(e) => addToFavorite(e, game.id)}>
                                <button className="border p-3" type="submit">
                                    Fav
                                </button>
                            </form>
                            <Link href={`/game/${game.appId}`}>
                                Check Patches
                            </Link>
                        </div>
                    </div>
                ))
            ) : (
                <p>No games found.</p>
            )}

            {/* Pagination links */}
            <div className="flex justify-center mt-4">
                {games.links &&
                    games.links.length > 0 &&
                    games.links.map((link, index) => {
                        const query = search ? `&query=${search}` : "";
                        return (
                            <Link
                                key={index}
                                href={link.url ? `${link.url}${query}` : "#"}
                                className={` p-2 ${
                                    link.active ? "bg-blue-500 text-white" : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
            </div>
        </>
    );
}
