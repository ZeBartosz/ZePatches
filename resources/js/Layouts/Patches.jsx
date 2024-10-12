import { convertToHTML } from "../app.js";

function Patches({ patch, activeTab, tableId, title }) {
    return (
        <>
            {patch.events.length > 0 ? (
                <div
                    id={tableId}
                    className={`table-content ${
                        activeTab === tableId ? "active" : "hidden"
                    } bg-gray-900 bg-opacity-75 border-2 border-white rounded-lg text-white`}
                >
                    <h1 className="py-3  my-0 text-[#c7d5e0] border-0">
                        {title}
                    </h1>
                    {patch.events.map((patch) => (
                        <div
                            key={patch.forum_topic_id}
                            className="mx-4 mb-4 p-4 border-2 border-[#66c0f4] bg-[#1b2838] rounded-xl flex flex-col items-center w-auto max-w-[900px] min-w-[900px]"
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
