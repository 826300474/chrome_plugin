// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create('MyPanel888', 'img/icon.png', 'mypanel.html', function (panel) {

});

chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        if (request.request.url) {
            request.getContent(function (content) {
                log(request.request.url)
                log(content)
                // if (content) {
                //     chrome.runtime.sendMessage({
                //         name: 'panel',
                //         content: content
                //     })
                // }    
                // chrome.runtime.sendMessage({ greeting: '你好，我是content-script呀，我主动发消息给后台！' }, function (response) {
                //     console.log('收到来自后台的回复：' + response);
                // });
            })
        }
    });

function log(data) {
    chrome.devtools.inspectedWindow.eval('console.log("logData",unescape("' + escape(data) + '"))');
}

// chrome.devtools.network.onRequestFinished.addListener(
//     function (request) {
//         request.getContent(function (content) {
//             if (content) {
//                 chrome.runtime.sendMessage({
//                     name: 'panel',
//                     content: content
//                 })
//             }
//             // chrome.runtime.sendMessage({ greeting: '你好，我是content-script呀，我主动发消息给后台！' }, function (response) {
//             //     console.log('收到来自后台的回复：' + response);
//             // });
//         })
//     }
// );