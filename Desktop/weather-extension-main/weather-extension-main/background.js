chrome.browserAction.onClicked.addListener
(function(){
    chrome.windows.create({
        'url': 'index.html',
        'type': 'popup',
        'height': 1050,
        'width': 500,
        'left': 1
    }); 
});