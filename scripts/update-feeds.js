const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const typeLabels = {
    PushEvent: 'pushed code to',
    PullRequestEvent: 'opened a pull request in',
    IssuesEvent: 'updated an issue in',
    CreateEvent: 'created something in',
    ReleaseEvent: 'released in',
    ForkEvent: 'forked',
    WatchEvent: 'starred',
    DeleteEvent: 'deleted in'
};

const fetchText = async (url) => {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'jsrowe-status-feed-updater' }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.text();
};

const fetchJson = async (url) => {
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'jsrowe-status-feed-updater'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
};

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
});

const getFirstItem = (items) => {
    if (!items) {
        return null;
    }
    return Array.isArray(items) ? items[0] : items;
};

const normalizeText = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'string') {
        return value.trim();
    }
    if (typeof value === 'object' && value['#text']) {
        return String(value['#text']).trim();
    }
    return String(value).trim();
};

const findAtomLink = (links) => {
    if (!links) {
        return '';
    }
    const list = Array.isArray(links) ? links : [links];
    const htmlLink = list.find((link) => link['@_href']);
    return htmlLink ? htmlLink['@_href'] : '';
};

const parseFeed = (xml) => {
    const data = parser.parse(xml);
    const rssItem = getFirstItem(data?.rss?.channel?.item);
    if (rssItem) {
        return {
            title: normalizeText(rssItem.title) || 'Latest post',
            link: normalizeText(rssItem.link),
            date: normalizeText(rssItem.pubDate)
        };
    }
    const atomEntry = getFirstItem(data?.feed?.entry);
    if (atomEntry) {
        return {
            title: normalizeText(atomEntry.title) || 'Latest post',
            link: findAtomLink(atomEntry.link) || normalizeText(atomEntry.id),
            date: normalizeText(atomEntry.updated) || normalizeText(atomEntry.published)
        };
    }
    return null;
};

const fetchGithub = async () => {
    const events = await fetchJson('https://api.github.com/users/jsr6720/events/public');
    if (!Array.isArray(events) || events.length === 0) {
        return null;
    }
    const latest = events[0];
    const label = typeLabels[latest.type] || 'did something in';
    const repoName = latest.repo && latest.repo.name ? latest.repo.name : 'GitHub';
    const repoUrl = latest.repo && latest.repo.name ? `https://github.com/${latest.repo.name}` : 'https://github.com/jsr6720';
    return {
        text: label,
        link: repoUrl,
        date: latest.created_at || ''
    };
};

const writeFeeds = async () => {
    const outputDir = path.join(__dirname, '..', 'data');
    const outputPath = path.join(outputDir, 'feeds.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = {
        generatedAt: new Date().toISOString(),
        github: null,
        feeds: {
            jsrowe: null,
            noted: null
        }
    };

    try {
        result.github = await fetchGithub();
    } catch (error) {
        console.error(error.message);
    }

    try {
        const jsroweXml = await fetchText('https://jsrowe.com/feed.xml');
        result.feeds.jsrowe = parseFeed(jsroweXml);
    } catch (error) {
        console.error(error.message);
    }

    try {
        const notedXml = await fetchText('https://noted.jsrowe.com/feed.xml');
        result.feeds.noted = parseFeed(notedXml);
    } catch (error) {
        console.error(error.message);
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
};

writeFeeds().catch((error) => {
    console.error(error);
    process.exit(1);
});
