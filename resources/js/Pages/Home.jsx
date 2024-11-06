import React, { useState } from "react";
import GameCard from "../Components/GameCard";

export default function Home({
    games,
    eventOrder,
    patchesOrder,
    search,
    authUser,
    notifications,
}) {
    const [activeTab, setActiveTab] = useState("NameOrder");

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
                <div className="flex flex-col justify-items-center">
                    <div className="flex">
                        <img
                            className="w-16 h-16 m-3 rounded-3xl"
                            src={authUser.avatar}
                            alt="User's Avatar"
                        />
                        <h1 className="text-white">
                            {authUser.nickname}'s Favorite List:
                        </h1>
                    </div>

                    <div className="tab flex justify-center border-[#66c0f4] mb-2 text-blue-900">
                        <p className="p-0 pr-1 text-white">Order by:</p>
                        <button
                            className={`tablinks px-1 border-r ${
                                activeTab === "NameOrder" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTab("NameOrder")}
                        >
                            Name
                        </button>
                        <button
                            className={`px-1 border-r tablinks ${
                                activeTab === "EventOrder"
                                    ? "text-blue-600"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("EventOrder")}
                        >
                            Latest Event
                        </button>
                        <button
                            className={`px-1 tablinks ${
                                activeTab === "PatchOrder"
                                    ? "text-blue-600"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("PatchOrder")}
                        >
                            Latest Patch Notes
                        </button>
                    </div>
                </div>
            ) : (
                ""
            )}

            <GameCard
                initialGames={games}
                activeTab={activeTab}
                tableId={"NameOrder"}
                search={search}
            />

            <GameCard
                initialGames={eventOrder}
                activeTab={activeTab}
                tableId={"EventOrder"}
            />

            <GameCard
                initialGames={patchesOrder}
                activeTab={activeTab}
                tableId={"PatchOrder"}
            />
        </>
    );
}
