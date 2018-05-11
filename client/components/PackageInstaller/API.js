import fetch from 'node-fetch';

export const API_KEY = '3oVZdk5YgxWJw36s4jqG6S22UbRUK43p';

let cache = {
    feeds: {},
    packages: {}
};

export async function getFeeds(source) {
    return cache.feeds[source] || 
        (cache.feeds[source] = 
            await fetch(`https://${source}/api/json/Feeds_GetFeeds?API_Key=${API_KEY}`, { method: 'GET' }).then(r => r.json()));
};

export async function getPackagesForFeed(source, feedId) {
    cache.packages[source] = cache.packages[source] || {};
    return cache.packages[source][feedId] || 
        (cache.packages[source][feedId] = 
            await fetch(`https://${source}/api/json/NuGetPackages_GetPackages?API_Key=${API_KEY}&Feed_Id=${feedId}`, { method: 'GET' }).then(r => r.json()));
};

export async function getAllPackages(source) {
    for (let feed of await getFeeds(source)) {
        await getPackagesForFeed(source, feed.Feed_Id);
    }
    return Object.values(cache.packages[source]).reduce((accum, arr) => accum.concat(arr), []);
};
