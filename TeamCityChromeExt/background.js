//
var appWindow = null;

function createWindow() {
  chrome.app.window.create(
    'background.html', {
      width: 600,
      height: 800,
      frame: 'chrome',
      resizable: true
    },
    function(appWin) {
      appWindow = appWin;
      appWin.onClosed.addListener(function() {
        console.log('Window is closed');
        appWindow = null;
      });
    }
  );
}

// Set up listeners to trigger the first time registration.
//chrome.runtime.onInstalled.addListener(createWindow);
//chrome.runtime.onStartup.addListener(createWindow);


// React when a browser action's icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
  //var viewTabUrl = chrome.extension.getURL('background.html');
  createWindow();
});


///this didn't work....
