function renderIncidents() {
    const incidentsElement = document.querySelector('#incidents');
    let incidentsHTML = [];
    incidents.forEach(incident => {
        const { incidentId, title, update, address, clip, tags, author, date, time } = incident;
        const tagEl = []
        tags.forEach(item => {
            const tagHTML = `<span class="tag">${item}</span>`
            tagEl.push(tagHTML)
        })

        let html = `
                    <div class="incident-container" data-incident-id="${incidentId}">
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
        defaultIncidentState = button.innerHTML
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
        defaultIncidentLevel = button.innerHTML

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
        defaultIncidentTime = button.innerHTML
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
    // Create an HTML string based on the selectedTags array
    const selectedTagsHTML = selectedTags.map(tag => `<span class="tag" onclick="removeTag('${tag}')">${tag}</span>`).join('');

    // Update the display element
    tagsDisplay.innerHTML = selectedTagsHTML; // You can customize the formatting as needed
}

// Function to remove a tag when clicked
function removeTag(tagToRemove) {
    // Find the index of the tag to remove in the selectedTags array
    const indexToRemove = selectedTags.indexOf(tagToRemove);

    // Check if the tag was found in the array
    if (indexToRemove !== -1) {
        // Remove the tag from the selectedTags array
        selectedTags.splice(indexToRemove, 1);
        console.log(indexToRemove)

        // Update the display element
        updateTagsDisplay();
        console.log(selectedTags)
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
function createIncident() {
    // Remove any existing red borders
    addressInput.style.border = '';
    titleInput.style.border = '';
    updateInput.style.border = '';
    const address = addressInput.value
    const title = titleInput.value
    const update = updateInput.value


    // Perform validation checks
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
    const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const date = `${month}/${day} `
    const time = `${hours}:${minutes}`


    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let incidentId = '';

    for (let i = 0; i < length; i++) {
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
    addressInput.value = '';
    titleInput.value = '';
    updateInput.value = '';
    selectedTags = []
    tagsDisplay.innerHTML = ''; // You can customize the formatting as needed
    //add incident to database
    incidents.push(incident)
    console.log(incident);
    //update persistance database
    localStorage.setItem('incidents', JSON.stringify(incidents))
    renderIncidents()

}

//handle click event to create new incident
document.querySelector('.submit-btn').addEventListener('click', () => {
    createIncident();
    updateExistingIncident();

})

function updateExistingIncident() {
    const incidentContainers = document.querySelectorAll('.incident-container');
    incidentContainers.forEach(container => {
        container.addEventListener('click', () => {
            document.querySelector('.new-incident')
                .innerHTML = `<button class="update-btn">Update</button> `

            const { dataset: { incidentId } } = container;
            const matchingIncident = incidents.find((incident) => incident.incidentId === incidentId)
            const { title, update, address, clip, tags, author, date, time } = matchingIncident;

            // Populate input fields with incident details
            addressInput.value = address;
            titleInput.value = title;
            updateInput.value = ''; // Clear the update input field

            // Update the selected tags
            const excludedItems = ['active', 'unconfirmed', 'Med'];
            selectedTags = tags.filter(tag => !excludedItems.includes(tag)).slice();
            // Update the UI to reflect the selected tags
            updateTagsDisplay();

        });
    });
}

function handleIncidentUpdate() {
    const saveUpdateButton = document.querySelector('.update-btn');

    saveUpdateButton.addEventListener('click', () => {
        const updateText = updateInput.value.trim()
        // Ensure the update text is not empty
        if (updateText === '') {
            return;
        }

    })

}

// Call the setup function initially
updateExistingIncident();

