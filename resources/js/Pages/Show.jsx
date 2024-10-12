import React, { useState } from "react";
import Patches from "../Layouts/Patches";

export default function Show({ minorPatches, majorPatches, gameName }) {
    const [activeTab, setActiveTab] = useState("Table1");

    return (
        <>
            <h1 className="pt-2 my-0 text-[#c7d5e0]">{gameName}</h1>
            <div className="tab flex justify-evenly bg-[#2a475e] border text-[#c7d5e0] border-[#66c0f4] rounded-md m-3 p-">
                <button
                    className={`m-1 p-2 rounded-md tablinks ${
                        activeTab === "Table1" ? "active bg-gray-900" : ""
                    }`}
                    onClick={() => setActiveTab("Table1")}
                >
                    Major
                </button>
                <button
                    className={`m-1 p-2 rounded-md tablinks ${
                        activeTab === "Table2" ? "active bg-gray-800" : ""
                    }`}
                    onClick={() => setActiveTab("Table2")}
                >
                    Minor
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
