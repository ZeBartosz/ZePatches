import { Link, useForm } from "@inertiajs/react";
import React from "react";

export default function Home({ games, search, authUser }) {
    const totalSearch = games.length;
    const { post, processing } = useForm({});

    console.log(games);

    function retrieveGameDataSubmit(e) {
        e.preventDefault();
        post("/inputGames");
    }

    return (
        <>
            {authUser ? <h1>{authUser.name}</h1> : "No user"}
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

            <div>
                {games
                    ? games.map((game) => (
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
                                  <h2 className="font-medium">{game.name}</h2>
                                  <Link href={`/game/${game.appId}`}>
                                      Check Patches
                                  </Link>
                              </div>
                          </div>
                      ))
                    : ""}
            </div>
        </>
    );
}
