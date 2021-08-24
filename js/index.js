const CD = chrome.devtools;

CD.panels.create(
    "dataCollection",
    "img/icon.png", // 这个devtools拓展真正的操作页面
    "../panel.html", // 这个devtools拓展真正的操作页面
)
