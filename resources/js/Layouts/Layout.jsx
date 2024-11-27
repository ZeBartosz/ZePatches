import { Link, useForm, usePage } from "@inertiajs/react";
import FlashCard from "../Components/FlashCard";
import searchIcon from "../../Assets/search.svg";
import { useEffect, useState } from "react";
import DropDown from "../Components/DropDown";
import background from "../../Assets/dark-motion-background.mp4";

export default function Layout({ children }) {
    const [message, setMessage] = useState("");
    const { data, setData, get, processing } = useForm({ search: "" });
    const { flash } = usePage().props;

    useEffect(() => {
        setMessage(flash.message);
    }, [flash.message]);

    function searchSubmit(e) {
        e.preventDefault();
        const query = data.search ? `?query=${data.search}` : "";
        get(`/${query}`);
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

                    <DropDown />
                </nav>
            </header>

            <main>{children}</main>
            <FlashCard message={message} />
        </>
    );
}
