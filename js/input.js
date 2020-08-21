const video = document.getElementById("video_in"); // damn var used in handtrack.js and also loads data from CDN have to change code for local version
const context = canvas_out.getContext("2d");

let isVideo = false;
let model = null;

// video.width = 500
// video.height = 400

let modelParams = {
  flipHorizontal: false,   // flip e.g for video flipping changes predictions!!!!!
  imageScaleFactor: 0.7,  // reduce input image size .
  maxNumBoxes: 2,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.6,    // confidence threshold for predictions.
}
flipHorizontal.onchange = imageScaleFactor.onchange = maxNumBoxes.onchange = iouThreshold.onchange = scoreThreshold.onchange = setParams
flipHorizontal.oninput = imageScaleFactor.oninput = maxNumBoxes.oninput = iouThreshold.oninput = scoreThreshold.oninput = setParams
function setParams(e){
  modelParams.flipHorizontal = flipHorizontal.checked
  modelParams.imageScaleFactor = imageScaleFactor_out.innerText = imageScaleFactor.value
  modelParams.maxNumBoxes = maxNumBoxes_out.innerText = maxNumBoxes.value
  modelParams.iouThreshold = iouThreshold_out.innerText = iouThreshold.value
  modelParams.scoreThreshold = scoreThreshold_out.innerText = scoreThreshold.value

  model.setModelParameters(modelParams)
}
function startVideo() {
  handTrack.startVideo(video_in).then(function (status) {
    console.log("video started", status);
    if (status) {
      console.info("Video started. Now tracking")
      isVideo = true
      runDetection()
    } else {
      console.error("Please enable video")
    }
  });
}
function toggleVideo() {
  if (!isVideo) {
    console.info("Starting video")
    startVideo();
  } else {
    console.info("Stopping video")
    handTrack.stopVideo(video_in)
    isVideo = false;
    console.info("Video stopped")
  }
}
function runDetection() {
  model.detect(video).then(predictions => {
    if (predictions.length === 2) { // only if we have 2 hands
      //console.log("Predictions: ", predictions);
      // first hand = left hand = volume !! WRONG
      //setProp(predictions[0].bbox[1], predictions[1].bbox[0])
      var x0 = predictions[0].bbox[0]
      var y0 = predictions[0].bbox[1]
      var x1 = predictions[1].bbox[0]
      var y1 = predictions[1].bbox[1]
      if (modelParams.flipHorizontal) {
        if (x0 < x1) {
          var leftHandY = y0
          var rightHandX = x1
        } else {
          var leftHandY = y1
          var rightHandX = x0
        }
      } else {
        if (x0 > x1) {
          var leftHandY = y0
          var rightHandX = x1
        } else {
          var leftHandY = y1
          var rightHandX = x0
        }
      }
      setProp(rightHandX, leftHandY)
    } else {
      // mute
      volume = 0
      gain.gain.value = volume
    }
    model.renderPredictions(predictions, canvas_out, context, video_in);
    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}
// Load the model.
handTrack.load(modelParams).then(lmodel => {
  // detect objects in the image.
  model = lmodel
  console.info("Loaded Model!")
  toggleVideo()
});
