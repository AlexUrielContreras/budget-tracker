const FILES_TO_CACHE = [
    '/css/styles.css',
    '/js/index.js',
    './index.html',
    '/icons/icon-72x72.png'
];

const APP_PREFIX = 'budget-';
const version = 'version_1';
const CACHE_NAME = APP_PREFIX + version

self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(FILES_TO_CACHE)
    }))
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            });
            cacheKeepList.push(CACHE_NAME)
            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    return cache.delete(keyList[i])
                }
            }))
        })
    )
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                return request
            } else {
                return fetch(e.request)
            }
        })
    )
});

