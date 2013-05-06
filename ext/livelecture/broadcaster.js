/* MIT License: https://webrtc-experiment.appspot.com/licence/ */

window.isStopBroadcasting = false;

window.toggle = function() {
    if (localStorage['broadcasting'] == undefined) {
        localStorage.setItem('broadcasting', true);
        var roomName = randomChannelStr();
        localStorage.setItem('roomName', roomName);
        window.isStopBroadcasting = false;
        captureTab(roomName);
        console.log('Tab sharing started...');
    } else {
        window.clientStream && window.clientStream.stop();
        localStorage.removeItem('broadcasting');
        localStorage.removeItem('roomName');
        window.isStopBroadcasting = true;
        console.log('Tab sharing stopped...');
        return;
    }
};

window.isBroadcasting = function() {
    return !(localStorage['broadcasting'] == undefined);
};

window.getRoomName = function() {
    return localStorage['roomName'];
};

function randomChannelStr(){
    return "kvn" + ("" + 1e10).replace(/[018]/g, function (a) {
            return (a ^ Math.random() * 16 >> a / 4).toString(16);
	});
}

// this method captures tab stream
function captureTab(roomName) {
    chrome.tabs.getSelected(null, function(tab) {
        var video_constraints = {
            mandatory: {
                chromeMediaSource: 'tab'
            }
        };
        var constraints = {            
            audio: false,
            video: true,
            videoConstraints: video_constraints
        };
        chrome.tabCapture.capture(constraints, function(stream) {
            window.clientStream = stream;
            startBroadcasting(stream,roomName);
        });
    });
}

