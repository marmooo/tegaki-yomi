var CACHE_NAME="2023-07-17 00:10",urlsToCache=["/tegaki-yomi/","/tegaki-yomi/index.js","/tegaki-yomi/worker.js","/tegaki-yomi/model/model.json","/tegaki-yomi/model/group1-shard1of1.bin","/tegaki-yomi/mp3/correct3.mp3","/tegaki-yomi/mp3/end.mp3","/tegaki-yomi/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})