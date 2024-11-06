import { Link, useForm, usePage } from "@inertiajs/react";
import FlashCard from "../Components/FlashCard";
import searchIcon from "../../Assets/search.svg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Layout({ children }) {
    const [message, setMessage] = useState("");
    const [active, setActive] = useState(false);
    const { data, setData, get, processing } = useForm({ search: "" });
    const { post, logoutprocessing } = useForm({});
    const { flash } = usePage().props;
    const { authUser } = usePage().props;

    console.log(active);
    useEffect(() => {
        setMessage(flash.message);
    }, [flash.message]);

    function searchSubmit(e) {
        e.preventDefault();
        const query = data.search ? `?query=${data.search}` : "";
        get(`/${query}`);
        setData("search", "");
    }

    function logout(e) {
        e.preventDefault();
        post("/logout");
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
                                    className={`h-10 px-5 w-full bg-[#1b2838] text-[#c7d5e0] rounded-md border border-transparent focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors duration-300 ${
                                        processing ? "cursor-not-allowed" : ""
                                    }`}
                                    type="search"
                                    id="search"
                                    value={data.search}
                                    onChange={(e) =>
                                        setData("search", e.target.value)
                                    }
                                    placeholder={`${
                                        processing ? "Searching..." : "Search"
                                    }`}
                                />
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

                    {authUser ? (
                        <div className="relative z-10">
                            <button
                                onClick={() => setActive(active ? false : true)}
                            >
                                <img
                                    className="w-12 h-12 m-3 rounded-3xl border border-[#2a475e]"
                                    src={authUser.avatar}
                                    alt="User's Avatar"
                                />
                            </button>
                            <div
                                className={`absolute bg-gray-400 top-5 right-5 -z-10 ${
                                    active ? "active" : "hidden"
                                }`}
                            >
                                <p className="text-white mx-2 py-3 pr-16 border-b border-[#66c0f4]">
                                    {authUser.nickname}
                                </p>
                                {authUser.is_admin ? (
                                    <Link
                                        className="nav-link mx-2 "
                                        href="/admin/dashboard"
                                    >
                                        admin Dashboard
                                    </Link>
                                ) : (
                                    ""
                                )}
                                <form onSubmit={logout}>
                                    <button
                                        className="nav-link m-1"
                                        type="submit"
                                    >
                                        {logoutprocessing
                                            ? "Logging out..."
                                            : "logout"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-none">
                            <button
                                className="nav-link m-1"
                                onClick={() =>
                                    (window.location.href = "/auth/steam")
                                }
                            >
                                Login
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            <main>{children}</main>
            <FlashCard message={message} />
        </>
    );
}
