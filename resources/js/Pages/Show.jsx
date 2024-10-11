import React, { useState } from "react";

export default function Show({ minorPatches, majorPatches, gameName }) {
    
    // State to track active tab
    const [activeTab, setActiveTab] = useState("Table1"); 

    const convertToHTML = (text) => {
        // Replace custom syntax with HTML tags
        const formattedText = text
            .replace(/\[list\]/g, "<ul>")
            .replace(/\[\/list\]/g, "</ul>")
            .replace(/\[\*\]/g, "<li>")
            .replace(/\[\/\*\]/g, "</li>")
            .replace(/\[h3\]/g, "<h3>")
            .replace(/\[\/h3\]/g, "</h3>")
            .replace(/\[h2\]/g, "<h2>")
            .replace(/\[\/h2\]/g, "</h2>")
            .replace(/\[b\]/g, "<strong>")
            .replace(/\[\/b\]/g, "</strong>")
            .replace(/\[i\]/g, "<em>")
            .replace(/\[\/i\]/g, "</em>")
            .replace(
                /\[url=(.+?)\](.+?)\[\/url\]/g,
                '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
            )
            .replace(
                /\[img\](https?:\/\/.+?)\[\/img\]/g,
                '<div class="flex justify-center p-2"><img width="560" height="315" src="$1" alt="Image" /></div>'
            )
            .replace(
                /\[img\]{STEAM_CLAN_IMAGE}\/(.+?)\[\/img\]/g,
                '<div class="flex justify-center p-2"><img width="560" height="315" src="https://clan.akamai.steamstatic.com/images/$1" alt="Image" /></div>'
            )
            .replace(
                /\[previewyoutube=(.+?);full\]\[\/previewyoutube\]/g,
                '<div class="flex justify-center p-2"><iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
            );

        return formattedText;
    };

    return (
        <>
            <div className="tab flex justify-center text-white rounded-md border-2 bg-gray-900 bg-opacity-75 my-3 mx-10">
                <button
                    className={`tablinks ${
                        activeTab === "Table1" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Table1")}
                >
                    Major
                </button>
                <button
                    className={`tablinks ${
                        activeTab === "Table2" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Table2")}
                >
                    Minor
                </button>
            </div>

            <h1 className="py-3 mt-0 text-[#c7d5e0]">{gameName}</h1>

            {/* Major Patches Table */}
            <div
                id="Table1"
                className={`table-content ${
                    activeTab === "Table1" ? "active" : "hidden"
                } bg-gray-700 bg-opacity-75 border-2 rounded-lg text-white`}
            >
                <h1 className="py-3 mt-0 text-[#c7d5e0]">Major</h1>
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
                } bg-gray-900 bg-opacity-75 border-2 rounded-lg text-white`}
            >
                <h1 className="py-3 mt-0 text-[#c7d5e0]">Minor</h1>
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
