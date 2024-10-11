export default function Show({ minorPatches, majorPatches}) {
    console.log('major', minorPatches);
    console.log('minior', majorPatches);

    const convertToHTML = (text) => {
        // Start by defining a function to convert custom syntax into valid HTML
        
        const formattedText = text
            // Replace [list] and [/list] with <ul> and </ul> tags for unordered lists
            .replace(/\[list\]/g, "<ul>")
            .replace(/\[\/list\]/g, "</ul>")
    
            // Replace [*] and [/*] with <li> and </li> tags for list items
            .replace(/\[\*\]/g, "<li>")
            .replace(/\[\/\*\]/g, "</li>")
    
            // Replace [h3] and [/h3] with <h3> and </h3> for header level 3
            .replace(/\[h3\]/g, "<h3>")
            .replace(/\[\/h3\]/g, "</h3>")
    
            // Replace [h2] and [/h2] with <h2> and </h2> for header level 2
            .replace(/\[h2\]/g, "<h2>")
            .replace(/\[\/h2\]/g, "</h2>")
    
            // Replace [b] and [/b] with <strong> and </strong> for bold text
            .replace(/\[b\]/g, "<strong>")
            .replace(/\[\/b\]/g, "</strong>")
    
            // Replace [i] and [/i] with <em> and </em> for italicized text
            .replace(/\[i\]/g, "<em>")
            .replace(/\[\/i\]/g, "</em>")
    
            // Replace [url=LINK]TEXT[/url] with an <a> tag for hyperlinks
            // $1 is the URL and $2 is the text that will be clickable
            .replace(/\[url=(.+?)\](.+?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
    
            // Handling general [img]URL[/img] tags for images
            .replace(/\[img\](https?:\/\/.+?)\[\/img\]/g, '<div class="flex justify-center p-2"><img width="560" height="315" src="$1" alt="Image" /></div>')
    
            // Handling Steam-specific image URLs wrapped inside [img]{STEAM_CLAN_IMAGE}/IMAGE_PATH[/img] tags
            .replace(/\[img\]{STEAM_CLAN_IMAGE}\/(.+?)\[\/img\]/g, '<div class="flex justify-center p-2"><img width="560" height="315" src="https://clan.akamai.steamstatic.com/images/$1" alt="Image" /></div>')
    
            // Handling [previewyoutube=VIDEO_ID;full][/previewyoutube] tags for embedding YouTube videos
            .replace(/\[previewyoutube=(.+?);full\]\[\/previewyoutube\]/g, '<div class="flex justify-center p-2"><iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
        
        return formattedText;
    };
    

    return (
        <>

                <h1 className="py-3 mt-0 text-[#c7d5e0]">Game name</h1>

                {minorPatches ? 
                    minorPatches.events.map((patch) => (
                        <div key={patch.forum_topic_id
                        } className="mx-4 mb-4 p-4 border-2 border-[#66c0f4] bg-[#1b2838] rounded-xl flex flex-col items-center w-auto max-w-[900px] min-w-[900px]">
                            <div className="flex flex-col justify-center items-center text-[#c7d5e0]">
                                <h1  className="">{patch.announcement_body.headline}</h1>
                                <p className="text-center flex flex-col justify-center " dangerouslySetInnerHTML={{ __html: convertToHTML(patch.announcement_body.body) }} />
                                {/* <p className="" dangerouslySetInnerHTML={{ __html: patch.announcement_body.body }} /> */}
    
                            </div>
                        </div>
                    )) : ''}
        </>
    )
}