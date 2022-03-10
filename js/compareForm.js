function createContextAndOscillatorPair(){
  const ctx = new AudioContext();
  ctx.suspend();
  let multiple1 = randInt(1,10);
  let multiple2 = randInt(1,10);
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
    const data = [f11,f12,f21,f22,index];
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

