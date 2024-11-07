import { Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

function DropDown({}) {
    const [active, setActive] = useState(false);
    const [pressed, setPressed] = useState(false);
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
                                    <p className="py-0 px-2 m-0 border rounded-full border-[#66c0f4] bg-red-500">
                                        {notifications.length}
                                    </p>
                                </div>
                            ) : (
                                ""
                            )}
                            <button onClick={() => setPressed(true)}>
                                Notifications
                            </button>
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

            <div
                className={`fixed z-50 w-4/5 top-5 bg-black text-white bg-opacity-100 left-1/2 transform -translate-x-1/2 rounded-md shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] ${
                    pressed ? "active" : "hidden"
                }`}
            >
                <h1 className="m-1 p-1 border-[#66c0f4]">
                    You currently have {notifications.length} notifications
                </h1>

                {notifications.length > 0 ? (
                    <>
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-1 flex justify-between m-3 border-b  ${
                                    pressed ? "active" : "hidden"
                                }`}
                            >
                                <h2>{notification.game}</h2>
                                <p className="pt-4 pr-0 m-0">
                                    AppId {notification.appId}
                                </p>
                                {notification.eventName ? (
                                    <div className="">
                                        <p className="pt-4 px-0 pb-0 m-0">
                                            {notification.eventName}
                                        </p>
                                        <p className="p-0 m-0">
                                            {notification.eventPatchesDate}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="">
                                        <p className="pt-4 px-0 pb-0 m-0">
                                            {notification.patchName}
                                        </p>
                                        <p className="p-0 m-0">
                                            {notification.patchNotesDate}
                                        </p>
                                    </div>
                                )}
                                <Link
                                    className="pt-4 m-0"
                                    href={`game/${notification.appId}`}
                                >
                                    View Update
                                </Link>
                            </div>
                        ))}
                        <div></div>
                    </>
                ) : (
                    <div>
                        <p>No new notifications</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default DropDown;
