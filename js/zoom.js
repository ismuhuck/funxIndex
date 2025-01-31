function DevicePixelRatio() {
    return new DevicePixelRatio.prototype.init()
}

DevicePixelRatio.prototype.init = function () {
    let t = this;
    if (t._getSystem()) { //判断设备，目前只在windows系统下校正浏览器缩放比例
        //初始化页面校正浏览器缩放比例
        t._correct();
        //开启监听页面缩放
        t._watch();
    }
}
DevicePixelRatio.prototype._getSystem = function () {
    let flag = false;
    var agent = navigator.userAgent.toLowerCase();
    //		var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    //		if(isMac) {
    //			return false;
    //		}
    //现只针对windows处理，其它系统暂无该情况，如有，继续在此添加
    if (agent.indexOf("windows") >= 0) {
        return true;
    }
}
DevicePixelRatio.prototype._addHandler = function (element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}
//校正浏览器缩放比例
DevicePixelRatio.prototype._correct = function () {
    let t = this;
    //页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
    document.getElementsByTagName('body')[0].style.zoom = 1 / window.devicePixelRatio;
}
//监听页面缩放
DevicePixelRatio.prototype._watch = function () {
    let t = this;
    t._addHandler(window, 'resize', function () { //注意这个方法是解决全局有两个window.resize
        //重新校正
        t._correct()
    })
}
DevicePixelRatio.prototype.init.prototype = DevicePixelRatio.prototype
new DevicePixelRatio()
