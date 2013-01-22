$(function() {

    var peers = {};
    var channel = null;
    var streamManager = null;

    var getUserMediaFail = function() {
        $('#getUserMediaFail').show();
    };

    // Init
    var init = function() {
        //Try to get media stream
        if (navigator.getUserMedia) {
            navigator.getUserMedia('video', getUserMediaSuccess, getUserMediaFail);
        } else if (navigator.webkitGetUserMedia) {
            navigator.webkitGetUserMedia({ video: true }, getUserMediaSuccess, getUserMediaFail);
        } else {
            getUserMediaFail();
        }
    };

    var getUserMediaSuccess = function (stream) {

        streamManager = new StreamManager(stream);
        
        channel = new WsSignalChannel(onMessage);
        
    };

    var getPeer = function (peerId) {
        var peer = peers[peerId];
        if (typeof (peer) == 'undefined') {
            peer = new Peer(peerId, channel, streamManager);
            peers[peerId] = peer;
        }
        return peer;
    };

    var makeOffer = function (peerId) {
        var peer = getPeer(peerId);
        peer.connect();
        return peer;
    };

    var acceptOffer = function(peerId, offer) {
        var peer = getPeer(peerId);
        peer.acceptOffer(offer);
        return peer;
    };

    var acceptAnswer = function (peerId, answer) {
        var peer = getPeer(peerId);
        peer.acceptAnswer(answer);
        return peer;
    };

    var addIceCandidate = function (peerId, candidate) {
        var peer = getPeer(peerId);
        peer.addIceCandidate(candidate);
        return peer;
    };

    var removePeer = function(peerId) {

    };

    var onMessage = function (message) {
        
        //console.log('onMessage', message);

        switch (message.type) {
        
            case 0: //Join
                // Make an offer to all new peers because we're classy ;) 
                makeOffer(message.peerId);
                break;
            case 2: //Offer
                //Accept all incoming offers because we're classy ;) 
                acceptOffer(message.peerId, JSON.parse(message.description));
                break;
            case 3: //Answer
                //Accept all incoming answers because we're classy ;) 
                acceptAnswer(message.peerId, JSON.parse(message.description));
                break;
            case 4: //Candidate
                addIceCandidate(message.peerId, JSON.parse(message.description));
                break;
            default :
                console.log("Unknown message", message.message);
                break;
        }

    };

    init();

});