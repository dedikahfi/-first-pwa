const CACHE_NAME = 'firstpwa-v2';
var urlsToCache = [
	'/first-pwa/',
	'/first-pwa/nav.html',
	'/first-pwa/index.html',
	'/first-pwa/pages/home.html',
	'/first-pwa/pages/about.html',
	'/first-pwa/pages/contact.html',
	'/first-pwa/css/materialize.min.css',
	'/first-pwa/js/materialize.min.js',
	'/first-pwa/js/nav.js',
	'/first-pwa/icon.png'
];

//Menambahkan cache pada service worker
self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
})

//Menghapus storage cache yang tidak digunakan, setelah ada perubahan cache pada service worker
self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(cacheName != CACHE_NAME){	
						console.log("ServiceWorker: cache " + cacheName + " dihapus");
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
})

//Mengambil dari service worker yang telah tersedia, sehingga bisa diakses offline
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches
		.match(event.request, { cacheName: CACHE_NAME })
		.then(function(response) {
			if (response) {
				console.log('ServiceWorker: Gunakan aset dari cache: ', response.url);
				return response;
			}


			// Jika tidak tersedia di service worker
			console.log(
				"ServiceWorker: Memuat aset dari server: ",
				event.request.url
			);
			return fetch(event.request);
		})
	);
});

