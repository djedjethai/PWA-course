var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form');
var titleInput = document.querySelector('#title');
var locationInput = document.querySelector('#location');
var imageInput = document.querySelector('#image');



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
  cardTitle.style.backgroundImage = 'url(http://localhost:3000/' + data.image + ')';
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

  // var cardSupportingImageText = document.createElement('label');
  // cardSupportingImageText.htmlFor = 'image';
  // cardSupportingImageText.innerHTML = 'image';
  // var cardSupportingImage = document.createElement('input');
  // cardSupportingImage.id = 'image';
  // cardSupportingImage.name = 'image';
  // cardSupportingImage.type = 'file'
  

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

 console.log('le token de fou....');
 const token = localStorage.getItem('token');
 console.log(token);
 
 window.addEventListener('load', (e) => {
 	if (!token) {
 		window.location.replace("http://localhost:8080/");
 	}
 });




var url = 'http://localhost:3000/feed/feeds';
var networkDataReceived = false;

fetch(url, {headers: { Authorization: 'Bearer ' + token }})
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
  let formData;
  let formHeader;
  if (typeof(imageInput.value) === 'object') {
    console.log('sendData in image');
    // for formData
    // a voir .....????? set l'histoire du token as well
    formHeader = {};

    formData = new FormData;
    formData.append('id', new Date().toISOString());
    formData.append('title', titleInput.value);
    formData.append('location', locationInput.value);
    formData.append('image', imageInput.value);
    
  } else {
    console.log('sendData in json');
    console.log(token);
    // for form
    // const token = localStorage.getItem('token'); 
    formHeader = {
      'Content-Type':'application/json',
      'Accept':'application/json',
      Authorization: 'Bearer ' + token
    };
    formData = JSON.stringify({
      id: new Date().toISOString(),
      title: titleInput.value,
      location: locationInput.value,
      image: imageInput.value
    });
  }
  
  console.log('SENDING DATA');
  console.log(localStorage.getItem('token'));	
  fetch('http://localhost:3000/feed/feed', {
    method: 'POST',
    headers: formHeader,
    body: formData
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(resData) {
    updateUI(resData);
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
        const imgObj = document.getElementById('image').files[0];
        console.log('before store image in indexedDb');
        console.log(typeof imgObj);
        var post = {
          id: new Date().toISOString(),
          title: titleInput.value,
          location: locationInput.value,
          image: imgObj
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
                    console.log('BEFORE_UPDATEUI');
                    console.log(datas);
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


function logoutHandler() {
	localStorage.removeItem('token');
	localStorage.removeItem('expiryDate');
	localStorage.removeItem('userId');
}


