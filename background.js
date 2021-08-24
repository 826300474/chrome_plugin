
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.name === 'panel') {
        console.log('panelrequest', request);
        alert('request.content:' + JSON.stringify(request.content))
    }
});