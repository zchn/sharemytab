
/* function to get URL parameter values */
(function () {
    var params = {},
    r = /([^&=]+)=?([^&]*)/g;
    
    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    
    var match, search = window.location.search.toLowerCase();
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);
    
    window.params = params;
})();

if (!window.params.create && !window.params.join) window.params.create = '' + (Math.random() * 1000 << 10);


window.shareMyTalk = {
    _audioStream: null,
    _audioRecorder: null,
    getAudioStream: function(){
        return _audioStream;
    },
    setAudioStream: function(s){
        _audioStream = s;
    },
    _cameraStream: null,
    _cameraRecorder: null,
    getCameraStream: function(){
        return _cameraStream;
    },
    _screenStream: null,
    _screenRecorder: null,
    getScreenStream: function(){
        return _screenStream;
    },
    _screenConn: null,
    _cameraConn: null,

    _endofprops: null

};
    

function main(){
    //initStream();
    initConnection();
    initButtons();
    createOrJoinSession();
}


// function initStream(){
//     navigator.webkitGetUserMedia(
//         {
//             audio: true,
//             video:false
//         }, 
//         function (stream) {
//             stream = new webkitMediaStream(stream.getAudioTracks());
//             //var audio = $('#microphone-audio')[0];
//             //audio.src = window.webkitURL.createObjectURL(stream);
//             shareMyTalk._audioStream = stream;
//             shareMyTalk._audioRecorder = RecordRTC({
//                 stream: stream
//             });
//         },
//         function (err){
//             console.log('ERROR:');
//             console.log(err);
//         }
//     );

//     navigator.webkitGetUserMedia(
//         {
//             //audio: true,
//             audio:false, 
//             video:true
//         }, 
//         function (stream) {
//             var video = $('#camera-video')[0];
//             video.src = window.webkitURL.createObjectURL(stream);
//             shareMyTalk._cameraStream = stream;
//             shareMyTalk._cameraRecorder = RecordRTC({
//                 video: video
//             });
//         },
//         function (err){
//             console.log('ERROR:');
//             console.log(err);
//         }
//     );
    
//     // Seems to only work over SSL.
//     navigator.webkitGetUserMedia(
//         {
//             video: {
//                 mandatory: {
//                     chromeMediaSource: 'screen'
//                 }
//             }
//         },
//         function (stream) {
//           var video = $('#screen-video')[0];
//             video.src = window.webkitURL.createObjectURL(stream);
//             shareMyTalk._screenStream = stream;
//             shareMyTalk._screenRecorder = RecordRTC({
//                 video: video
//             });
//         },
//         function (err){
//             console.log('ERROR:');
//             console.log(err);
//         }
//     );
// }


function initConnection(){
    var connection;
    shareMyTalk._screenConn = new RTCMultiConnection();
    connection = shareMyTalk._screenConn;
    connection.direction = 'one-way';
    connection.session = 'screen';
    connection.onstream = function (stream) {
        // if (stream.type === 'remote') {
        //     if (stream.direction !== Direction.OneWay) {
        //         throw 'shouldnt be here';
        //     }
        // }
        
        var video = $('#screen-video')[0];
        video.src = stream.blobURL;
        shareMyTalk._screenStream = stream.stream;
        shareMyTalk._screenRecorder = RecordRTC({
            video: video
        });
        $('#screen-video').show();
        updateButtons();
    };

    shareMyTalk._cameraConn = new RTCMultiConnection();
    connection = shareMyTalk._cameraConn;
    connection.direction = 'one-way';
    connection.session = 'video';
    connection.onstream = function (stream) {
        // if (stream.type === 'remote') {
        //     if (stream.direction !== Direction.OneWay) {
        //         throw "shouldn't be here";
        //     }
        // }
        
        var video = $('#camera-video')[0];
        video.src = stream.blobURL;
        shareMyTalk._cameraStream = stream.stream;
        shareMyTalk._cameraRecorder = RecordRTC({
            video: video
        });
        $('#camera-video').show();
        updateButtons();
    };

    shareMyTalk._sessionId = window.params.join || window.params.create;
}

function initButtons(){
    $('#record-btn').click(
        function (){
            $('#record-btn').hide();

            shareMyTalk._cameraRecorder.recordVideo();
            shareMyTalk._screenRecorder.recordVideo();
            shareMyTalk._audioRecorder.recordAudio();

            $('#stoprec-btn').show();
        }
    );

    $('#stoprec-btn').click(
        function (){
            $('#stoprec-btn').hide();

            shareMyTalk._cameraRecorder.stopVideo(
                function(recordedFileUrl){
                    window.open(recordedFileUrl);
                }
            );

            shareMyTalk._screenRecorder.stopVideo(
                function(recordedFileUrl){
                    window.open(recordedFileUrl);
                }
            );

            shareMyTalk._audioRecorder.stopAudio(
                function(recordedFileUrl){
                    window.open(recordedFileUrl);
                }
            );

            $('#record-btn').show();
        }
    );
}


function createOrJoinSession(){
    var connection = shareMyTalk._screenConn;
    var camConn = shareMyTalk._cameraConn;
    if(window.params.join){
        connection.connect(shareMyTalk._sessionId);
        camConn.connect(shareMyTalk._sessionId+1);
        var sessionId = window.params.join;
        $('#broadcast-url-div').html('<h2>Keep sharing with friends: <a href="?join=' + sessionId + '" target="_blank">?join=' + sessionId + '</a></h2>');
    }else{
        connection.open(shareMyTalk._sessionId);
        camConn.open(shareMyTalk._sessionId+1);
        var sessionId = window.params.create;
        $('#broadcast-url-div').html('<h2>Share with friends: <a href="?join=' + sessionId + '" target="_blank">?join=' + sessionId + '</a></h2>');
    }
}

function updateButtons(){
    if(shareMyTalk._screenStream != null
       && shareMyTalk._cameraStream != null){
        $('#record-btn').show();
    }
}

$(document).ready(main);
