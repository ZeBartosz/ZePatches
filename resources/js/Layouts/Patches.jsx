import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { convertToHTML } from "../app.js";

function Patches({ patch, activeTab, tableId, title }) {
    const [currentPatches, setCurrentPatches] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // Hook to manage side effects and lifecycle events
    useEffect(() => {
        // Load the first 3 patches from the provided patch.events array
        setCurrentPatches(patch.events.slice(0, 3));

        // If there are more than 3 patches, set the hasMore state to true
        setHasMore(patch.events.length > 3);

    }, [patch.events]);

    // Function to load more patches when user scrolls
    const fetchMorePatches = () => {
        // Calculate the next batch of patches to be loaded.
        const nextBatch = patch.events.slice(
            currentPatches.length,
            currentPatches.length + 3
        );

        // Update the currentPatches state by adding the newly fetched patches to the previous ones
        setCurrentPatches((prevPatches) => [...prevPatches, ...nextBatch]);

        // Check if all patches have been loaded
        if (currentPatches.length + nextBatch.length >= patch.events.length) {
            setHasMore(false);
        }
    };

    return (
        <>
            {patch.events.length > 0 ? (
                <div
                    id={tableId}
                    className={`table-content ${
                        activeTab === tableId ? "active" : "hidden"
                    } bg-gray-900 bg-opacity-75 border-2 border-white rounded-lg text-white`}
                >   
                    <h1 className="py-3 my-0 text-[#c7d5e0] border-0">
                        {title}
                    </h1>
                    <InfiniteScroll
                        dataLength={currentPatches.length}
                        next={fetchMorePatches}
                        hasMore={hasMore}
                        loader={<h4>Loading more patches...</h4>}
                        endMessage={
                            <p className="text-center">
                                No more {title} patches to load
                            </p>
                        }
                    >
                        {currentPatches.map((patch) => (
                            <div
                                key={patch.forum_topic_id}
                                className="mx-4 mb-4 p-4  flex flex-col items-center w-auto max-w-[900px] min-w-[900px]"
                            >
                                <div className="flex flex-col justify-center items-center text-[#c7d5e0]">
                                    <h1>{patch.announcement_body.headline}</h1>
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
                        ))}
                    </InfiniteScroll>
                </div>
            ) : (
                <h3
                    className={`text-[#c7d5e0] text-3xl ${
                        activeTab === tableId ? "active" : "hidden"
                    }`}
                >
                    Doesn't have any {title} patches
                </h3>
            )}
        </>
    );
}

export default Patches;
