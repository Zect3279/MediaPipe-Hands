const video = document.getElementById('input');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
const config = {
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
};

const hands = new Hands(config);

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({image: video});
  },
  width: 600,
  height: 400
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// レコーダー
stream = document.getElementById('output').captureStream();
recorder = new MediaRecorder(stream, {mimeType:'video/webm;codecs=vp9'});
// レコーダー

document.getElementById('start').addEventListener('click', () => {
  camera.start();
  recorder.start();
});

document.getElementById('stop').addEventListener('click', () => {
  camera.stop();
  recorder.stop();
});

hands.onResults(results => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(results.image,0,0,canvas.width,canvas.height);

  if(results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach(marks => {
      // console.log(marks)

      // 緑色の線で骨組みを可視化
      drawConnectors(ctx, marks, HAND_CONNECTIONS, {color: '#0f0'});

      // 赤色でランドマークを可視化
      drawLandmarks(ctx, marks, {color: '#f00'});

    })
  }
});

var anchor = document.getElementById('downloadlink');
// 録画が終了したときの処理
recorder.ondataavailable = function(e) {
  var videoBlob = new Blob([e.data], { type: e.data.type });
  blobUrl = window.URL.createObjectURL(videoBlob);
  anchor.download = 'movie.webm';
  anchor.href = blobUrl;
  anchor.style.display = 'block';
}
