var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});


// Notification part
function diplayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'you successfully subscribe to our notification service',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US',
      vibrate: [100, 50, 200], // set the vibration, vibrate 100ms stop 50ms vibrate 200ms etc...
      badge: 'src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        { action: 'confirm', title: 'Okay', icon: 'src/images/icons/app-icon-96x96.png' },
        { action: 'cancel', title: 'Cancel', icon: 'src/images/icons/app-icon-96x96.png' }
      ]
    };
    // ready permet d'acceder au service worker registration (en simple, permet d'acceder au sw)
    // like this we push notification from the sw 
    navigator.serviceWorker.ready
      .then(function(swreg) {
        swreg.showNotification('Successfully subscribe !', options);
      });
  }
  // simplest way to display notification (ici est remplace par le snippet ce dessus)
  // new Notification('Successfully subscribe', options);
}

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return
  }
  var reg;
  navigator.serviceWorker.ready
    .then(function(swreg) {
      reg = swreg;
      // here we check if the browser already have a subscription for this sw and this device
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub) {
      if (sub === null) {
        var vapidPublicKey ="BERSfN8w1o_6561QYSHLODi2uPv5ZMaZTGbQTskh7DLRqGptDAMdv_9Oxtzw6MPqTEK5kMC38eZh-JEzx6oSv30";
        var convertedPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        // create a new subscription
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedPublicKey
        })
        .then(function(newSub) {
          console.log('see the new sub bf send to db');
        
          // return fetch('https://pwapp-2e65c.firebaseio.com/subscriptions.json', {
          return fetch('http://localhost:3000/subscription/subscriptionPost', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'Accept':'application/json'
            },
            body: JSON.stringify(newSub)
          })
        })
        .then(function(res) {
          console.log('SUB SENT');
          console.log(res);
          diplayConfirmNotification();
        })
        .catch(function(err) {
          console.log(err);
        })
      } else {
        // we have a subscription
      }

    })
}

function askForNotificationPermission() {
  // we know Notification's obj exist as it's the condition to be in this function
  Notification.requestPermission(function(result) {
    if (result !== 'granted') {
      console.log('No notification permissions granted');
    } else {
      // some code to enable le button
      // diplayConfirmNotification();
      configurePushSub();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}
