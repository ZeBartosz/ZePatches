import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import favorite from "../../Assets/favorite.svg";
import favorited from "../../Assets/favorited.svg";

export default function Home({ games: initialGames, search, authUser }) {
    const [games, setGames] = useState(initialGames.data || []);
    const { post, processing } = useForm({});

    console.log(games);
    // Update the games state when the 'initialGames' prop changes
    useEffect(() => {
        setGames(initialGames.data || []);
    }, [initialGames]);

    // Fetch additional game details
    useEffect(() => {
        const fetchGameDetails = async () => {
            const gamesToFetch = games.filter(
                (game) => game.appId && !game.moreDetails
            );
            if (gamesToFetch.length > 0) {
                try {
                    const gameIds = gamesToFetch.map((game) => game.appId);
                    const response = await axios.post("/games/batchDetails", {
                        appIds: gameIds,
                    });

                    const updatedGames = games.map((game) => {
                        const foundGame = response.data.find(
                            (g) => g.appId === game.appId
                        );
                        return foundGame ? { ...game, ...foundGame } : game;
                    });
                    setGames(updatedGames);
                } catch (error) {
                    console.error("Error fetching game details", error);
                }
            }
        };
        fetchGameDetails();
    }, [games]);

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
            {search && (
                <div className="flex flex-col">
                    <h1 className="pb-1 mb-0">Searched for: {search}</h1>
                    <p className="flex justify-center text-sm text-gray-600 mt-0 pt-0">
                        Total Results: {initialGames.total || 0}
                    </p>
                </div>
            )}

            {games.length > 0 ? (
                games.map((game) => (
                    <div
                        key={game.id}
                        className="relative my-3 w-[80%] lg:w-[50%]"
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

                                <Link
                                    className="no-underline"
                                    href={`/game/${game.appId}`}
                                >
                                    Check Patches
                                </Link>
                            </div>

                            <div className="flex justify-end items-center ml-auto">
                                <form
                                    onSubmit={(e) => addToFavorite(e, game.id)}
                                >
                                    <button className="" type="submit">
                                        {game.is_favorite ? (
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
                {initialGames.links &&
                    initialGames.links.length > 0 &&
                    initialGames.links.map((link, index) => {
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
