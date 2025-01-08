import React, { useState } from "react";
import GameCard from "../Components/GameCard";

export default function Home({
    games,
    eventOrder,
    patchesOrder,
    search,
    authUser,
}) {
    const [activeTab, setActiveTab] = useState("NameOrder");

    return (
        <>
            {search ? (
                <div className="flex flex-col">
                    <h1 className="mb-0 pb-1">Searched for: {search}</h1>
                    <p className="mt-0 flex justify-center pt-0 text-sm text-gray-600">
                        Total Results: {games.total || 0}
                    </p>
                </div>
            ) : authUser ? (
                <div className="flex flex-col justify-items-center">
                    <div className="flex">
                        <img
                            className="m-3 h-16 w-16 rounded-3xl"
                            src={authUser.avatar}
                            alt="User's Avatar"
                        />
                        <h1 className="text-white">
                            {authUser.nickname}'s Favorite List:
                        </h1>
                    </div>

                    <div className="tab mb-2 flex justify-center border-[#66c0f4] text-blue-900">
                        <p className="p-0 pr-1 text-white">Order by:</p>
                        <button
                            className={`ani tablinks border-r px-1 ${
                                activeTab === "NameOrder" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTab("NameOrder")}
                        >
                            Name
                        </button>
                        <button
                            className={`ani tablinks border-r px-1 ${
                                activeTab === "EventOrder"
                                    ? "text-blue-600"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("EventOrder")}
                        >
                            Latest Event
                        </button>
                        <button
                            className={`ani tablinks px-1 ${
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
