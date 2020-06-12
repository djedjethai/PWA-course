importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');


var CACHE_STATIC_NAME = 'static-v49';
var CACHE_DYNAMIC_NAME = 'dynamic-v8';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/idb.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//     .then(function (cache) {
//       return cache.keys()
//         .then(function (keys) {
//           if (keys.length > maxItems) {
//             cache.delete(keys[0])
//               .then(trimCache(cacheName, maxItems));
//           }
//         });
//     })
// }

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', function (event) {

  var url = 'http://localhost:3000/feed/feeds';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(fetch(event.request)
      .then(function (res) {
        var clonedRes = res.clone();
        clearAllData('posts')
          .then(function () {
            return clonedRes.json();
          })
          .then(function (data) {
            for (var key in data) {
              writeData('posts', data[key])
            }
          });
        return res;
      })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    // trimCache(CACHE_DYNAMIC_NAME, 3);
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }
                  });
              });
          }
        })
    );
  }
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function(err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function(cache) {
//                   return cache.match('/offline.html');
//                 });
//             });
//         }
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });

self.addEventListener('sync', function(event) {
  console.log('[service worker] background syncing', event);
  if (event.tag === 'sync-new-posts') {
    console.log('[service worker] Syncing new post');
    event.waitUntil(
      readAllData('sync-posts')
        .then(function(data) {
          for (var dt of data) {
           
            console.log('after dt');
            // fetch('https://us-central1-pwapp-2e65c.cloudfunctions.net/storePostData', {
            // fetch('http://localhost:3000/feed/feed', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type':'application/json',
            //     'Accept':'application/json'
            //   },
            //   body: JSON.stringify({
            //     id: dt.id,
            //     title: dt.title,
            //     location: dt.location,
            //     image: 'a superbe image'
            //   })
            // })
            let formData;
            let formHeader;
            if (typeof(dt.image) === 'object') {
              console.log('sendData in image');
              // for formData
              // a voir .....????? set l'histoire du token as well
              formHeader = {};

              formData = new FormData;
              formData.append('id', dt.id);
              formData.append('title', dt.title);
              formData.append('location', dt.location);
              formData.append('image', dt.image);
              
              
            } else {
              console.log('sendData in json');
              // for form
              formHeader = {
                'Content-Type':'application/json',
                'Accept':'application/json'
              };
              formData = JSON.stringify({
                id: dt.id,
                title: dt.title,
                location: dt.location,
                image: 'a superbe image'
              });
            }
            
            console.log('SENDING DATA');
            fetch('http://localhost:3000/feed/feed', {
              method: 'POST',
              headers: formHeader,
              body: formData
            })
            .then(function(res) {
              // the .ok is a method fournit confimant status 200
              if (res.ok) {
                
                // i have a problem here, the post is sent as 'sync' event appear,
                // but how my ui get updated...??? 
                return res.json()
                .then(resData => {
                  console.log('CCCC_LAAAA');

                  // ici i got from the db's callBack all posts,
                  // i store them in indexedDB, then read them from feed.js
                  // solution temporaire as i have to delay (with a setTimeout()) feed.js
                  clearAllData('posts')
                    .then(function(respClearPost) {
                      for (var key in resData.feeds) {
                        // console.log(resData.feeds[key]);
                        writeData('posts', resData.feeds[key]);
                      }
                    })        
                  // deleteItemFromData('sync-posts', resData.id) // is not working correctly, will fix it later`
                })
              }
            })
            .catch(err => console.log(err))
          }
        })
    )
  }
})

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll()
        .then(function(clis) {
          var client = clis.find(function(c) {
            return c.visibilityState === 'visible';
          });

          if (client != undefined) {
            client.navigate('http://localhost:8080');
            client.focus();
          } else {
            clients.openWindow('http://localhost:8080');
          }
          notification.close();
        })
    )
    notification.close();
  }
})

// correspond a croix pour fermer une fenetre
self.addEventListener('notificationclose', function(event) {
  console.log('Notification was close', event);
})

self.addEventListener('push', function(event) {
  console.log('push notification received', event);
  // fallback message in case of no data in the event object
  var data = {title: 'new !!!', content:'notification message de secour'};
  if (event.data) {
    // need the text helper method, which will just retreive tre data strings
    data = JSON.parse(event.data.text());
  }
  var options = {
    body: data.content,
    // no image it s too heavy, but a link is ok
    icon: '/src/images/icons/app-icon-96x96.png',
    badge: '/src/images/icons/app-icon-96x96.png'
  }
  event.waitUntil(
    // the sw itself can t show the notificaton, it there to listen to event running in the background
    // so we have to access to the registration of the sw (that the part running in the browser if we can say)
    // it s the part which connect the sw to the browser 
    self.registration.showNotification(data.title, options)
  )

});