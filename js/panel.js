const API_URL = "http://192.168.31.130:3000";
const DELAY_TIME = 5 * 1000;
let list = [];
let _api = [];
let _data = [];
const CD = chrome.devtools;
let origin = null;
let pathname = null;
let timer = null;
const log = (...params) => CD.inspectedWindow.eval(`console.log(...${JSON.stringify(params)})`);

function checkURL(URL){
    var str=URL;
    var Expression=/^(http(s))?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp=new RegExp(Expression);
    if(objExp.test(str)==true){
        return true;
    }else{
        return false;
    }
}

setInterval(() => {
    CD.inspectedWindow.eval("window.location", function (result, isException) {
        if( !origin || !pathname ){
            origin = result.origin;
            pathname = result.origin + result.pathname;
            getApi();
            postList();
        }else{
            if( origin!== result.origin || pathname !== (result.origin + result.pathname) ){
                postList();
                origin = result.origin;
                pathname = result.origin + result.pathname;
                getApi();
            }
        }
    });
},500)

CD.network.onRequestFinished.addListener((res) => {
    const {
        request,
        response
    } = res;
    res.getContent(function (content) {    
        if( content ){
            const urlList = request.url.split('?');
            let params = urlList[1];
            let other_params = "";
            if( params ){
                let obj = Qs.parse(urlList[1]);
                delete obj.token;
                if( obj['_'] ){
                    other_params = Qs.stringify({
                        '_':obj['_']
                    });
                    delete obj['_'];
                }
                params = Qs.stringify(obj);
            }
            list.push({
                method:request.method,
                url: urlList[0],
                params:params,
                other_params:other_params,
                content
            })
        }    
    })
});

function getApi(){
    $.ajax({
        type: "GET",
        url: API_URL +"/api/index?href=" + pathname,
        dataType: "json",
        success: function (data) {
            if( data.data ){
                _api = data.data.map(el => el.url);
                _data = data.data;
                $(".title").text(data.name);
                render(data.data);
            }
        },
        fail: function (error) {
    
        }
    });
}

function render(data) {
    $(".list").empty();
    data.forEach(item => {
        $(".list").append(`<div class="item">
        <div class="name">${item.name}</div>
        <div class="check"><input type="checkbox" id="${item.url}" name="switch" lay-skin="switch" checked></div>
    </div>`);
    })
}

function postList() {
    if( timer ){
        clearTimeout(timer);
    }
    if (list.length > 0) {

        let data = list.filter(el => _api.includes(el.url)).map(el1 => ({
            ...el1,
            pageData:_data.find(el2 => el1.url === el2.url)
        }));
        var els = document.getElementsByName("switch");
		for (var i = 0, j = els.length; i < j; i++){
            if( !els[i].checked ){
                const switch_url = els[i].getAttribute('id');
                data = data.filter(el => el.url !== switch_url);
            }
		}

        if( data.length > 0 ){
            $.ajax({
                type: "POST",
                url: API_URL+"/api/index",
                dataType: "json",
                data:{
                    data:JSON.stringify(data)
                },
                success: function (data) {
                    list = [];
                },
                fail: function (error) {
            
                }
            });
        }else{
            list = [];
        }
    }
    timer = setTimeout(() => {
        postList();
    }, DELAY_TIME)
}