import { useEffect, useState } from "react";

function FlashCard({ message }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <>
            {message && (
                <div
                    className={`fixed z-50 bottom-24 right-[-5px] border-2 border-green-500 rounded-md bg-[#2a475e] max-w-56 transition-all duration-500 overflow-x-hidden ${
                        isVisible ? "opacity-100" : "opacity-0 translate-x-52 "
                    }`}
                >
                    <p className="p-3 text-green-500 ">{message}</p>
                </div>
            )}
        </>
    );
}

export default FlashCard;
