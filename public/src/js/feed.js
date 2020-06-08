var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form');
var titleInput = document.querySelector('#title');
var locationInput = document.querySelector('#location');

function openCreatePostModal() {
  // createPostArea.style.display = 'block';
  // setTimeout(function() {
    createPostArea.style.transform = 'translateY(0)';
  // }, 1);
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.transform = 'translateY(100vh)';
  // createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
}

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'http://localhost:3000/feed/feeds';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data.feeds) {
      dataArray.push(data.feeds[key]);
    }
    console.log('ds update ui 1');
    console.log(dataArray);
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived && data.length !== 0) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}

// that the data which will be send if the browser do not support sw or SyncManager
function sendData() {
  console.log('SENDING DATA');
  fetch('http://localhost:3000/feed/feed', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    body: JSON.stringify({
      id: new Date().toISOString(),
      title: titleInput.value,
      location: locationInput.value
    })
  })
  .then(function(res) {
    console.log('ET LA ENVULER...')
    // console.log('Send data', res);
    // updateUI();
    return res.json();
  })
  .then(function(resData) {
    console.log('A AFFICHER');
    console.log(resData);
    updateUI();
  })
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  if (titleInput.value.trim() === '' || locationInput.value.trim() === '' ) {
    alert('Please enter valid data');
    return;
  }
  closeCreatePostModal();
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    // here we r in feed.js and not in the sw file, so that the way to access to it
    navigator.serviceWorker.ready
      .then(function(sw) {
        var post = {
          id: new Date().toISOString(),
          title: titleInput.value,
          location: locationInput.value
         }
         clearAllData('sync-posts')
          .then(function(respClearData) {
              writeData('sync-posts', post)
              .then(function() {
                // the name is up to us, it will just be a reference after
                return sw.sync.register('sync-new-posts');
              })
              .then(function() {

                // ma solution temporaire pour afficher the posted datas
                setTimeout(() => {
                  readAllData('posts')
                  .then(datas => {
                    updateUI(datas);
                  })
                }, 5000);

                // all this snackbar blabla... is link to the design third party library used by the prof
                var snackbarContainer = document.querySelector('#confirmation-toast');
                var data = {message: 'Your Post was saved for syncing!'};
                console.log("IN_SYNC");
                console.log(post);
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
              })
              .catch(err => console.log(err));
          })
         
      })
  } else {
    sendData();
  }
})


