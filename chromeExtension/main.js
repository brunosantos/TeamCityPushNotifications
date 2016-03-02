'use strict';

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  // console.log('Turning ' + tab.url + ' red!');
  // chrome.tabs.executeScript({
  //   code: 'document.body.style.backgroundColor="red"'
  // });
  tab.update(null, {url:"http://en.wikipedia.org"});
  chrome.tabs.update(null, {url:"http://en.wikipedia.org"});
});

// if ('serviceWorker' in navigator) {
//  console.log('Service Worker is supported');
//  navigator.serviceWorker.register('sw.js').then(function(reg) {
//    console.log(':^)', reg);
//    if ('serviceWorker' in navigator) {
//     console.log('Service Worker is supported');
//     navigator.serviceWorker.register('sw.js').then(function(reg) {
//         console.log(':^)', reg);
//         reg.pushManager.subscribe({
//             userVisibleOnly: true
//         }).then(function(sub) {
//             console.log('endpoint:', sub.endpoint);
//         });
//     }).catch(function(error) {
//         console.log(':^(', error);
//     });
//   }
//  }).catch(function(err) {
//    console.log(':^(', err);
//  });
// }

var reg;
var sub;
var isSubscribed = false;
var subscribeButton = document.querySelector('button');
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    subscribeButton.disabled = false;
    console.log('Service Worker is ready :^)', reg);
  }).catch(function(error) {
    console.log('Service Worker Error :^(', error);
  });
}
subscribeButton.addEventListener('click', function() {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});
function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription){
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
    subscribeButton.textContent = 'Unsubscribe';
    isSubscribed = true;
  });
}
function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    subscribeButton.textContent = 'Subscribe';
    console.log('Unsubscribed!', event);
    isSubscribed = false;
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
    subscribeButton.textContent = 'Subscribe';
  });
}

// ############################### TESTING

function registerCallback(registrationId) {
  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.
    return;
  }

  // Send the registration token to your application server.
  sendRegistrationId(function(succeed) {
    // Once the registration token is received by your server,
    // set the flag such that register will not be invoked
    // next time when the app starts up.
    if (succeed)
      chrome.storage.local.set({registered: true});
  });
}

function sendRegistrationId(callback) {
  // Send the registration token to your application server
  // in a secure way.
  console.log('sendRegistrationId', this);
}

chrome.runtime.onStartup.addListener(function() {
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.
    if (result["registered"])
      return;

    // Up to 100 senders are allowed.
    var senderIds = ["Your-Sender-ID"];
    chrome.gcm.register(senderIds, registerCallback);
  });
});

function unregisterCallback() {
  if (chrome.runtime.lastError) {
    // When the unregistration fails, handle the error and retry
    // the unregistration later.
    return;
  }
}

chrome.gcm.unregister(unregisterCallback);

chrome.gcm.onMessage.addListener(function(message) {
  // A message is an object with a data property that
  // consists of key-value pairs.
});
