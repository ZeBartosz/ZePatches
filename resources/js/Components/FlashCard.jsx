import { useEffect, useState, React } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function FlashCard({ message }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            toast(message);
        }
    }, [message]);

    return <ToastContainer />;
}

export default FlashCard;
