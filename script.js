const codeName = document.getElementById('code_name');
const reco = document.getElementById('reco');
reco.textContent = ""

const videoOut = document.getElementById('video_out');
videoOut.classList.add("hidden-video");

const video = document.getElementById('input');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
const config = {
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
};

const hands = new Hands(config);

function wait(delayInMS) {
  return new Promise((resolve) => setTimeout(resolve, delayInMS));
}

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
// コード
const guitarChords = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const ChordType = ['M', 'M7', '7', '6', 'aug', 'm', 'mM7', 'm7', 'm6', 'm7b5', 'add9', 'sus4', '7sus4', 'dim7'];

// ランダムなインデックスを生成する関数
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// ランダムなギターコードを取得して出力する関数
function getRandomGuitarChord() {
  const randomIndex1 = getRandomIndex(guitarChords.length);
  const randomIndex2 = getRandomIndex(ChordType.length);
  return guitarChords[randomIndex1] + ChordType[randomIndex2];
}
// コード

const checkbox = document.getElementById('switch');
var chordWeb = document.getElementById('downloadlink');
var chordWeb2 = document.getElementById('downloadlink2');
document.getElementById('start').addEventListener('click', () => {
  video.classList.remove("hidden-video");
  canvas.classList.remove("hidden-video");
  videoOut.classList.add('hidden-video');
  chordWeb.classList.add('hidden-video');
  chordWeb2.classList.add('hidden-video');
  document.getElementById('start').classList.add('hidden-video')
  document.getElementById('replay').classList.add('hidden-video')
  codeName.textContent = checkbox.checked ? getRandomGuitarChord() + "と" + getRandomGuitarChord() : getRandomGuitarChord();
  camera.start();
  reco.textContent = "録画開始まで...10"
  wait(900).then(() => {
    reco.textContent = "録画開始まで...9"
    wait(900).then(() => {
      reco.textContent = "録画開始まで...8"
      wait(900).then(() => {
        reco.textContent = "録画開始まで...7"
        wait(900).then(() => {
          reco.textContent = "録画開始まで...6"
          wait(900).then(() => {
            reco.textContent = "録画開始まで...5"
            wait(900).then(() => {
              reco.textContent = "録画開始まで...4"
              wait(900).then(() => {
                reco.textContent = "録画開始まで...3"
                wait(900).then(() => {
                  reco.textContent = "録画開始まで...2"
                  wait(900).then(() => {
                    reco.textContent = "録画開始まで...1"
                    wait(900).then(() => {
                      reco.textContent = "記録開始"
                      recorder.start();
                      wait(900).then(() => {
                        reco.textContent = "記録中 : 1"
                        wait(900).then(() => {
                          reco.textContent = "記録中 : 2"
                          wait(900).then(() => {
                            reco.textContent = "記録中 : 3"
                            wait(900).then(() => {
                              reco.textContent = "記録中 : 4"
                              wait(900).then(() => {
                                reco.textContent = "記録終了: 10秒後に再生します。必ず「movie.webm」として保存してください"
                                recorder.stop();
                                wait(10000).then(() => {
                                  video.classList.add("hidden-video");
                                  canvas.classList.add("hidden-video");
                                  videoOut.classList.remove('hidden-video');
                                  videoOut.src = "movie.webm"
                                  videoOut.load()
                                  videoOut.play()
                                  wait(6000).then(() => {
                                    reco.textContent = "再生終了 : startで再開"
                                    const codes = codeName.textContent.split('と')
                                    chordWeb.classList.remove('hidden-video');
                                    chordWeb.href = "https://muuu.jp/chords/#" + codes[0].toLowerCase().replace('#', '3')
                                    if (codes.length == 2) {
                                      chordWeb2.classList.remove('hidden-video');
                                      chordWeb2.href = "https://muuu.jp/chords/#" + codes[1].toLowerCase().replace('#', '3')
                                    }
                                    document.getElementById('start').classList.remove('hidden-video')
                                    document.getElementById('replay').classList.remove('hidden-video')
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
});

document.getElementById('replay').addEventListener('click', () => {
  videoOut.currentTime = 0
  videoOut.play()
})
// document.getElementById('stop').addEventListener('click', () => {
//   camera.stop();
//   recorder.stop();
// });

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

// var anchor = document.getElementById('downloadlink');
const anchor = document.createElement('a');
// 録画が終了したときの処理
recorder.ondataavailable = function(e) {
  var videoBlob = new Blob([e.data], { type: e.data.type });
  blobUrl = window.URL.createObjectURL(videoBlob);
  anchor.download = 'movie.webm';
  anchor.href = blobUrl;
  anchor.style.display = 'block';
  document.body.appendChild(anchor);
  anchor.click();
  URL.revokeObjectURL(blobUrl);
}
