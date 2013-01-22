// Signalling channel
var WsSignalChannel = function (callback) {
    var ws = null;
    var url = "ws://" + document.location.host + "/api/Signal/Connect";
    var _callback = callback;

    var init = function () {
        ws = new WebSocket(url);
        ws.onmessage = onmessage;
        ws.onerror = onerror;
        ws.onopen = onopen;
    };

    var onopen = function () {
        console.log("onopen", arguments);
    };

    var onerror = function () {
        console.log("onerror", arguments);
    };

    var onmessage = function (message) {
        _callback(JSON.parse(message.data));
    };

    this.send = function (data) {
        ws.send(data);
    };

    init();
};