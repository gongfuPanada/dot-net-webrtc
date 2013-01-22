// Remote peer
var Peer = function (peerId, channel, streamManager) {

    var _streamManager = streamManager;
    var _peerId = peerId;
    var _channel = channel;
    var _peerConnection = null;
    var _dataChannel = null;
    var _config = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

    var createPeerConnection = function () {
        if (window.RTCPeerConnection) {
            return new RTCPeerConnection(_config);
        } else if (window.webkitRTCPeerConnection) {
            return new webkitRTCPeerConnection(_config);
        } else if (window.mozRTCPeerConnection) {
            return new mozRTCPeerConnection(_config);
        }
    };

    var init = function () {

        _peerConnection = createPeerConnection();
        _peerConnection.addEventListener('error', onError);
        _peerConnection.addEventListener('addstream', onAddStream);
        _peerConnection.addEventListener('removestream', onRemoveStream);
        _peerConnection.addEventListener('statechange', onStateChange);
        _peerConnection.addEventListener('icecandidate', onIceCandidate);
        _peerConnection.addEventListener('datachannel', onDataChannel);
        // Add the local stream
        _peerConnection.addStream(_streamManager.getLocalStream());

    };

    var onIceCandidate = function (event) {

        if (event.candidate) {

            var description = JSON.stringify(event.candidate);
            var message = JSON.stringify({ type: 4, peerId: _peerId, description: description });
            _channel.send(message);
        } else {
            console.log('Null ICE candidate');
        }
    };

    var onError = function (event) {

        console.log("onError", arguments);
    };

    var onStateChange = function (event) {

        switch (_peerConnection.readyState) {
            case "active":
                _dataChannel = _peerConnection.createDataChannel('data');
                _dataChannel.addEventListener('open', onChannelOpen);
                break;
        }

        console.log('State', _peerConnection.readyState);
    };

    var onDataChannel = function(event) {
        console.log('onDataChannel', arguments);
    };

    var onChannelOpen = function (event) {
        console.log('onChannelOpen', arguments);
    };

    var onAddStream = function (event) {
        console.log("onAddStream", arguments);
        _streamManager.addStream(event.stream);

    };

    var onRemoveStream = function (event) {
        console.log("onRemoveStream", arguments);
        _streamManager.removeStream(event.stream);
    };

    var createOfferCallback = function (offer) {

        console.log("createOfferCallback", arguments);

        _peerConnection.setLocalDescription(offer);

        var description = JSON.stringify(offer);
        var message = JSON.stringify({ type: 2, peerId: _peerId, description: description });
        _channel.send(message);

    };

    var createAnswerCallback = function (answer) {

        console.log("createAnswerCallback", arguments);

        _peerConnection.setLocalDescription(answer);

        var description = JSON.stringify(answer);

        var message = JSON.stringify({ type: 3, peerId: _peerId, description: description });
        _channel.send(message);

    };

    this.connect = function () {

        console.log("connect", arguments);
        _peerConnection.createOffer(createOfferCallback);

    };

    this.acceptOffer = function (offer) {

        console.log("acceptOffer", arguments);
        _peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        _peerConnection.createAnswer(createAnswerCallback);

    };

    this.acceptAnswer = function (answer) {

        console.log("acceptAnswer", arguments);
        _peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

    };

    this.addIceCandidate = function (candidate) {
        console.log("addIceCandidate", arguments);
        _peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    init();

};