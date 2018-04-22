import fetch from 'node-fetch';

export const API_KEY = '3oVZdk5YgxWJw36s4jqG6S22UbRUK43p';

let cache = {
    feeds: {}
};

export async function getFeeds(source) {
    return cache.feeds[source] || 
        (cache.feeds[source] = 
            await fetch(`https://${source}/api/json/Feeds_GetFeeds?API_Key=${API_KEY}`, { method: 'GET' }).then(r => r.json()));
};
