import React, { useState } from "react";
import Patches from "../Components/Patches";

export default function Show({ minorPatches, majorPatches, gameName }) {
    const [activeTab, setActiveTab] = useState("Table1");

    return (
        <>
            <h1 className="flex items-start pt-2 my-0 text-[#c7d5e0]">
                {gameName}
            </h1>
            <div className="tab flex justify-evenlytext-[#c7d5e0] border-[#66c0f4] mb-2 text-blue-900">
                <button
                    className={`px-1 border-r tablinks ${
                        activeTab === "Table1" ? "text-blue-600" : ""
                    }`}
                    onClick={() => setActiveTab("Table1")}
                >
                    Events
                </button>
                <button
                    className={`px-1  tablinks ${
                        activeTab === "Table2" ? "text-blue-600" : ""
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
                title={"Minor"}
            />
        </>
    );
}
