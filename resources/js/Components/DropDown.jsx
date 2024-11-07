import { Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

function DropDown({}) {
    const [active, setActive] = useState(false);
    const { post, logoutprocessing } = useForm({});
    const { authUser } = usePage().props;
    const { notifications } = usePage().props;

    function logout(e) {
        e.preventDefault();
        post("/logout");
    }

    return (
        <>
            {authUser ? (
                <div
                    className="relative z-10"
                    onMouseLeave={() => setActive(false)}
                >
                    <button
                        className=""
                        onClick={() => setActive(active ? false : true)}
                    >
                        <img
                            className="w-12 h-12 mt-1 rounded-3xl border border-[#2a475e]"
                            src={authUser.avatar}
                            alt="User's Avatar"
                        />
                    </button>
                    {notifications.length > 0 ? (
                        <div
                            className={`absolute top-0 -right-1 z-10 ${
                                active ? "hidden" : "active"
                            }`}
                        >
                            <p className="py-0 px-2 m-0 border rounded-full border-[#2a475e] bg-red-500">
                                {notifications.length}
                            </p>
                        </div>
                    ) : (
                        ""
                    )}
                    <div
                        className={`absolute bg-gray-400 top-3 right-3 -z-10 ${
                            active ? "active" : "hidden"
                        }`}
                    >
                        <p className="justify-items-center text-white mx-2 py-3 pr-11 border-b border-[#66c0f4]">
                            {authUser.nickname}
                        </p>
                        {authUser.is_admin ? (
                            <Link className="" href="/admin/dashboard">
                                Admin
                            </Link>
                        ) : (
                            ""
                        )}
                        <div className="relative">
                            {notifications.length > 0 ? (
                                <div className="absolute -top-2 right-4">
                                    <p className="py-0 px-2 m-0 border rounded-full border-[#2a475e] bg-red-500">
                                        {notifications.length}
                                    </p>
                                </div>
                            ) : (
                                ""
                            )}
                            <button>Notifications</button>
                            <form onSubmit={logout}>
                                <button className="" type="submit">
                                    {logoutprocessing
                                        ? "Logging out..."
                                        : "logout"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-none">
                    <button
                        className="nav-link m-1"
                        onClick={() => (window.location.href = "/auth/steam")}
                    >
                        Login
                    </button>
                </div>
            )}
        </>
    );
}

export default DropDown;
