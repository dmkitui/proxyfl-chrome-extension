console.log('We loaded background js.')

const messageSender = (msg) => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {msg: msg}, function (response) {
            if (chrome.runtime.lastError) {
                setTimeout(messageSender, 1000);
            } else {
                console.log(response);
            }
        });
    });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg === 'setup_creds') {
        chrome.windows.getCurrent(function(win) {
            const width = 440;
            const height = 220;
            const left = ((screen.width / 2) - (width / 2)) + win.left;
            const top = ((screen.height / 2) - (height / 2)) + win.top;
            chrome.windows.create(
                {
                    url: chrome.runtime.getURL('html/credentials_popup.html'),
                    width: width,
                    height: height,
                    top: Math.round(top),
                    left: Math.round(left),
                    type: 'popup'
                }
            );
        });
        sendResponse({farewell: "goodbye"});
    } else if (request.msg === 'updateCreds') {
        chrome.storage.sync.set({'url': request.creds.url, 'apiKey': request.creds.apiKey}, function () {
            console.log('URL Saved');
        });
        messageSender('credsLoaded')
        sendResponse({state: 'completed'});
    } else {
        console.log('I have no idea whta is hapeening: ', request.msg)
        return true
    }
});