export interface PodcastEpisode {
    title: string;
    description: string;
    audioUrl: string;
    duration: string;
    pubDate: string;
    guid: string;
}

export interface PodcastData {
    episodes: PodcastEpisode[];
    image: string;
    description: string;
}

export function parsePodcastRSS(xml: string): PodcastData {
    const episodes: PodcastEpisode[] = [];

    // Extract Channel Info
    const channelRegex = /<channel>([\s\S]*?)<\/channel>/;
    const channelMatch = xml.match(channelRegex);
    const channelContent = channelMatch ? channelMatch[1] : '';

    let image = extractTag(channelContent, 'itunes:image', 'href');
    if (!image) image = extractTag(channelContent, 'url'); // Fallback for standard RSS image

    const description = extractTag(channelContent, 'description');

    // Extract Episodes
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];

        const title = extractTag(itemContent, 'title');
        const epDescription = extractTag(itemContent, 'description') || extractTag(itemContent, 'itunes:summary');
        const audioUrl = extractEnclosure(itemContent);
        const duration = extractTag(itemContent, 'itunes:duration');
        const pubDate = extractTag(itemContent, 'pubDate');
        const guid = extractTag(itemContent, 'guid');

        if (title && audioUrl) {
            episodes.push({
                title: title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
                description: epDescription.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]*>/g, '').trim(),
                audioUrl,
                duration: duration || '',
                pubDate: pubDate || '',
                guid: guid || audioUrl
            });
        }
    }

    // Default Sort: Oldest to Newest (Chronological)
    episodes.sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

    return {
        episodes,
        image,
        description
    };
}

function extractTag(content: string, tagName: string, attribute?: string): string {
    if (attribute) {
        const regex = new RegExp(`<${tagName}[^>]*${attribute}="([^"]*)"`, 'i');
        const match = content.match(regex);
        return match ? match[1] : '';
    }

    const regex = new RegExp(`<${tagName}.*?>(.*?)<\/${tagName}>`, 's');
    const match = content.match(regex);
    return match ? match[1] : '';
}

function extractEnclosure(content: string): string {
    const regex = /<enclosure[^>]*url="([^"]*)"/;
    const match = content.match(regex);
    return match ? match[1] : '';
}
