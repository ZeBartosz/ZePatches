import { useEffect, useState } from "react";

function FlashCard({ message }) {
    const [visibility, setvisibility] = useState("invisible");

    useEffect(() => {
        setvisibility("visible");
        setTimeout(() => {
            setvisibility("invisible");
        }, 5000);
    }, [message]);

    return (
        <>
            {message ? (
                <div
                    className={`fixed z-50 bottom-24 right-[-5px] border-2 border-green-500 rounded-md bg-[#2a475e] max-w-56 ${visibility}`}
                >
                    <p className="p-3 text-green-500 ">{message}</p>
                </div>
            ) : (
                ""
            )}
        </>
    );
}

export default FlashCard;
