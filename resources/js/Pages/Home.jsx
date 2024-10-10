import { useForm } from "@inertiajs/react";
import React from "react";

export default function Home({ games }) {
    console.log(games); 
    const { data, setData, post } = useForm({ search: "" });

    console.log(data.search)
    function submit(e) {
        e.preventDefault();
        post("/inputGames");
    }

    function searchSubmit(e) {
        e.preventDefault();
        post("/search");
    }

    return (
        <>
            <form onSubmit={searchSubmit} className="max-w-xs sm:max-w-md">
                <div className="relative m-2 border shadow">
                    <input
                        className="h-10 px-5 pr-16 focus:outline-none w-full"
                        type="search"
                        id="search"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Search"
                    ></input>
                    <button
                        id="searchSubmit"
                        type="submit"
                        className="absolute right-2 top-0 mt-3 mr-5"
                    >
                        <svg
                            className="h-4 w-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 56.966 56.966"
                            width="512px"
                            height="512px"
                        >
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>
            </form>

            <h1>Game games:</h1>

            <div>
                {games && games.data ? (
                    games.map(game => (
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
                )}
            </div>
        </>
    );
}
