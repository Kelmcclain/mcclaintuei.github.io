import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

let waveforms = []; // Store all waveforms
let activeIndex = -1; // Index of the currently active waveform

// Function to create a waveform for an audio URL and add it to the list of waveforms
function createWaveform(audioCardId, audioUrl) {
  // Get the HTML container element where the waveform will be displayed
  const container = document.getElementById(audioCardId);

  // Create a WaveSurfer instance with specified options
  const wavesurfer = WaveSurfer.create({
    container,               // The HTML element to contain the waveform
    waveColor: '#898a8b',    // Color of the waveform
    progressColor: '#454c67', // Color of the progress bar
    url: audioUrl,           // URL of the audio file
    height: '70'             // Height of the waveform display
  });

  // When the user interacts with the waveform (e.g., clicks on it), activate it
  wavesurfer.on('interaction', () => {
    activateWaveform(wavesurfer);
  });

  // When the audio finishes playing, activate the next waveform (if available)
  wavesurfer.on('finish', () => {
    if (activeIndex < waveforms.length - 1) {
      activateWaveform(waveforms[activeIndex + 1]);
    }
  });

  // Add the created waveform to the list of waveforms
  waveforms.push(wavesurfer);
}

// Function to activate a specific waveform by playing it
function activateWaveform(wavesurfer) {
  // If there is an active waveform and it's not the same as the provided one, pause it
  if (activeIndex !== -1 && waveforms[activeIndex] !== wavesurfer) {
    waveforms[activeIndex].pause();
  }
  
  // Play the provided waveform
  wavesurfer.play();
  
  // Update the activeIndex to track the currently active waveform
  activeIndex = waveforms.indexOf(wavesurfer);
}

document.addEventListener('keydown', (event) => {
  const focusedElement = document.activeElement;

  // Check if the focused element is not an input field
  if (
    (focusedElement.tagName !== 'INPUT' &&
      focusedElement.tagName !== 'TEXTAREA') ||
    (focusedElement.tagName === 'INPUT' && focusedElement.type !== 'text')
  ) {
    if (event.code === 'ArrowDown') {
      event.preventDefault(); // Prevent default arrow key behavior
      if (activeIndex > 0) {
        activateWaveform(waveforms[activeIndex - 1]);
      }
    } else if (event.code === 'ArrowUp') {
      event.preventDefault(); // Prevent default arrow key behavior
      if (activeIndex < waveforms.length - 1) {
        activateWaveform(waveforms[activeIndex + 1]);
      }
    } else if (activeIndex !== -1) {
      const activeWaveform = waveforms[activeIndex];
      if (event.code === 'Space') {
        // Toggle play/pause with the Space key
        event.preventDefault(); // Prevent default spacebar behavior
        if (activeWaveform.isPlaying()) {
          activeWaveform.pause();
        } else {
          activeWaveform.play();
        }
      } else if (event.code === 'ArrowLeft') {
        // Seek backward with the Left arrow key
        event.preventDefault(); // Prevent default arrow key behavior
        const currentTime = activeWaveform.getCurrentTime();
        const newTime = currentTime - 3; // Adjust the seek duration (e.g., 5 seconds)
        if (newTime < 0) {
          activeWaveform.seekTo(0);
        } else {
          activeWaveform.seekTo(newTime / activeWaveform.getDuration());
        }
      } else if (event.code === 'ArrowRight') {
        // Seek forward with the Right arrow key
        event.preventDefault(); // Prevent default arrow key behavior
        const currentTime = activeWaveform.getCurrentTime();
        const newTime = currentTime + 2; // Adjust the seek duration (e.g., 5 seconds)
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

audioFiles.forEach((file, index) => {
  const { clipId, url, precinct, duration, timestamp, talkgroup } = file;
  const audioCardId = `waveform${index + 1}`;
  const audioCard = document.createElement('div');
  audioCard.classList.add('card');
  audioCard.id = audioCardId;
  audioColumn.appendChild(audioCard);
  const audioUrl = url;
  createWaveform(audioCardId, audioUrl);
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

  audioCard.append(clipPrecinct,clipDuration,clipTalkGroup,timeStamp)
});
