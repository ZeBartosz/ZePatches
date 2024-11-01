import React from "react";
import GameCard from "../Components/GameCard";

export default function Home({
    games,
    eventOrder,
    patchesOrder,
    search,
    authUser,
}) {
    return (
        <>
            {search ? (
                <div className="flex flex-col">
                    <h1 className="pb-1 mb-0">Searched for: {search}</h1>
                    <p className="flex justify-center text-sm text-gray-600 mt-0 pt-0">
                        Total Results: {games.total || 0}
                    </p>
                </div>
            ) : authUser ? (
                <div className="flex justify-items-center">
                    <img
                        className="w-16 h-16 m-3 rounded-3xl"
                        src={authUser.avatar}
                        alt="User's Avatar"
                    />
                    <h1 className="text-white">
                        {authUser.nickname}'s Favorite List:
                    </h1>
                </div>
            ) : (
                ""
            )}

            <GameCard initialGames={games} />
        </>
    );
}
