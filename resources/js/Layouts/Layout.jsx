import { Link, useForm, usePage } from "@inertiajs/react";
import FlashCard from "../Components/FlashCard";
import searchIcon from "../../Assets/search.svg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Layout({ children }) {
    const { flash } = usePage().props;
    const [message, setMessage] = useState("");
    const { data, setData, get, processing } = useForm({ search: "" });
    const { post, logoutprocessing } = useForm({});
    const { authUser } = usePage().props;

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
                        <div>
                            <form onSubmit={logout}>
                                <button type="submit">
                                    {logoutprocessing
                                        ? "Logging out..."
                                        : "logout"}
                                </button>
                            </form>
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
                            <Link className="nav-link" href="/register">
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            <main>{children}</main>
            <FlashCard message={message} />
        </>
    );
}
