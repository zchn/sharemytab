
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
    }
};
    

function main(){
    initStream();
    initButtons();
}


function initStream(){
    navigator.webkitGetUserMedia(
        {
            audio: true,
            video:false
        }, 
        function (stream) {
            stream = new webkitMediaStream(stream.getAudioTracks());
            //var audio = $('#microphone-audio')[0];
            //audio.src = window.webkitURL.createObjectURL(stream);
            shareMyTalk._audioStream = stream;
            shareMyTalk._audioRecorder = RecordRTC({
                stream: stream
            });
        },
        function (err){
            console.log('ERROR:');
            console.log(err);
        }
    );

    navigator.webkitGetUserMedia(
        {
            //audio: true,
            audio:false, 
            video:true
        }, 
        function (stream) {
            var video = $('#camera-video')[0];
            video.src = window.webkitURL.createObjectURL(stream);
            shareMyTalk._cameraStream = stream;
            shareMyTalk._cameraRecorder = RecordRTC({
                video: video
            });
        },
        function (err){
            console.log('ERROR:');
            console.log(err);
        }
    );
    
  // Seems to only work over SSL.
  navigator.webkitGetUserMedia(
      {
          video: {
              mandatory: {
                  chromeMediaSource: 'screen'
              }
          }
      },
      function (stream) {
          var video = $('#screen-video')[0];
          video.src = window.webkitURL.createObjectURL(stream);
          shareMyTalk._screenStream = stream;
          shareMyTalk._screenRecorder = RecordRTC({
              video: video
          });
      },
      function (err){
          console.log('ERROR:');
          console.log(err);
      }
  );
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


$(document).ready(main);
