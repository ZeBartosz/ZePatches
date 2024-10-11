export default function Show({ minorPatches, majorPatches}) {
    console.log('major', minorPatches);
    console.log('minior', majorPatches);

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
            .replace(/\[url=(.+?)\](.+?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
            .replace(/\[img\]{STEAM_CLAN_IMAGE}\/(.+?)\[\/img\]/g, '<img src="https://clan.akamai.steamstatic.com/images/$1" alt="Image" />') 
            .replace(/\[previewyoutube=(.+?);full\]\[\/previewyoutube\]/g, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'); 
    
        return formattedText;
    };

    return (
        <>
            <div className="flex flex-wrap justify-center">
                {minorPatches ? 
                    minorPatches.events.map((patch) => (
                        <div key={patch.forum_topic_id
                        } className="p-4 border-b  flex flex-wrap justify-items-center">
                            <div className="">
                                <h1  className="text-center">{patch.announcement_body.headline}</h1>
                                <p className="" dangerouslySetInnerHTML={{ __html: convertToHTML(patch.announcement_body.body) }} />
                                {/* <p className="" dangerouslySetInnerHTML={{ __html: patch.announcement_body.body }} /> */}
    
                            </div>
                        </div>
                    )) : ''}
            </div>
        </>
    )
}