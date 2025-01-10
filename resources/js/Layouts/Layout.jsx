import { Link, useForm, usePage } from "@inertiajs/react";
import FlashCard from "../Components/FlashCard";
import searchIcon from "../../Assets/search.svg";
import { useEffect, useState } from "react";
import DropDown from "../Components/DropDown";

export default function Layout({ children }) {
    const [message, setMessage] = useState("");
    const { data, setData, get, processing } = useForm({ search: "" });
    const { flash } = usePage().props;
    const { authUser } = usePage().props;

    useEffect(() => {
        setMessage(flash.message);
    }, [flash.message]);

    useEffect(() => {
        if (!authUser) {
            return;
        }
        Echo.private(`Notify.User.${authUser.id}`).listen(
            "BroadCastNotification",
            (data) => {
                setMessage(data.message);
            },
        );
    }, []);

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
                            <div className="relative m-2 min-w-[300px] shadow">
                                <input
                                    className={`h-10 w-full rounded-md border border-transparent bg-[#1b2838] px-5 text-[#c7d5e0] transition-colors duration-300 focus:border-white focus:outline-none focus:ring-1 focus:ring-white ${
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
                                    className="absolute right-7 top-0 mr-5 mt-3"
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
