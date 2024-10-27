import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import favorite from "../../Assets/favorite.svg";
import favorited from "../../Assets/favorited.svg";

export default function Home({ games, search, authUser }) {
    const [detailedGames, setDetailedGames] = useState(games.data || []);
    const { post, processing } = useForm({});
    const [favorites, setFavorites] = useState({});

    // Update the detailedGames state when the 'games' prop changes
    useEffect(() => {
        setDetailedGames(games.data || []);
    }, [games]);

    // Fetch favorite status for each game
    useEffect(() => {
        if (authUser && detailedGames.length > 0) {
            detailedGames.forEach(async (game) => {
                const response = await axios.get(
                    `/favorites/${authUser.id}/${game.id}`
                );
                setFavorites((prev) => ({
                    ...prev,
                    [game.id]: response.data.favorited,
                }));
            });
        }
    }, [authUser, detailedGames]);

    // Fetch additional game details
    useEffect(() => {
        const fetchGameDetails = async () => {
            const gamesToFetch = detailedGames.filter(
                (game) => game.appId && !game.moreDetails
            );
            if (gamesToFetch.length > 0) {
                try {
                    const gameIds = gamesToFetch.map((game) => game.appId);
                    const response = await axios.post("/games/batchDetails", {
                        appIds: gameIds,
                    });

                    const updatedGames = detailedGames.map((game) => {
                        const foundGame = response.data.find(
                            (g) => g.appId === game.appId
                        );
                        return foundGame ? { ...game, ...foundGame } : game;
                    });
                    setDetailedGames(updatedGames);
                } catch (error) {
                    console.error("Error fetching game details", error);
                }
            }
        };
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
                        <div className="flex text-white z-10 bg-black opacity-75 rounded-lg p-2">
                            <div className="flex flex-col justify-start">
                                <h2 className="font-bold py-1 ">{game.name}</h2>
                                <p className="p-0 text-sm">
                                    AppId: {game.appId}
                                </p>
                                <p className="p-0 text-sm">Type: {game.type}</p>

                                <Link href={`/game/${game.appId}`}>
                                    Check Patches
                                </Link>
                            </div>

                            <div className="flex justify-end items-center ml-auto">
                                <form
                                    onSubmit={(e) => addToFavorite(e, game.id)}
                                >
                                    <button className="" type="submit">
                                        {favorites[game.id] ? (
                                            <img
                                                src={favorited}
                                                className="h-22 w-22 fill-current"
                                                alt="Favorited Icon"
                                            />
                                        ) : (
                                            <img
                                                src={favorite}
                                                className="h-22 w-22 fill-current"
                                                alt="Favorite Icon"
                                            />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No games found.</p>
            )}

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
