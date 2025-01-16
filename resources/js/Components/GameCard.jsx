import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import favorite from "../../Assets/favorite.svg";
import favorited from "../../Assets/favorited.svg";

function GameCard({ initialGames, activeTab, tableId, search }) {
    const [games, setGames] = useState(initialGames.data || []);
    const { post, processing } = useForm({});

    // Update the games state when the 'initialGames' prop changes
    useEffect(() => {
        setGames(initialGames.data || []);
    }, [initialGames]);

    // Fetch additional game details
    useEffect(() => {
        const fetchGameDetails = async () => {
            const gamesToFetch = games.filter(
                (game) => game.appId && game.moreDetails === 0,
            );
            if (gamesToFetch.length > 0) {
                try {
                    const gameIds = gamesToFetch.map((game) => game.appId);
                    const response = await axios.post("games/batchDetails", {
                        appIds: gameIds,
                    });

                    const updatedGames = games.map((game) => {
                        const foundGame = response.data.find(
                            (g) => g.appId === game.appId,
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

    const addToFavorite = (e, steam) => {
        e.preventDefault();
        post(`/favorite/${steam}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            {games.length > 0 ? (
                games.map((game) => (
                    <div
                        key={game.id}
                        className={`relative my-3 w-[80%] lg:w-[50%] ${
                            activeTab === tableId ? "active" : "hidden"
                        }`}
                    >
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                window.location.href = `game/${game.appId}`;
                            }}
                        >
                            <div
                                className="absolute inset-0 cursor-pointer rounded-lg border-2 border-[#9dbebb] bg-center ring-1 ring-[#9dbebb] blur-[2px] drop-shadow-md filter"
                                style={{
                                    backgroundImage: `url(${game.banner})`,
                                    zIndex: 0,
                                }}
                            ></div>

                            <div className="z-10 flex flex-col justify-start rounded-lg bg-black p-2 text-white opacity-75">
                                <h2 className="py-1 font-bold">{game.name}</h2>
                                <p className="p-0 text-sm">
                                    AppId: {game.appId}
                                </p>
                                <p className="p-0 pb-2 text-sm">
                                    Type: {game.type}
                                </p>

                                {activeTab === "EventOrder" && (
                                    <>
                                        <p className="p-0 text-sm">
                                            Latest Event:{" "}
                                            {game.eventPatchesDate}
                                        </p>
                                    </>
                                )}

                                {activeTab === "PatchOrder" && (
                                    <>
                                        <p className="p-0 text-sm">
                                            Latest Patch: {game.patchNotesDate}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="absolute right-[10px] top-[35%]">
                            <form onSubmit={(e) => addToFavorite(e, game.id)}>
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
                ))
            ) : (
                <div
                    className={`${activeTab === tableId ? "active" : "hidden"}`}
                >
                    <p>No games found.</p>
                </div>
            )}

            <div
                className={`mb-4 mt-4 flex justify-center ${
                    activeTab === tableId ? "active" : "hidden"
                }`}
            >
                {initialGames.links &&
                    initialGames.links[2].url &&
                    initialGames.links.map((link, index) => {
                        const query = search ? `&query=${search}` : "";
                        return (
                            <Link
                                key={index}
                                href={link.url ? `${link.url}${query}` : "#"}
                                className={`p-2 ${
                                    link.active ? "bg-blue-500 text-white" : ""
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        );
                    })}
            </div>
        </>
    );
}

export default GameCard;
