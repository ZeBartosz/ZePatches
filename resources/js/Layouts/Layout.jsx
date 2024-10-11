import { Link, useForm } from "@inertiajs/react";
import searchIcon from "../../Assets/search.svg";

export default function Layout({ children }) {
    const { data, setData, get, processing } = useForm({ search: "" });

    function searchSubmit(e) {
        e.preventDefault();
        get("/");
        setData("search", "");
    }

    return (
        <>
            <header>
                <nav>
                    <div className="flex-none">
                        <Link className="nav-link" href="/">
                            Home
                        </Link>
                    </div>

                    <div className="flex justify-center">
                        <form onSubmit={searchSubmit}>
                            <div className="relative m-2 shadow min-w-[300px] ">
                                <input
                                    className="h-10 px-5 focus:outline-none w-full rounded-lg bg-slate-500 text-white focus:border-1"
                                    type="search"
                                    id="search"
                                    value={data.search}
                                    onChange={(e) =>
                                        setData("search", e.target.value)
                                    }
                                    placeholder={`${
                                        processing ? "Searching..." : "Search"
                                    }`}
                                ></input>
                                <button
                                    id="searchSubmit"
                                    type="submit"
                                    disabled={processing}
                                    className="absolute right-7 top-0 mt-3 mr-5"
                                >
                                    <img
                                        src={searchIcon}
                                        className="h-4 w-4 fill-current"
                                        alt="Search Icon"
                                    />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex-none">
                        <button>
                            
                        </button>
                    </div>
                </nav>
            </header>

            <main>{children}</main>
        </>
    );
}
