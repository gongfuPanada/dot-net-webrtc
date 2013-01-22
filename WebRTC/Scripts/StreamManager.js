var StreamManager = function (localStream) {

    var localStream = localStream;

    var init = function () {
        createVideoStreamElement('local', localStream);
    };

    var createVideoStreamElement = function (caption, stream) {

        var wrapper = document.createElement('div');
        document.body.appendChild(wrapper);

        wrapper.className = 'videoWrapper';
        wrapper.appendChild(document.createTextNode(caption));

        var videoElement = document.createElement('video');
        wrapper.appendChild(videoElement);

        var src = window.webkitURL.createObjectURL(stream);
        videoElement.src = src;
        videoElement.play();
        console.log('Set video src to ' + src);

        return wrapper;
    };

    this.getLocalStream = function () {
        return localStream;
    };

    this.addStream = function (stream) {
        createVideoStreamElement('remote', stream);
    };

    this.removeStream = function (stream) {

    };

    init();
};