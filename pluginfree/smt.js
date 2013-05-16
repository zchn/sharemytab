
function main(){
    navigator.webkitGetUserMedia(
        {audio:false, video:true}, 
        function (stream) {
            console.log("inmain2");
            var video = document.getElementById("camera-video");
            video.src = window.webkitURL.createObjectURL(stream);
        },
        function (err){
            console.log("ERROR:");
            console.log(err);
        }
    );
    

}


window.onload=main;
