// 1-10 rating of consonance
const oneToTenForm = document.getElementById("oneToTenForm");
const playButton = document.getElementById("playButton");
const numberDoneText = document.getElementById("numberDone");
const volumeInput = document.getElementById("volumeSlider");
// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let osc1, osc2;
let volume;

let freq1, freq2;
let gain;
let duration = 1000;

let numberDone = 0;

const results = [];
const randInt = (min, max) => min + Math.floor(Math.random() * max);
const baseFreq = 220;

const numHarmonics = 10
const real = new Float32Array(numHarmonics);
const imag = new Float32Array(numHarmonics);

// Sawtooth with only 10 harmonics (fundamental + 9)
real[0] = 0.5;
imag[0] = 0;
for (let i = 1; i < numHarmonics; i++){
  real[i] = 0;
  imag[i] = 1 / (Math.PI * i);
}
const harmonicWave = audioCtx.createPeriodicWave(real,imag);

function setup(){
  freq1 = randInt(1,10);
  freq2 = randInt(1,10);
  console.log(freq1, freq2);
  averageFreq = (freq1 + freq2)/2;
  perUnitFreq = baseFreq / averageFreq;
  console.log(averageFreq, perUnitFreq);
  freq1 *= perUnitFreq;
  freq2 *= perUnitFreq;
  console.log(freq1, freq2);
}
function play(){
  osc1 = audioCtx.createOscillator();
  osc2 = audioCtx.createOscillator();
  volume = audioCtx.createGain();

  osc1.setPeriodicWave(harmonicWave);
  osc1.frequency.setValueAtTime(freq1, audioCtx.currentTime); // value in hertz
  osc2.setPeriodicWave(harmonicWave);
  osc2.frequency.setValueAtTime(freq2, audioCtx.currentTime); // value in hertz

  volume.gain.value = volumeInput.value;

  osc1.connect(volume);
  osc2.connect(volume);
  volume.connect(audioCtx.destination);
  osc1.start();
  osc2.start();
  setTimeout(()=>osc1.stop(), duration);
  setTimeout(()=>osc2.stop(), duration);
}


oneToTenForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let data = new FormData(oneToTenForm);
  let res;
  for (const entry of data){
    if (entry[0] == "response"){
      res = entry[1];
    }
  }
  if (res){
    numberDone++;
    numberDoneText.value = numberDone;
    results.push([freq1, freq2, res])
    console.log(freq1, freq2, res);
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
        console.log(http.responseText);;
      }
      else {
        console.log('uhoh');
      }
    };
  }
  for (const responseRadioButton in document.getElementsByName("response")){
    responseRadioButton.checked = false;
  }
  setup();
  play();
  return false;
});

playButton.addEventListener("click",play);
setup();



