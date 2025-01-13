import { Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";

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

    const updateNotification = async () => {
        const notificationsToUpdate = notifications
            .filter((notification) => notification.checked === 0)
            .map((notification) => notification.id);

        if (notificationsToUpdate.length > 0) {
            try {
                await axios.put("/notifications/updateChecked", {
                    notificationId: notificationsToUpdate,
                });
                console.log("Notifications updated successfully");
            } catch (error) {
                console.error("Error updating notifications:", error);
            }
        }
    };

    return (
        <>
            {authUser ? (
                <div
                    className="relative z-10"
                    onMouseLeave={() => setActive(false)}
                >
                    <button className="" onClick={() => setActive(!active)}>
                        <img
                            className="mt-1 h-12 w-12 rounded-3xl border border-[#2a475e]"
                            src={authUser.avatar}
                            alt="User's Avatar"
                        />
                    </button>
                    {notifications.some(
                        (notification) => !notification.checked,
                    ) &&
                        !active && (
                            <div className="absolute -right-1 top-1 z-10">
                                <div className="h-4 w-4 rounded-full border border-[#2a475e] bg-red-500"></div>
                            </div>
                        )}
                    <div
                        className={`absolute right-3 top-3 -z-10 bg-gray-400 bg-opacity-80 pb-2 pl-2 ${
                            active ? "active" : "hidden"
                        }`}
                    >
                        <p className="mx-2 border-b border-[#66c0f4] py-3 pr-11 text-white">
                            {authUser.nickname}
                        </p>
                        {authUser.is_admin ? (
                            <Link
                                className="ani text-black no-underline hover:text-black"
                                href="/admin/dashboard"
                            >
                                Admin
                            </Link>
                        ) : (
                            ""
                        )}
                        <div className="relative">
                            {notifications.some(
                                (notification) => !notification.checked,
                            ) &&
                                active && (
                                    <div className="absolute -top-1 right-5">
                                        <div className="h-4 w-4 rounded-full border border-[#2a475e] bg-red-500"></div>
                                    </div>
                                )}
                            <button
                                className="ani"
                                onClick={() => {
                                    updateNotification(), setPressed(true);
                                }}
                            >
                                Notifications
                            </button>
                            <form onSubmit={logout}>
                                <button className="ani" type="submit">
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

            {/* Notification */}
            <div
                onMouseLeave={() => setPressed(false)}
                className={`bg-blur fixed left-1/2 top-5 z-50 w-4/5 -translate-x-1/2 transform rounded-md bg-black bg-opacity-50 text-white shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] lg:w-4/6 ${
                    pressed ? "active" : "hidden"
                }`}
            >
                <h1 className="m-1 border-[#66c0f4] p-1">
                    You currently have {notifications.length} notifications
                </h1>

                {notifications.length > 0 ? (
                    <>
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`m-3 grid grid-cols-12 items-center border-b px-3 pb-3 ${
                                    pressed ? "active" : "hidden"
                                }`}
                            >
                                {/* Game Name */}
                                <div className="col-span-4">
                                    <h2 className="m-0 truncate p-0 font-bold">
                                        {notification.game}
                                    </h2>
                                    <p className="m-0 p-0 text-sm text-gray-600">
                                        AppId {notification.appId}
                                    </p>
                                </div>

                                {/* Event or Patch Info */}
                                <div className="col-span-5 text-center">
                                    {notification.eventName ? (
                                        <>
                                            <p className="m-0 p-0 text-sm font-medium">
                                                {notification.eventName}
                                            </p>
                                            <p className="m-0 p-0 text-sm text-gray-600">
                                                {notification.eventPatchesDate}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="m-0 p-0 text-sm font-medium">
                                                {notification.patchName}
                                            </p>
                                            <p className="m-0 p-0 text-sm text-gray-600">
                                                {notification.patchNotesDate}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Link */}
                                <div className="col-span-3 text-right">
                                    <Link
                                        className="m-0 p-0 text-sm text-blue-500 hover:underline"
                                        href={`game/${notification.appId}`}
                                    >
                                        View Update
                                    </Link>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end">
                            <button className="ani m-0 mb-2 mr-4 p-0">
                                Clear Notification
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <p>No new Updates</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default DropDown;
