function getFareyPairs( n ){
  let pairs = [[1,1],[n-1,n]];
  while (pairs[pairs.length-1][0] > 0){
    let ab = pairs[pairs.length-2];
    let cd = pairs[pairs.length-1];
    let k = Math.floor((n+ab[1])/cd[1]);
    pairs.push([k*cd[0] - ab[0], k*cd[1] - ab[1]]);
  }
  pairs.pop(); // Remove 0:1
  return pairs;
}

let possibleRatios = getFareyPairs(12); // 46 ratios, including unison
// intervals with a wide range are prolematic; e.g. 1:12

function createContextAndOscillatorPair(){
  const ctx = new AudioContext();
  ctx.suspend();

  let ratio = possibleRatios[Math.floor(Math.random() * possibleRatios.length)];
  let multiple1 = ratio[0];
  let multiple2 = ratio[1];
  let osc1 = ctx.createOscillator();
  let osc2 = ctx.createOscillator();
  let volume = ctx.createGain();
  averageFreq = (multiple1 + multiple2)/2;
  perUnitFreq = baseFreq / averageFreq;
  let freq1 = multiple1 * perUnitFreq;
  let freq2 = multiple2 * perUnitFreq;
  osc1.setPeriodicWave(harmonicWave);
  osc1.frequency.setValueAtTime(freq1, ctx.currentTime); // value in hertz
  osc2.setPeriodicWave(harmonicWave);
  osc2.frequency.setValueAtTime(freq2, ctx.currentTime); // value in hertz
  volume.gain.value = volumeInput.value;
  osc1.connect(volume);
  osc2.connect(volume);
  volume.connect(ctx.destination);
  osc1.start();
  osc2.start();
  console.log(multiple1, multiple2, freq1 / baseFreq, freq2 / baseFreq, multiple1/multiple2, freq1/freq2);
  return [ctx, osc1, osc2, freq1, freq2];
}

// Comparison of two intervals
const compareForm = document.getElementById('compareForm');
const compareButtons = [...compareForm.children];

let compareCtx1, compareOsc11, compareOsc12;
let compareCtx2, compareOsc21, compareOsc22;
let contexts;

function reset (){
  [compareCtx1, compareOsc11, compareOsc12, f11, f12] = createContextAndOscillatorPair();
  [compareCtx2, compareOsc21, compareOsc22, f21, f22] = createContextAndOscillatorPair();
  contexts = [compareCtx1, compareCtx2];
}
reset();

let sessionID = window.localStorage.getItem("sessionID");
if (sessionID == null){
  if (Crypto.randomUUID){
    // I like this, but it's still not supported by a lot of browsers
    sessionID = Crypto.randomUUID();
  } else {
    // less jank than math.random but dependencies ew
    sessionID = uuidv4();
  }
}

for (const index in compareButtons){
  const button = compareButtons[index];
  button.addEventListener("click", event => {
    compareOsc11.stop();
    compareOsc12.stop();
    compareOsc21.stop();
    compareOsc22.stop();
    compareButtons.forEach(b=>b.classList.remove("heard"));
    let count = window.localStorage.getItem("count");
    if (count == undefined){
      count = 0;
    }
    count++;
    const data = {sessionID,f11,f12,f21,f22,preferedInterval:index};
    console.log(data)
    window.localStorage.setItem(count, data);
    window.localStorage.setItem("count",count);
    Pageclip.send("BMlH4AWTDi8mICuHCHpy8z8cSA2a0QpT", 'consonanceForm', data, (err, res) => {
      console.log(error || response);
    });
    reset();
  });
  button.addEventListener("mouseenter", event => {
    contexts[index].resume();
    button.classList.add("heard");
    button.addEventListener("mouseleave", event => {
      contexts[index].suspend();
    }, {once: true});
  });
}

