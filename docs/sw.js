const CACHE_NAME="2024-04-24 01:20",urlsToCache=["/tegaki-yomi/","/tegaki-yomi/index.js","/tegaki-yomi/worker.js","/tegaki-yomi/model/model.json","/tegaki-yomi/model/group1-shard1of1.bin","/tegaki-yomi/mp3/correct3.mp3","/tegaki-yomi/mp3/end.mp3","/tegaki-yomi/favicon/favicon.svg"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})