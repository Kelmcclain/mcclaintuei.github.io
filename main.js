import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore, collection, onSnapshot, addDoc,
  setDoc, doc, query, where, orderBy, getDocs,
  collectionGroup, updateDoc, deleteDoc, arrayUnion,
  serverTimestamp, Timestamp
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDU95mBEwswXTrehr6-awwFxPNMOqnEscM",
  authDomain: "peak-suprstate-384109.firebaseapp.com",
  projectId: "peak-suprstate-384109",
  storageBucket: "peak-suprstate-384109.appspot.com",
  messagingSenderId: "764256186835",
  appId: "1:764256186835:web:ecdecc4c9b5bd4bb1e7f26",
  measurementId: "G-QG56KL9Y1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//init services
const auth = getAuth();
const database = getFirestore();

let userUid;
let displayName

let localeStagingData = []

// Listen for changes in authentication state
const incidentsColRef = collection(database, "incidents");
const q = query(incidentsColRef, orderBy('createdAt', 'asc'))
//render records to UI
onSnapshot(q, (snapshot) => {
  let stagingData = []
  snapshot.docs.forEach((doc) => {
    stagingData.push({ ...doc.data(), id: doc.id });
    localeStagingData.push({ ...doc.data(), id: doc.id });
  })
  renderIncidents(stagingData)
})

onAuthStateChanged(auth, (user) => {
  if (user) {
    userUid = user.uid;
    console.log(`User is signed in with UID: ${userUid}`);
    displayName = user.displayName
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    console.log(displayName, email, photoURL, emailVerified)
  } else {
    console.log("User is signed out");
  }
});

document.querySelector('.profile').addEventListener('click', () => {
  window.location.href = 'profile.html'

})

let waveforms = [];
let activeIndex = -1;
let activeClipId = null;
let selectedClipsIds = [];


//Create Audio waveforms
function createWaveform(audioCardId, audioUrl, clipId) {
  const container = document.getElementById(audioCardId);
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
  activeClipId = wavesurfer.audioCardId;
  activeClipId = wavesurfer.getDuration(); // Get the clipId property from the WaveSurfer instance
}

document.addEventListener('keydown', (event) => {
  const focusedElement = document.activeElement;
  if (
    (focusedElement.tagName !== 'INPUT' &&
      focusedElement.tagName !== 'TEXTAREA') ||
    (focusedElement.tagName === 'INPUT' && focusedElement.type !== 'text')
  ) {
    if (event.code === 'ArrowDown' || event.key === 's') {
      event.preventDefault();
      if (activeIndex > 0) {
        activateWaveform(waveforms[activeIndex - 1]);
      }
    } else if (event.code === 'ArrowUp' || event.key === 'w') {
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
      } else if (event.code === 'ArrowLeft' || event.key === 'a') {
        event.preventDefault();
        const currentTime = activeWaveform.getCurrentTime();
        const newTime = currentTime - 3;
        if (newTime < 0) {
          activeWaveform.seekTo(0);
        } else {
          activeWaveform.seekTo(newTime / activeWaveform.getDuration());
        }
      } else if (event.code === 'ArrowRight' || event.key === 'd') {
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
})



//Handle addding clips to incident form
document.addEventListener('keydown', (event) => {
  const focusedElement = document.activeElement;
  if (
    (focusedElement.tagName !== 'INPUT' &&
      focusedElement.tagName !== 'TEXTAREA') ||
    (focusedElement.tagName === 'INPUT' && focusedElement.type !== 'text')
  ) {
    if (event.key === 'f') { // Check for the 'f' keypress
      event.preventDefault();
      if (activeIndex !== -1) {
        const activeWaveform = waveforms[activeIndex];
        const activeClipId = activeWaveform.renderer.parent.id;
        if (!selectedClipsIds.includes(activeClipId)) {
          selectedClipsIds.push(activeClipId);
          console.log(selectedClipsIds)

        }
        const flaggesClipDisplay = document.querySelector('.clip-icon-display')
        let HTMLArray = []
        selectedClipsIds.forEach((audioId) => {
          const matchingAudio = audioFiles.find((file) => file.clipId === audioId);
          const { url } = matchingAudio

          let templateHTML = `
          <div class="audio-player" id="${audioId}">
          <span class="incident-clips flagged-clip"><i id="audio-toggle" class="fa fa-play" aria-hidden="true"></i> <p id="remove-clip">X</p>
          </span>
          <audio id="audio-element" src="${url}" preload="auto"></audio>
          </div>

         `
          HTMLArray += templateHTML
        })
        flaggesClipDisplay.innerHTML = HTMLArray

        const audioPlayer = document.querySelectorAll('.audio-player');
        let currentlyPlaying = null; // Store the currently playing audio element

        audioPlayer.forEach((player) => {
          const audioToggle = player.querySelector('#audio-toggle');
          const audioElement = player.querySelector('#audio-element');

          audioToggle.addEventListener('click', () => {
            if (audioElement !== currentlyPlaying) {
              // Pause the currently playing audio (if any)
              if (currentlyPlaying) {
                currentlyPlaying.pause();
                // Reset the icon for the previously playing audio
                const prevAudioToggle = currentlyPlaying.parentElement.querySelector('#audio-toggle');
                prevAudioToggle.classList.remove('fa-pause');
                prevAudioToggle.classList.add('fa-play');
              }

              // Set the new audio as the currently playing one
              currentlyPlaying = audioElement;
            }

            if (audioElement.paused) {
              audioElement.play();
              audioToggle.classList.remove('fa-play');
              audioToggle.classList.add('fa-pause');
            } else {
              audioElement.pause();
              audioToggle.classList.remove('fa-pause');
              audioToggle.classList.add('fa-play');
            }
          });

          audioElement.addEventListener('ended', () => {
            audioToggle.classList.remove('fa-pause');
            audioToggle.classList.add('fa-play');
          });
        });

      }
    }
  }
});

//Handle Removing selected clips from form
document.querySelector('.clip-icon-display').addEventListener('click', (event) => {
  const clickedElement = event.target;
  if (clickedElement.id === 'remove-clip') {
    const audioPlayer = clickedElement.closest('.audio-player');
    if (audioPlayer) {
      audioPlayer.remove();
      const removedAudioId = audioPlayer.id;
      const indexToRemove = selectedClipsIds.indexOf(removedAudioId);
      if (indexToRemove !== -1) {
        selectedClipsIds.splice(indexToRemove, 1);
        console.log(selectedClipsIds)
      }
    }
  }
});


function renderIncidents(data) {
  const incidentsElement = document.querySelector('#incidents');
  let incidentsHTML = [];
  data.forEach((incident, ind) => {
    // Extract incident details
    let { id, title, update, updates, address, clip, tags, author, date, time } = incident;
    let index = updates.length - 1

    let originalIncident = null
    if (updates.length != 0) {
      title = updates[index].title
      update = updates[index].update
      address = updates[index].address
      time = updates[index].time
      date = updates[index].date
      author = updates[index].author
      clip = updates[index].clip
      tags = updates[index].tags
      originalIncident = incident
      delete originalIncident.updates
    }
    const tagEl = []
    const updatesCount = updates.length
    tags.forEach(item => {
      const tagHTML = `<span class="tag">${item}</span>`
      tagEl.push(tagHTML)
    })

    let levelStyling = null

    tags.forEach((tag) => {
      if (tag === 'low') {
        levelStyling = 'linear-gradient(45deg, var(--secondary-color), #37434b);'
      } else if (tag === 'high') {
        levelStyling = 'linear-gradient(45deg, var(--secondary-color), #283a64);'

      }
    })

    // Create HTML for updates
    let updatesHTML = [];
    let isFirstIteration = true;
    updates.reverse();
    updates.push(originalIncident)
    updates.forEach(update => {
      if (isFirstIteration) {
        isFirstIteration = false;
        return; // Skip the first iteration
      }
      const tagEl = []
      update.tags.forEach(item => {
        const tagHTML = `<span class="tag">${item}</span>`
        tagEl.push(tagHTML)
      })

      let UpdateClipHTMLArray = []
      update.clip.forEach((audioId) => {
        const matchingAudio = audioFiles.find((file) => file.clipId === audioId);
        const { url } = matchingAudio

        let templateHTML = `
      <div class="audio-player">

      <span class="incident-clips flagged-clip"><i id="audio-toggle" class="fa fa-play" aria-hidden="true"></i></span>
      <audio id="audio-element" src="${url}" preload="auto"></audio>
      </div>

     `
        UpdateClipHTMLArray += templateHTML

      })

      // Generate HTML for each update 
      updatesHTML.push(`
      <table>

      <tr class="table-row">
          <td class="incident-info">
              <span class="title">${update.title}</span><br>
              <span class="caption">${update.update}</span><br>
              <span class="address">${update.address}</span>
          </td>
          <td class="date-and-time">
              <span class="time">${time}</span>
              <span class="date">${update.date}</span>
          </td>
      </tr>
        <tr class="table-row">
            <td class="tag-container">                                
                ${tagEl.join('')}
            </td>
            
        </tr>
        <tr>
          <td>
          <div class="incident-clips-display">
          ${UpdateClipHTMLArray}
            </div>
          </td>
          <td>
                <span class="author">${update.author}</span>
            </td>
        </tr>
        </table>

        `);
    });
    let HTMLArray = []

    clip.forEach((audioId) => {
      const matchingAudio = audioFiles.find((file) => file.clipId === audioId);
      const { url } = matchingAudio

      let templateHTML = `
      <div class="audio-player">

      <span class="incident-clips flagged-clip"><i id="audio-toggle" class="fa fa-play" aria-hidden="true"></i></span>
      <audio id="audio-element" src="${url}" preload="auto"></audio>
      </div>

     `
      HTMLArray += templateHTML

    })



    let html = `
    <div class="incident-container" tabindex="${ind}" style="background:${levelStyling}" data-incident-id="${id}">
      <div class="incident-update-count">${updatesCount}</div>

      <table>
          <tr class="table-row">
              <td class="incident-info">
                  <span class="title">${title}</span><br>
                  <span class="caption">${update}</span><br>
                  <span class="address">${address}</span>
              </td>
              <td class="date-and-time">
                  <span class="time">${time}</span>
                  <span class="date">${date}</span>
              </td>
          </tr>
          <tr class="table-row">
              <td class="tag-container">                                
                  ${tagEl.join('')}
              </td>
              
          </tr>
          <tr>
              <td>
              <div class="incident-clips-display">
              ${HTMLArray}
                </div>
              </td>
              <td>
                    <span class="author">${author}</span>
              </td>
          </tr>
      </table>
      <div class="updates-container">
        ${updatesHTML.join('')} <!-- Insert updates HTML here -->
      </div>
</div>
`
    incidentsHTML += html;

  });
  incidentsElement.innerHTML = incidentsHTML
  const updatesCountBadge = document.querySelectorAll('.incident-update-count')
  updatesCountBadge.forEach((badge) => {
    const updCount = Number(badge.innerHTML)
    if (updCount <= 0) {
      badge.classList.add('hidden')
    }
  })

  const audioPlayer = document.querySelectorAll('.audio-player');
  let currentlyPlaying = null; // Store the currently playing audio element

  audioPlayer.forEach((player) => {
    const audioToggle = player.querySelector('#audio-toggle');
    const audioElement = player.querySelector('#audio-element');

    audioToggle.addEventListener('click', () => {
      if (audioElement !== currentlyPlaying) {
        // Pause the currently playing audio (if any)
        if (currentlyPlaying) {
          currentlyPlaying.pause();
          // Reset the icon for the previously playing audio
          const prevAudioToggle = currentlyPlaying.parentElement.querySelector('#audio-toggle');
          prevAudioToggle.classList.remove('fa-pause');
          prevAudioToggle.classList.add('fa-play');
        }

        // Set the new audio as the currently playing one
        currentlyPlaying = audioElement;
      }

      if (audioElement.paused) {
        audioElement.play();
        audioToggle.classList.remove('fa-play');
        audioToggle.classList.add('fa-pause');
      } else {
        audioElement.pause();
        audioToggle.classList.remove('fa-pause');
        audioToggle.classList.add('fa-play');
      }
    });

    audioElement.addEventListener('ended', () => {
      audioToggle.classList.remove('fa-pause');
      audioToggle.classList.add('fa-play');
    });
  });

  editExisitingIncident()
}

//Global Variables
let submitButtonisCollapsed = false;
let defaultIncidentState = 'reported';
let defaultIncidentTime = 'active';
let defaultIncidentLevel = 'medium';
let matchingIncident = null; // Define it in a higher scope


const stateAlertButtons = document.querySelectorAll('.state');
stateAlertButtons.forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.parentElement;
    const siblings = parent.querySelectorAll('.alert-btn');
    siblings.forEach(sibling => {
      sibling.classList.remove('active');
    });

    button.classList.add('active');
    defaultIncidentState = button.innerHTML.toLowerCase()
  });
});

const levelAlertButtons = document.querySelectorAll('.level');
levelAlertButtons.forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.parentElement;
    const siblings = parent.querySelectorAll('.alert-btn');
    siblings.forEach(sibling => {
      sibling.classList.remove('active');
    });

    button.classList.add('active');
    defaultIncidentLevel = button.innerHTML.toLowerCase()

  });
});

const timeAlertButtons = document.querySelectorAll('.time');
timeAlertButtons.forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.parentElement;
    const siblings = parent.querySelectorAll('.alert-btn');
    siblings.forEach(sibling => {
      sibling.classList.remove('active');
    });

    button.classList.add('active');
    defaultIncidentTime = button.innerHTML.toLowerCase()
  });
});


// Get references to the select elements and display element
const tagsSelect = document.getElementById('tags');
const crimeSelect = document.getElementById('crime');
const fireSelect = document.getElementById('fire');
const trafficSelect = document.getElementById('traffic');
const weatherSelect = document.getElementById('weather');
const miscSelect = document.getElementById('misc');
const tagsDisplay = document.querySelector('.tags-display');

// Initialize an array to store selected tags
let selectedTags = [];

// Add event listeners to all select elements
function updateTags() {
  tagsSelect.addEventListener('change', updateDisplay);
  crimeSelect.addEventListener('change', updateDisplay);
  fireSelect.addEventListener('change', updateDisplay);
  trafficSelect.addEventListener('change', updateDisplay);
  weatherSelect.addEventListener('change', updateDisplay);
  miscSelect.addEventListener('change', updateDisplay);
}


updateTags()
function updateDisplay() {
  const selectElement = this;
  const selectedValue = selectElement.value;

  if (selectedValue !== "") {
    if (!selectedTags.includes(selectedValue)) {
      selectedTags.push(selectedValue);

      // Reset the value of the select element
      selectElement.value = "";

      updateTagsDisplay();
    }
  }
}



// Function to remove a tag when clicked
function removeTag(tagToRemove) {
  const indexToRemove = selectedTags.indexOf(tagToRemove);
  if (indexToRemove !== -1) {
    selectedTags.splice(indexToRemove, 1);

    updateTagsDisplay();
  }
}

// Function to update the display element with selected tags
function updateTagsDisplay() {
  const selectedTagsHTML = selectedTags.map(tag => `<span class="tag">${tag}</span>`).join('');
  tagsDisplay.innerHTML = selectedTagsHTML;

  // Add event listeners to each tag element
  const tagElements = tagsDisplay.querySelectorAll('.tag');
  tagElements.forEach(tagElement => {
    tagElement.addEventListener('click', () => {
      const tagToRemove = tagElement.textContent;
      removeTag(tagToRemove);
    });
  });
}


const addressInput = document.querySelector('#address');
const titleInput = document.querySelector('#caption-input');
const updateInput = document.querySelector('#description-input');
//Create new incident
let isNewIncident = true; // Flag to indicate whether it's a new incident or an update


function createIncident() {
  isNewIncident = true;

  addressInput.style.border = '';
  titleInput.style.border = '';
  updateInput.style.border = '';
  tagsDisplay.style.border = '';
  const address = addressInput.value
  const title = titleInput.value
  const update = updateInput.value

  if (address.trim() === '') {
    addressInput.style.border = '1px solid red';
    return;
  }

  if (title.trim() === '') {
    titleInput.style.border = '1px solid red';
    return;
  }

  if (update.trim() === '') {
    updateInput.style.border = '1px solid red';
    return;
  }

  if (selectedTags.length <= 0) {
    tagsDisplay.style.border = '3px solid #964444';
    return;
  }
  // Create a new Date object
  const currentDate = new Date();

  // Get the current date and time components
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const date = `${month}/${day} `
  const time = `${hours}:${minutes}`

  //initialize tags string to store selected tags
  // const tagsStr = selectedTags
  selectedTags.push(defaultIncidentState, defaultIncidentTime, defaultIncidentLevel)
  //create incident
  const incident = {
    title,
    update,
    address,
    date,
    clip: selectedClipsIds,
    tags: selectedTags,
    author: displayName,
    time,
    updates: [],
    createdAt: serverTimestamp(),
  }
  const stagingDataColRef = collection(database, "incidents");

  addDoc(stagingDataColRef, incident)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  resetState()

  // Clear the selectedClipsIds array
  selectedClipsIds.length = 0;
  // Remove all elements with the class 'audio-player' from the DOM
  const audioPlayers = document.querySelectorAll('.audio-player');
  audioPlayers.forEach((player) => {
    player.remove();
  });
}


//handle click event to create new incident
const submitButton = document.querySelector('.submit-btn')
const updateButton = document.querySelector('.update-btn')
const newIncidentTitle = document.querySelector('.new-incident-title')
const submitButtonContainer = document.querySelector('.new-incident .submit-btn-container');
const updateButtonContainer = document.querySelector('.new-incident .update-btn-container');
submitButton.addEventListener('click', createIncident)


function editExisitingIncident() {
  const incidentContainers = document.querySelectorAll('.incident-container');
  incidentContainers.forEach(container => {
    container.addEventListener('click', () => {
      document.querySelector('.clear-incident-form').classList.remove('hidden')
      // container.focus();
      if (!submitButtonisCollapsed) {
        submitButtonContainer.style.width = '0px';
        updateButtonContainer.style.width = '100%'
        submitButtonisCollapsed = !submitButtonisCollapsed;
      }
      console.log(container)
      // container.style.background = "#2d3542";

      //Get the value of updates count from DOM
      const incidentUpdatesCount = Number(container.querySelector('.incident-update-count').innerHTML)
      if (incidentUpdatesCount > 0) {
        const updatesContainer = container.querySelector('.updates-container');
        if (!updatesContainer.classList.contains('show-updates')) {
          updatesContainer.classList.add('show-updates')
        }
      }
      //Find matching incident from local db
      const { dataset: { incidentId } } = container;
      matchingIncident = localeStagingData.find((incident) => incident.id === incidentId)
      const { title, address, tags } = matchingIncident;
      newIncidentTitle.innerHTML = `Update: ${title}`
      // Populate input fields with incident details
      updateInput.style.border = ''
      addressInput.value = address;
      titleInput.value = title;
      updateInput.value = '';
      // Update the selected tags
      const excludedItems = ['active', 'reported', 'medium', 'debunked', 'responded', 'low', 'high', 'past', 'future'];
      selectedTags = tags.filter(tag => !excludedItems.includes(tag)).slice();
      // Update the UI to reflect the selected tags
      updateTagsDisplay();
    });
  });
}

updateButton.addEventListener('click', publishUpdate)
function publishUpdate() {
  const updateText = updateInput.value.trim()

  if (updateText === '') {
    updateInput.style.border = '1px solid red'
    return;
  }
  // Create a new incident object for the update
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const date = `${month}/${day}`;
  const time = `${hours}:${minutes}`;


  selectedTags.push(defaultIncidentState, defaultIncidentTime, defaultIncidentLevel)
  const updateIncident = {
    title: titleInput.value,
    update: updateText,
    address: addressInput.value,
    date,
    clip: selectedClipsIds,
    tags: selectedTags.slice(), // Copy selected tags
    author: displayName,
    time,
    createdAt: Timestamp.now(),

  };

  //Get Document Reference
  const stagingDataColRef = collection(database, "incidents");
  const docRef = doc(stagingDataColRef, matchingIncident.id)
  updateDoc(docRef, { updates: arrayUnion(updateIncident) }).then(() => {
    console.log('Object successfully added to the array!');
  })
    .catch((error) => {
      console.error('Error adding object to the array: ', error);
    });
  console.log('update published')
  // Clear input fields and selected tags
  resetState()
  // Clear the selectedClipsIds array
  selectedClipsIds.length = 0;
  // Remove all elements with the class 'audio-player' from the DOM
  const audioPlayers = document.querySelectorAll('.audio-player');
  audioPlayers.forEach((player) => {
    player.remove();
  });
}


function resetState() {
  addressInput.value = '';
  titleInput.value = '';
  updateInput.value = '';
  selectedTags = [];
  updateTagsDisplay();
  if (submitButtonisCollapsed) {
    submitButtonContainer.style.width = '100%';
    updateButtonContainer.style.width = '0px'
    submitButtonisCollapsed = !submitButtonisCollapsed;
  }
  document.querySelector('.clear-incident-form').classList.add('hidden')
  newIncidentTitle.innerHTML = "New Incident"

  const classNameToSearch = "show-updates";
  const parentElement = document;
  const elementsWithClassName = parentElement.getElementsByClassName(classNameToSearch);

  // Convert the HTMLCollection to an array and remove the class from all elements
  Array.from(elementsWithClassName).forEach(element => {
    element.classList.remove(classNameToSearch);
  });
 

}

document.querySelector('.clear-incident-form').addEventListener('click', resetState)
document.addEventListener('keydown', (event) => {
  const pressedKey = event.key
  if (pressedKey === "Escape") {
    resetState()
  }
})

document.querySelector('#search-item').addEventListener('keyup', (event) => {
  event.stopPropagation();
  console.log(event.key)
  const searchbox = document.querySelector('#search-item').value.toUpperCase();
  const searchIncidents = document.querySelectorAll('.incident-container');
  
  for (let i = 0; i < searchIncidents.length; i++) {
    let match = searchIncidents[i].getElementsByTagName('span')[0];
    
    if (match) {
      let textValue = match.textContent || match.innerHTML;
      console.log(textValue)
      
      if (textValue.toUpperCase().indexOf(searchbox) > -1) {
        searchIncidents[i].style.display = ""; // Display the matching incident
      } else {
        searchIncidents[i].style.display = "none"; // Hide the non-matching incident
      }
    }
  }
})

