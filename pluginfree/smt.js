
window.shareMyTalk = {
    _audioStream: null,
    getAudioStream: function(){
        return _audioStream;
    },
    setAudioStream: function(s){
        _audioStream = s;
    },
    _cameraStream: null,
    getCameraStream: function(){
        return _cameraStream;
    },
    _screenStream: null,
    getScreenStream: function(){
        return _screenStream;
    }
};
    

function main(){
    navigator.webkitGetUserMedia(
        {
            audio: true,
            //audio:false, 
            video:false
        }, 
        function (stream) {
            var video = $("#microphone-audio")[0];
            video.src = window.webkitURL.createObjectURL(stream);
            shareMyTalk._audioStream = stream;
        },
        function (err){
            console.log("ERROR:");
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
            var video = $("#camera-video")[0];
            video.src = window.webkitURL.createObjectURL(stream);
            shareMyTalk._cameraStream = stream;
        },
        function (err){
            console.log("ERROR:");
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
          var video = $("#screen-video")[0];
          video.src = window.webkitURL.createObjectURL(stream);
          shareMyTalk._screenStream = stream;
      },
      function (err){
          console.log("ERROR:");
          console.log(err);
      }
  );
}

$(document).ready(main);
