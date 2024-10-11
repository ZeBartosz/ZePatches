import React, { useState } from "react";
import { convertToHTML } from '../app.js'

export default function Show({ minorPatches, majorPatches, gameName }) {
    
    // State to track active tab
    const [activeTab, setActiveTab] = useState("Table1"); 

    return (
        <>
            <h1 className="pt-2 my-0 text-[#c7d5e0]">{gameName}</h1>
            <div className="tab flex justify-evenly bg-[#2a475e] border-2 text-[#c7d5e0] border-[#66c0f4] rounded-md m-2 p-1">
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

            {/* Major Patches Table */}
            <div
                id="Table1"
                className={`table-content ${
                    activeTab === "Table1" ? "active" : "hidden"
                } bg-gray-900 bg-opacity-75 border-2 border-[#66c0f4] rounded-lg text-white`}
            >
                <h1 className="py-3  my-0 text-[#c7d5e0] border-0">Major</h1>
                {majorPatches
                    ? majorPatches.events.map((patch) => (
                          <div
                              key={patch.forum_topic_id}
                              className="mx-4 mb-4 p-4 border-2 border-[#66c0f4] bg-[#1b2838] rounded-xl flex flex-col items-center w-auto max-w-[900px] min-w-[900px]"
                          >
                              <div className="flex flex-col justify-center items-center text-[#c7d5e0]">
                                  <h1 className="">
                                      {patch.announcement_body.headline}
                                  </h1>
                                  <p
                                      className="text-center flex flex-col justify-center"
                                      dangerouslySetInnerHTML={{
                                          __html: convertToHTML(
                                              patch.announcement_body.body
                                          ),
                                      }}
                                  />
                              </div>
                          </div>
                      ))
                    : ""}
            </div>

            {/* Minor Patches Table */}
            <div
                id="Table2"
                className={`table-content ${
                    activeTab === "Table2" ? "active" : "hidden"
                } bg-gray-800 bg-opacity-75 border-[#66c0f4] border-2 rounded-lg text-white`}
            >
                <h1 className="py-3 my-0 text-[#c7d5e0] border-0">Minor</h1>
                {minorPatches
                    ? minorPatches.events.map((patch) => (
                          <div
                              key={patch.forum_topic_id}
                              className="mx-4 mb-4 p-4 border-2 border-[#66c0f4] bg-[#1b2838] rounded-xl flex flex-col items-center w-auto max-w-[900px] min-w-[900px]"
                          >
                              <div className="flex flex-col justify-center items-center text-[#c7d5e0]">
                                  <h1 className="">
                                      {patch.announcement_body.headline}
                                  </h1>
                                  <p
                                      className="text-center flex flex-col justify-center"
                                      dangerouslySetInnerHTML={{
                                          __html: convertToHTML(
                                              patch.announcement_body.body
                                          ),
                                      }}
                                  />
                              </div>
                          </div>
                      ))
                    : ""}
            </div>
        </>
    );
}
