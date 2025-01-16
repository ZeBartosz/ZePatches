import React, { useState } from "react";
import Patches from "../Components/Patches";

export default function Show({ minorPatches, majorPatches, gameName }) {
    const [activeTab, setActiveTab] = useState("Table1");

    return (
        <>
            <h1 className="motion-preset-fade-sm motion-duration-2000 my-0 flex items-start pt-2 text-white">
                {gameName}
            </h1>
            <div className="motion-preset-fade-sm motion-duration-2000 tab mb-2 flex justify-evenly border-[#9dbebb] text-[#47828a]">
                <button
                    className={`tablinks border-r px-1 ${
                        activeTab === "Table1" ? "text-[#69b6a7]" : ""
                    }`}
                    onClick={() => setActiveTab("Table1")}
                >
                    Events
                </button>
                <button
                    className={`tablinks px-1 ${
                        activeTab === "Table2" ? "text-[#69b6a7]" : ""
                    }`}
                    onClick={() => setActiveTab("Table2")}
                >
                    Patch Notes
                </button>
            </div>

            <Patches
                patch={majorPatches}
                activeTab={activeTab}
                tableId={"Table1"}
                title={"Major"}
            />
            <Patches
                patch={minorPatches}
                activeTab={activeTab}
                tableId={"Table2"}
                title={"Patches"}
            />
        </>
    );
}
