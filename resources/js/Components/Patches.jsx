import { useEffect, useState } from "react";
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
            currentPatches.length + 3,
        );

        // Update the currentPatches state by adding the newly fetched patches to the previous ones
        setCurrentPatches((prevPatches) => [...prevPatches, ...nextBatch]);

        // Check if all patches have been loaded
        if (currentPatches.length + nextBatch.length >= patch.events.length) {
            setHasMore(false);
        }
    };

    // function to get the date of post
    const getSteamPostDate = (time) => {
        // Check is posttime set
        if (time) {
            // time is in seconds, so multiply by 1000
            const postDate = new Date(time * 1000);

            // Extract the day, month, and year from the Date object
            const day = String(postDate.getDate()).padStart(2, "0");
            const month = String(postDate.getMonth() + 1).padStart(2, "0");
            const year = postDate.getFullYear();

            // Return in 'dd-mm-yyyy' format
            return `${day}-${month}-${year}`;
        }
    };

    return (
        <>
            {patch.events.length > 0 ? (
                <div
                    id={tableId}
                    className={`table-content ${
                        activeTab === tableId ? "active" : "hidden"
                    } rounded-lg border-2 border-[#9dbebb] bg-[#05283d] bg-opacity-75 text-white`}
                >
                    <h1 className="my-0 border-0 py-3 text-white">{title}</h1>
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
                                className="mx-4 mb-4 flex w-auto min-w-[900px] max-w-[900px] flex-col items-center border-b border-[#9dbebb] p-4"
                            >
                                <div className="flex flex-col items-center justify-center text-[#c7d5e0]">
                                    <h1>{patch.announcement_body.headline}</h1>
                                    <span>
                                        <span>Posted on: </span>
                                        {getSteamPostDate(
                                            patch.announcement_body.posttime,
                                        )}
                                    </span>
                                    <p
                                        className="flex flex-col justify-center text-center"
                                        dangerouslySetInnerHTML={{
                                            __html: convertToHTML(
                                                patch.announcement_body.body,
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
                    className={`text-3xl text-[#c7d5e0] ${
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
