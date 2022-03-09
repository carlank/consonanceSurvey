const form = document.getElementById("form");
const playButton = document.getElementById("playButton");
const volumeInput = document.getElementById("volumeSlider");
// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let osc1, osc2;
let volume;

let freq1, freq2;
let gain;
let duration = 1000;

const results = [];
const randInt = (min, max) => min + Math.floor(Math.random() * max);
const baseFreq = 110;

function setup(){
  freq1 = randInt(1,10) * baseFreq;
  freq2 = randInt(1,10) * baseFreq;
}

function play(){
  osc1 = audioCtx.createOscillator();
  osc2 = audioCtx.createOscillator();
  volume = audioCtx.createGain();

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq1, audioCtx.currentTime); // value in hertz
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(freq2, audioCtx.currentTime); // value in hertz

  volume.gain.value = volumeInput.value;

  osc1.connect(volume)
  osc2.connect(volume)
  volume.connect(audioCtx.destination);
  osc1.start();
  osc2.start();
  setTimeout(()=>osc1.stop(), duration);
  setTimeout(()=>osc2.stop(), duration);
}


form.addEventListener("submit",(e)=>{
  e.preventDefault();
  let data = new FormData(form);
  let res;
  for (const entry of data){
    if (entry[0] == "response"){
      res = entry[1];
    }
  }
  if (res){
    console.log(res)
    const params = new Object();
    params.freq1 = freq1;
    params.freq2 = freq2;
    params.res = res;
    let urlEncodedData = "", urlEncodedParams = [];
    for( const name in params ) {
     urlEncodedParams.push(encodeURIComponent(name)+'='+encodeURIComponent(params[name]));
    }
    const http = new XMLHttpRequest();
    const url = 'endpoint';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        console.log(http.responseText);
      }
      else {
        console.log('uhoh')
      }
    }
  }
  setup();
  play();
  return false;
});

playButton.addEventListener("click",play);
setup();
