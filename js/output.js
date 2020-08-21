// The Synth
var synth = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext)(),
    osc = synth.createOscillator(),
    gain = synth.createGain(),
    output = document.getElementById('output')
osc.type = 'sine'
osc.connect(gain)
gain.gain.value = 0
gain.connect(synth.destination)
osc.start()
// Variables
var active = false,
    volume = 0,
    freq = 0,
    minFq = 1,
    maxFq = 10000,
    quant = false
// Mouse Controls
//document.addEventListener('mousedown',function(e){capture(e)})
//document.addEventListener('mousemove',function(e){drag(e)})
//document.addEventListener('mouseup',function(e){release(e)})
// Touch Controls
//document.addEventListener('touchstart',function(e){capture(e)})
//document.addEventListener('touchmove',function(e){drag(e)})
//document.addEventListener('touchend',function(e){release(e)})
// Start the Note
function capture(e){
  // we want other inputs to work !!! e.preventDefault()
  active = true
  setProp(e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY)
}
function setProp(x, y){
  //console.info("setProp: ", x, y)
  /*
  volume = ~~(x/window.innerWidth*100)/100
  freq = ~~(1000*(1-(y/window.innerHeight)))
  */
  // Theremin logic: y=volume
  //volume = 1-y/window.innerHeight
  volume = 1-y/canvas_out.clientHeight
  //freq = ~~(1000-1000*(1-(x/window.innerWidth)))
  freq = maxFq-maxFq*(1-(x/canvas_out.clientWidth))
  if (quant) {
    freq = q(freq)
  }
  // clamp: 0=min
  volume = Math.max(0, volume)
  freq = Math.max(0, freq)
  // set vals
  osc.frequency.value = freq
  gain.gain.value = volume
  output.innerHTML = 'Frequency = '+freq+'hz, Volume = '+~~(volume*100)+'%, Type = '+osc.type
}
// Update the properties of the note
function drag(e){
  e.preventDefault()
  if (active) {
    setProp(e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY)
  }
}
// Release The Note
function release(e){
  // set via hands active = false
  gain.gain.value = 0
  output.innerHTML = ''
}
// Make UI buttons control type
// bad idea to make them all
/*
var button = document.getElementsByTagName('input')
for (i=0;i<button.length;i++){
  button[i].addEventListener('click',function(){switchType(this.value)})
  button[i].addEventListener('touchstart',function(){switchType(this.value)})
}
function switchType(type){
  osc.type = type
}
*/
wave.onchange = function(e){
  osc.type = wave.value
}
minFreq.oninput = function(e){
  minFq = minFreq_out.innerText = minFreq.value
}
maxFreq.oninput = function(e){
  console.log("maxFreq.oninput")
  maxFq = maxFreq_out.innerText = maxFreq.value
}
quantize.onchange = function(){
  quant = quantize.checked
}

// we use equal tempered scale A4=440Hz
var freqs = [16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87,
            32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55.00, 58.27, 61.74,
            65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.83, 110.00, 116.54, 123.47,
            130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94,
            261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
            523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77,
            1046.50, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760.00, 1864.66, 1975.53,
            2093.00, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44, 3520.00, 3729.31, 3951.07,
            4186.01, 4434.92, 4698.63, 4978.03, 5274.04, 5587.65, 5919.91, 6271.93, 6644.88, 7040.00, 7458.62, 7902.13]
var names = ["C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0",
            "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
            "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
            "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
            "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
            "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
            "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
            "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
            "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8"]
function q(f) {
  // find note close (just linear) to input freq
  // not nice attempt, would be nicer to look into mid of array and make binary decision up or down, instead of walking array from start
  var lastdiff = Math.abs(f - freqs[0])
  for (var i = 1; i < freqs.length; i++) {
    var diff = Math.abs(f - freqs[i])
    if (lastdiff < diff) break
  }
  return freqs[i-1]
}
