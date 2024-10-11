 export const convertToHTML = (text) => {
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