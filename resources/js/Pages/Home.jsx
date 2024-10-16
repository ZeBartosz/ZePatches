import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home({ games = { data: [] }, search, authUser }) {
    const [detailedGames, setDetailedGames] = useState(games.data || []);
    const { post, processing } = useForm({});

    // Effect to update detailed games when games prop changes
    useEffect(() => {
        setDetailedGames(games.data || []);
    }, [games]);

    // Fetch game details if moreDetails is 0
    useEffect(() => {
        if (detailedGames.length > 0) {
            detailedGames.forEach((game, index) => {
                if (game.moreDetails === 0) {
                    fetchGameDetails(game.appId, index);
                }
            });
        }
    }, [detailedGames]);

    const fetchGameDetails = async (appId, index) => {
        try {
            const response = await axios.get(`/games/details/${appId}`);
            const updatedGame = response.data;

            setDetailedGames((prevGames) =>
                prevGames.map((game, i) => (i === index ? updatedGame : game))
            );
        } catch (error) {
            console.error("Error fetching game details", error);
        }
    };

    const retrieveGameDataSubmit = (e) => {
        e.preventDefault();
        post("/inputGames");
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
            <div>
                {detailedGames.length > 0 ? (
                    detailedGames.map((game) => (
                        <div
                            key={game.id}
                            className="relative my-4 min-w-[500px] max-w-[500px]"
                        >
                            <div
                                className="absolute border-2 inset-0 bg-cover bg-center filter blur-[2px] rounded-lg"
                                style={{
                                    backgroundImage: `url(${game.banner})`,
                                    zIndex: 0,
                                }}
                            ></div>
                            <div className="text-white relative z-10 bg-black opacity-75 rounded-lg p-2">
                                <p className="p-1">AppId: {game.appId}</p>
                                <p className="p-1">Type: {game.type}</p>
                                <h2 className="font-medium">{game.name}</h2>
                                <Link href={`/game/${game.appId}`}>
                                    Check Patches
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No games found.</p>
                )}
            </div>

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
