'use strict';

// function httpGet(theUrl)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
//     xmlHttp.send( null );
//     return xmlHttp.responseText;
// }

console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
self.addEventListener('push', function(event) {
  console.log('Push message received', event);
  var title = 'Push message';

  event.waitUntil(
    self.registration.showNotification(title, {
      'body': 'The Message',
      'icon': 'images/icon.png'
    }));
});

//falta ler os dados do push notification
// self.addEventListener('push', function(event) {
//   // Since there is no payload data with the first version
//   // of push messages, we'll grab some data from
//   // an API and use it to populate a notification
//   event.waitUntil(
//     fetch(SOME_API_ENDPOINT).then(function(response) {
//       if (response.status !== 200) {
//         // Either show a message to the user explaining the error
//         // or enter a generic message and handle the
//         // onnotificationclick event to direct the user to a web page
//         console.log('Looks like there was a problem. Status Code: ' + response.status);
//         throw new Error();
//       }
//
//       // Examine the text in the response
//       return response.json().then(function(data) {
//         if (data.error || !data.notification) {
//           console.error('The API returned an error.', data.error);
//           throw new Error();
//         }
//
//         var title = data.notification.title;
//         var message = data.notification.message;
//         var icon = data.notification.icon;
//         var notificationTag = data.notification.tag;
//
//         return self.registration.showNotification(title, {
//           body: message,
//           icon: icon,
//           tag: notificationTag
//         });
//       });
//     }).catch(function(err) {
//       console.error('Unable to retrieve data', err);
//
//       var title = 'An error occurred';
//       var message = 'We were unable to get the information for this push message';
//       var icon = URL_TO_DEFAULT_ICON;
//       var notificationTag = 'notification-error';
//       return self.registration.showNotification(title, {
//           body: message,
//           icon: icon,
//           tag: notificationTag
//         });
//     })
//   );
// });

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  //when you click it...save how did you...how is now responsible for fixing it!!!!!!
  var url = 'http://172.20.4.6:8080/guestAuth/app/rest/builds?locator=status:failure,sinceBuild:(status:success)';//Get the current broken build...
  // var response = httpGet(url);
  // console.log('Push message received', response);
  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
