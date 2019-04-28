 //长按下的时间
var startTime = 0;
var keyword=getKeyWord(document.referrer);
var engine='';
var view='view';
var source=document.referrer;
var gbk=false;
var flag='wx';
var wx = document.getElementsByName('wx_th');
if (wx.length>0) {
    wx=wx[0].innerText;
}
var domain=location.host//当前访问域名
var loadurl=encodeURIComponent(window.location.href);//访问的链接
var uid = "{__UID__}";
var sid = "{__SID__}";

//拆分链接获取参数
function parseURL(url) {
    var a = document.createElement("a");
    a.href = url;
    return {
        source:url,
        protocol:a.protocol.replace(":", ""),
        host:a.hostname,
        port:a.port,
        query:a.search,
        params:function() {
            var ret = {}, seg = a.search.replace(/^\?/, "").split("&"), len = seg.length, i = 0, s;
            for (;i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split("=");
                ret[s[0]] = s[1];
            }
            return ret;
        }(),
        file:(a.pathname.match(/\/([^\/?#]+)$/i) || [ , "" ])[1],
        hash:a.hash.replace("#", ""),
        path:a.pathname.replace(/^([^\/])/, "/$1"),
        relative:(a.href.match(/tps?:\/\/[^\/]+(.+)/) || [ , "" ])[1],
        segments:a.pathname.replace(/^\//, "").split("/")
    };
}

//判断获取来路
function getEngine(host) {
    if (host.indexOf("baidu.com") > -1) {
        return "baidu";
    }
    if (host.indexOf("sogou.com") > -1) {
        return "sogou";
    }
    if (host.indexOf("bing.com") > -1) {
        return "bing";
    }
    if (host.indexOf("sm.cn") > -1) {
        return "神马";
    }
    if (host.indexOf("360.cn") > -1) {
        return "360";
    }
    if (host.indexOf("google.com") > -1) {
        return "google";
    }
    if (host.indexOf("soso.com") > -1) {
        return "soso";
    }
    if (host.indexOf("jike.com") > -1) {
        return "jike";
    }
    if (host.indexOf("youdao.com") > -1) {
        return "youdao";
    }
    if (host.indexOf("yahoo.cn") > -1) {
        return "yahoo";
    }
}

//编码判断
function isGBK(ie) {
    if (ie == null) {
        return false;
    }
    ie = ie.toLowerCase();
    return ie.indexOf("utf") == -1;
}

//获取关键词函数
function getKeyWord(refer) {
    if (refer == null) {
        return null;
    }
    var url = refer;
    var obj = parseURL(url);
    engine = getEngine(obj.host);
    if (obj.host.indexOf("youxuan.baidu.com") >= 0) {
        return getYouxuanKeyword(obj.query.split("&"));
    }
    if (!obj.params) {
        return null;
    }
    gbk = isGBK(obj.params.ie);
    var word = obj.params.word || obj.params.keyword || obj.params.wd || obj.params.q|| obj.params.query|| obj.params.kw|| obj.params.w;
    if (obj.host == "cpro.baidu.com") {
        word = obj.params.ori || obj.params.k || obj.params.k0 || obj.params.k1 || obj.params.k2 || obj.params.k3 || obj.params.k4;
        gbk = true;
    }
    if (word != null && word.indexOf("%") > -1) {
        try {
            return decodeURIComponent(word);
        } catch (e) {}
    }
    return word;
}

function getYouxuanKeyword(arr) {
    gbk = true;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf("p=") == 0) {
            var p = unescape(arr[i].substring(2));
            var s = p.indexOf("=");
            var e = p.indexOf("&");
            return escape(p.substring(s + 1, e));
        }
    }
    return null;
}

//获取当前时间
function now() {
    return new Date().getTime();
}

//写入当前访客访问Cookie
function setCookie(cookiename,value) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 90);
    document.cookie = cookiename+"=" + escape(value) + ";expires=" + exdate.toGMTString() + ";path=/";
}

//读取当前访客Cookie
function getCookie(name) {
    var cookieValue = "";
    var search = name + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) end = document.cookie.length;
            cookieValue = unescape(document.cookie.substring(offset, end));
        }
    }
    return cookieValue;
}

//读取事件源
function getTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

//检查长按复制位置  
function getSpan(e) {
    var target = getTarget(e);
    while (target != document.body && target != null) {
        //getAttribute获取HTML的目标属性
        //nodeType节点类型  3：文本  1：Element 2：Attr
        if (target.nodeType != 3 && target.getAttribute("flag") != null) {
            return target;
        }
        target = target.parentNode;//返回父元素
    }
    return null;
}

//选择判断
function isParent(p, c) {
    while (c != document.body) {
        if (p == c) {
            return true;
        }
        c = c.parentNode;
    }
    return false;
}

//严格条件未满足  触发再次判断函数
function clicked(e, act) {
    var target = getSpan(e);
    if (!target) {
        return;
    }
    tj()
}

//长按开始函数
function touchstart(e) {
    startTime = now();
    if (tj.clearSelection) {
        var target = getSpan(e);
        if (!target) {
            return;
        }
        try {
            var sel = window.getSelection();
            if (sel != null) {
                if (!isParent(target, sel.focusNode)) {
                    sel.empty();
                }
            }
        } catch (e) {}
    }
}

//长按结束函数
function touchend(e) {
    var touchTime = now() - startTime;
    if (touchTime > 500) {
        var target = getSpan(e);
        if (!target) {
            return;
        }
        startTime = touchTime;
        tj()
    }
}

//监听产生复制动作触发函数
function oncopy(e) {
    var target = getSpan(e);
    if (!target) {
        return;
    }
    tj()
}

  //获取当前js的路径后缀参数函数
 function getCurrentScript() {
    if (document.currentScript) {
        return document.currentScript.src;
    }
    var stack, i, node;
    var a = {};
    try {
        a.b.c();
    } catch (e) {
        stack = e.stack;
    }
    if (stack) {
        i = stack.lastIndexOf("http://");
        var a = stack.slice(i).replace(/\s\s*$/,"").replace(/(:\d+)?:\d+$/i,"");
        return a;
    }
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        if (script.readyState === "interactive") {
            return script.src;
        }
    }
    if (scripts.length > 0) {
        return scripts[scripts.length - 1].src;
    }
}


var jsArr={};//存储加载的js路径后缀参数数组

//获取当前js的路径后缀参数
(function() {
    var src = getCurrentScript();
    if (src == null) {
        throw new Error("获取不到参数!");
    }
    var i = src.indexOf("?");
    if (i > 0) {
        var s = src.substring(i + 1);
        var arr = s.split("&");
        for (var a = 0; a < arr.length; a++) {
            var b = arr[a].split("=");
            if (b.length > 1) {
                jsArr[b[0]] = b[1];
            }
        }
    }
})();

//访客唯一身份  该身份标识将保存三个月
var uuid=getCookie('fkuid')||0;

var tj= function(data){
    var fkpath=getCookie('fkpath');
    var values=keyword+"|"+loadurl+"|"+sid;
    if (fkpath!=values) {
        setCookie('fkpath',values);
        try{
            var  sysurl='http://sp.x3u.cn/?m=YxsoLog&a=post'
            var url = sysurl+'&word='+keyword+'&flag='+flag+'&source='+source+'&engine='+engine+'&gbk='+gbk+'&wx='+wx+'&uid='+uid+'&sid='+sid+'&domain='+domain+'&loadurl='+encodeURIComponent(loadurl)+'&uuid='+uuid;
            var scr = document.createElement("script");
            scr.src = url;
            //访客身份判断  存在就不写入  不存在就写入服务端返回的身份id
            if (uuid==0) {
                scr.onload = scr.onreadystatechange = function() {
                    scr.parentNode.removeChild(scr);
                    setCookie('fkuid',uuid);
                };
            }else{
                scr.onload = scr.onreadystatechange = function() {
                    scr.parentNode.removeChild(scr);
                };
            }
            
            var node = document.getElementsByTagName("script")[0];
            node.parentNode.insertBefore(scr, node);
        }catch(e){}
    }
}

document.addEventListener("touchstart", touchstart);
document.addEventListener("touchend", touchend);
document.addEventListener("mousedown", touchstart);
document.addEventListener("mouseup", touchend);
document.addEventListener("selectstart", touchend);
document.addEventListener("touchcancel", touchend);
document.addEventListener("copy", oncopy);
