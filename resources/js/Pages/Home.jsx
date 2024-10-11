import { useForm } from "@inertiajs/react";
import React from "react";

export default function Home({ games, search}) {
    console.log("all games: ", games);
    console.log("Total Sum: ", games.length);


    const totalSearch = games.length;
    const { post, processing } = useForm({});

    
    function submit(e) {
        e.preventDefault();
        post("/inputGames");
    }


    return (
        <>
            {search && (
                <div className="flex flex-col">
                    <h1 className="">
                        Searched for: <strong className="pl-1">{search}</strong>
                    </h1>
                    <p className="flex justify-center text-sm text-gray-600">
                        Total: {totalSearch}
                    </p>
                </div>
            )}

            <div className="p-2">
                <form onSubmit={submit}>
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

            <div>
                {/* {games && games.data ? (
                    games.map((game) => (
                        <div key={game.id} className="p-4 border-b">
                            <div className="text-sm text-slate-400">
                                <span>Posted on: </span>
                                <span>{game.appId}</span>
                            </div>
                            <p className="font-medium">{game.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No games available.</p>
                )} */}
            </div>
        </>
    );
}
