var CACHE_NAME="2022-09-11 08:49",urlsToCache=["/tegaki-yomi/","/tegaki-yomi/index.js","/tegaki-yomi/worker.js","/tegaki-yomi/model/model.json","/tegaki-yomi/model/group1-shard1of1.bin","/tegaki-yomi/mp3/correct3.mp3","/tegaki-yomi/mp3/end.mp3","/tegaki-yomi/eraser.svg","/tegaki-yomi/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css","https://cdn.jsdelivr.net/npm/signature_pad@4.0.7/dist/signature_pad.umd.min.js"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})