const nombreCache = 'apv-v7';
const archivos = [
    './',
    './index.html',
    './error.html',
    './css/bootstrap.css',
    './css/styles.css',
    './js/app.js',
    './js/apv.js',
    './manifest.json'

];

// este metodo solo se activa una vez
//cuando se instala el servicwe worker
self.addEventListener('install',e =>{
    console.log('Instalando el service worker');
    e.waitUntil(
        caches.open(nombreCache)
            .then(cache =>{
                console.log('cacheando');
                cache.addAll(archivos)
            })
    )
});


//este metodo se ejecuta cuando activamos Service worker 
// activar el service worker 
self.addEventListener('activate', e=> {
    console.log('Service worker activado');

    e.waitUntil(
        caches.keys()
            .then(keys =>{
                return Promise.all(
                    keys.filter(key => key !== nombreCache)
                        .map( key => caches.delete(key)) // borra los demas 
                )
            })
    )
});

//evento fetch para descargar los archivos estaticos

self.addEventListener('fetch', e => {
    console.log('Fetch', e)
   
    e.respondWith(
      caches
        .match(e.request)
        .then(cacheResponse => (cacheResponse ? cacheResponse : caches.match('error.html')))
      
    )
  })