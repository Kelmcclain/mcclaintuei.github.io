let submitButtonisCollapsed = false;



function renderIncidents() {
    const incidentsElement = document.querySelector('#incidents');
    let incidentsHTML = [];
    incidents.forEach(incident => {
        let { incidentId, title, update, updates, address, clip, tags, author, date, time } = incident;


        if (updates.length != 0) {
            title = updates[0].title
            update = updates[0].update
            address = updates[0].address
            time = updates[0].time
            date = updates[0].date
            author = updates[0].author
            clip = updates[0].clip
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
                levelStyling = 'linear-gradient(45deg, var(--secondary-color), #576f7e);'
            } else if (tag === 'high') {
                levelStyling = 'linear-gradient(45deg, var(--secondary-color), #665050);'

            }
        })


        let html = `
                    <div class="incident-container" style="background:${levelStyling}" data-incident-id="${incidentId}">
                    <div class="incident-update-count">${updatesCount}</div>

                    <table>
                        <tr class="table-row">
                            <td class="incident-info">
                                <span class="title">${title}</span><br>
                                <span class="caption">${update}</span><br>
                                <span class="address">${address}</span>
                            </td>
                            <td><span class="time">${time}</span><span class="date">${date}</span></td>
                        </tr>
                        <tr class="table-row">
                            <td class="tag-container">                                
                                ${tagEl.join('')}
                            </td>
                            <td>
                                <span class="author">${author}</span>
                            </td>
                        </tr>
                        <tr><td><span class="incident-clips"><i class="fa fa-play" aria-hidden="true"></i></span></td></tr>
                    </table>
                </div>
                `

        incidentsHTML += html;

    });
    incidentsElement.innerHTML = incidentsHTML
    // editExisitingIncident()
    const updatesCountBadge = document.querySelectorAll('.incident-update-count')
    updatesCountBadge.forEach((badge) => {
        const updCount = Number(badge.innerHTML)
        if (updCount <= 0) {
            badge.classList.add('hidden')
        }
    })
}
//initial render
renderIncidents()

let defaultIncidentState = 'unconfirmed';
let defaultIncidentLevel = 'medium';
let defaultIncidentTime = 'active';

// Get all the buttons with the class "state"
const stateAlertButtons = document.querySelectorAll('.state');
// Loop through each button
stateAlertButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove the "active" class from all buttons with the same parent
        const parent = button.parentElement;
        const siblings = parent.querySelectorAll('.alert-btn');
        siblings.forEach(sibling => {
            sibling.classList.remove('active');
        });

        // Add the "active" class to the clicked button
        button.classList.add('active');
        defaultIncidentState = button.innerHTML.toLowerCase()
    });
});

const levelAlertButtons = document.querySelectorAll('.level');
// Loop through each button
levelAlertButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove the "active" class from all buttons with the same parent
        const parent = button.parentElement;
        const siblings = parent.querySelectorAll('.alert-btn');
        siblings.forEach(sibling => {
            sibling.classList.remove('active');
        });

        // Add the "active" class to the clicked button
        button.classList.add('active');
        defaultIncidentLevel = button.innerHTML.toLowerCase()

    });
});

const timeAlertButtons = document.querySelectorAll('.time');
// Loop through each button
timeAlertButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove the "active" class from all buttons with the same parent
        const parent = button.parentElement;
        const siblings = parent.querySelectorAll('.alert-btn');
        siblings.forEach(sibling => {
            sibling.classList.remove('active');
        });

        // Add the "active" class to the clicked button
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

// Function to update the display element with selected values
function updateDisplay() {
    // Get the value and ID of the select element that triggered the change event
    const selectElement = this; // 'this' refers to the select element that triggered the event
    const selectedValue = selectElement.value;


    if (selectedValue !== "") {
        if (!selectedTags.includes(selectedValue)) {
            selectedTags.push(selectedValue);
        }
    }

    updateTagsDisplay();

}

// Function to update the display element with selected tags
function updateTagsDisplay() {
    const selectedTagsHTML = selectedTags.map(tag => `<span class="tag" onclick="removeTag('${tag}')">${tag}</span>`).join('');

    tagsDisplay.innerHTML = selectedTagsHTML;
    editExisitingIncident()

}

// Function to remove a tag when clicked
function removeTag(tagToRemove) {
    const indexToRemove = selectedTags.indexOf(tagToRemove);
    if (indexToRemove !== -1) {
        selectedTags.splice(indexToRemove, 1);

        updateTagsDisplay();
    }
}

const addressInput = document.querySelector('#address');
const titleInput = document.querySelector('#caption-input');
const updateInput = document.querySelector('#description-input');
const tags = document.querySelector('#tags').value;
const fire = document.querySelector('#fire').value;
const weather = document.querySelector('#weather').value;
const crime = document.querySelector('#crime').value;
const traffic = document.querySelector('#traffic').value;
const misc = document.querySelector('#misc').value;
//Create new incident
let isNewIncident = true; // Flag to indicate whether it's a new incident or an update

function createIncident() {
    isNewIncident = true;

    addressInput.style.border = '';
    titleInput.style.border = '';
    updateInput.style.border = '';
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


    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let incidentId = '';
    const desiredIdLength = 10;
    for (let i = 0; i < desiredIdLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        incidentId += characters.charAt(randomIndex);
    }
    const timestamp = Date.now();
    incidentId += timestamp.toString();


    //initialize tags string to store selected tags
    const tagsStr = selectedTags
    tagsStr.push(defaultIncidentLevel, defaultIncidentState, defaultIncidentTime)
    //create incident
    const incident = {
        incidentId,
        title,
        update,
        address,
        date,
        clip: 'SB194WcCSq0YkSQ',
        tags: selectedTags,
        author: 'McClain',
        time,
        updates: []
    }
    incidents.push(incident)
    localStorage.setItem('incidents', JSON.stringify(incidents))

    // tagsDisplay.innerHTML = '';
    resetState()


}

//handle click event to create new incident
const submitButton = document.querySelector('.submit-btn')
const updateButton = document.querySelector('.update-btn')
const submitButtonContainer = document.querySelector('.new-incident .submit-btn-container');
const updateButtonContainer = document.querySelector('.new-incident .update-btn-container');



submitButton.addEventListener('click', createIncident)


let matchingIncident = null; // Define it in a higher scope

editExisitingIncident()


function editExisitingIncident() {
    const incidentContainers = document.querySelectorAll('.incident-container');
    incidentContainers.forEach(container => {
        container.addEventListener('click', () => {
            document.querySelector('.clear-incident-form').classList.remove('hidden')

            if (!submitButtonisCollapsed) {
                submitButtonContainer.style.width = '0px';
                updateButtonContainer.style.width = '100%'
                submitButtonisCollapsed = !submitButtonisCollapsed;
            }

            const { dataset: { incidentId } } = container;
            matchingIncident = incidents.find((incident) => incident.incidentId === incidentId)
            const { title, update, address, clip, tags, author, date, time } = matchingIncident;
            // Populate input fields with incident details
            addressInput.value = address;
            titleInput.value = title;
            updateInput.value = ''; // Clear the update input field

            // Update the selected tags
            const excludedItems = ['active', 'unconfirmed', 'medium', 'debunked', 'confirmed', 'low', 'high', 'past', 'future'];
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

    const updateIncident = {
        title: titleInput.value,
        update: updateText,
        address: addressInput.value,
        date,
        clip: 'SB194WcCSq0YkSQ',
        tags: selectedTags.slice(), // Copy selected tags
        author: 'McClain',
        time,
    };
    // Update the existing incident
    matchingIncident.updates.unshift(updateIncident);

    // Clear the update input field
    updateInput.value = '';

    // Update the local storage to persist incidents
    localStorage.setItem('incidents', JSON.stringify(incidents));
    console.log('update published')
    console.log(matchingIncident)

    // Re-render the incidents list to reflect the changes
    // Clear input fields and selected tags
    resetState()
}

function resetState() {
    addressInput.value = '';
    titleInput.value = '';
    updateInput.value = '';
    selectedTags = [];
    updateTagsDisplay();
    renderIncidents();
    if (submitButtonisCollapsed) {
        submitButtonContainer.style.width = '100%';
        updateButtonContainer.style.width = '0px'
        submitButtonisCollapsed = !submitButtonisCollapsed;
    }
    document.querySelector('.clear-incident-form').classList.add('hidden')

}
document.querySelector('.clear-incident-form').addEventListener('click', resetState)
document.addEventListener('keydown', (event) => {
    const pressedKey = event.key
    if (pressedKey === "Escape") {
        resetState()
    }
})

