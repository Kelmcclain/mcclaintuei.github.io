import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

let waveforms = []; // Store all waveforms
let activeIndex = -1; // Index of the currently active waveform
let activeClipId = null;


// Function to create a waveform for an audio URL and add it to the list of waveforms
function createWaveform(audioCardId, audioUrl, clipId) {
  // Get the HTML container element where the waveform will be displayed
  const container = document.getElementById(audioCardId);

  // Create a WaveSurfer instance with specified options
  const wavesurfer = WaveSurfer.create({
    container,
    waveColor: '#898a8b',
    progressColor: '#454c67',
    url: audioUrl,
    height: '80',
    clipId
  });
  wavesurfer.on('interaction', () => {
    activateWaveform(wavesurfer);
  });

  wavesurfer.on('finish', () => {
    if (activeIndex < waveforms.length - 1) {
      activateWaveform(waveforms[activeIndex + 1]);
    }
  });
  waveforms.push(wavesurfer);
}

// Function to activate a specific waveform by playing it
function activateWaveform(wavesurfer) {
  if (activeIndex !== -1 && waveforms[activeIndex] !== wavesurfer) {
    waveforms[activeIndex].pause();
  }
  wavesurfer.play();
  activeIndex = waveforms.indexOf(wavesurfer);
  activeClipId = wavesurfer.audioCardId; // Assuming you have a property named "clipId" for each waveform
}

document.addEventListener('keydown', (event) => {
  const focusedElement = document.activeElement;

  if (
    (focusedElement.tagName !== 'INPUT' &&
      focusedElement.tagName !== 'TEXTAREA') ||
    (focusedElement.tagName === 'INPUT' && focusedElement.type !== 'text')
  ) {
    if (event.code === 'ArrowDown') {
      event.preventDefault();
      if (activeIndex > 0) {
        activateWaveform(waveforms[activeIndex - 1]);
      }
    } else if (event.code === 'ArrowUp') {
      event.preventDefault();
      if (activeIndex < waveforms.length - 1) {
        activateWaveform(waveforms[activeIndex + 1]);
      }
    } else if (activeIndex !== -1) {
      const activeWaveform = waveforms[activeIndex];
      if (event.code === 'Space') {
        event.preventDefault();
        if (activeWaveform.isPlaying()) {
          activeWaveform.pause();
        } else {
          activeWaveform.play();
        }
      } else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        const currentTime = activeWaveform.getCurrentTime();
        const newTime = currentTime - 3;
        if (newTime < 0) {
          activeWaveform.seekTo(0);
        } else {
          activeWaveform.seekTo(newTime / activeWaveform.getDuration());
        }
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        const currentTime = activeWaveform.getCurrentTime();
        const newTime = currentTime + 2;
        if (newTime > activeWaveform.getDuration()) {
          activeWaveform.seekTo(1);
        } else {
          activeWaveform.seekTo(newTime / activeWaveform.getDuration());
        }
      }
    }
  }
});


const audioColumn = document.querySelector('#clip-files');

audioFiles.forEach((file) => {
  const { clipId, url, precinct, duration, timestamp, talkgroup } = file;
  const audioCardId = clipId;
  const audioCard = document.createElement('div');
  audioCard.classList.add('card');
  audioCard.id = audioCardId;
  audioColumn.appendChild(audioCard);
  const audioUrl = url;
  createWaveform(audioCardId, audioUrl, clipId);



  //talkgroup
  const clipTalkGroup = document.createElement('div')
  clipTalkGroup.classList.add('talk-group')
  clipTalkGroup.innerHTML = `${talkgroup}`
  //timestamp
  const timeStamp = document.createElement('div')
  timeStamp.classList.add('timestamp')
  timeStamp.innerHTML = `${timestamp}`
  //duration
  const clipDuration = document.createElement('div')
  clipDuration.classList.add('duration')
  clipDuration.innerHTML = `${duration}`
  //precinct
  const clipPrecinct = document.createElement('div')
  clipPrecinct.classList.add('precinct')
  clipPrecinct.innerHTML = `${precinct}`
  audioCard.dataset.audioUrl = audioUrl;

  audioCard.append(clipPrecinct, clipDuration, clipTalkGroup, timeStamp)
});
