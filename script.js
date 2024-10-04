// Data Lists
let genres = [];
let mechanics = [];
let themes = [];

// Selected Elements
let selectedGenres = [];
let selectedMechanics = [];
let selectedThemes = []; // Changed to array for multiple themes

// Load Data from JSON Files
function loadData() {
    Promise.all([
        fetch('genres.json').then(response => response.json()),
        fetch('mechanics.json').then(response => response.json()),
        fetch('themes.json').then(response => response.json())
    ]).then(data => {
        genres = data[0];
        mechanics = data[1];
        themes = data[2];
    }).catch(error => {
        console.error('Error loading data:', error);
    });
}

// Roll Function
function roll(category) {
    let items = [];
    let outputElement = null;

    switch (category) {
        case 'genres':
            items = genres;
            outputElement = document.getElementById('genres-output');
            break;
        case 'mechanics':
            items = mechanics;
            outputElement = document.getElementById('mechanics-output');
            break;
        case 'themes':
            items = themes;
            outputElement = document.getElementById('themes-output');
            break;
    }
	console.log(items)
    randomItem = items[Math.floor(Math.random() * items.length)];
	console.log(randomItem)
    outputElement.value = randomItem.name;
    outputElement.dataset.itemIndex = items.indexOf(randomItem);
}

// Add Function
function add(category) {
    let outputElement = null;
    let selectedArray = null;
    let displayElement = null;
    let items = [];
    let placeholder = document.getElementById('placeholder-text');
    placeholder.style.display = 'none';

    switch (category) {
        case 'genres':
            outputElement = document.getElementById('genres-output');
            displayElement = document.getElementById('game-genres');
            selectedArray = selectedGenres;
            items = genres;
            break;
        case 'mechanics':
            outputElement = document.getElementById('mechanics-output');
            displayElement = document.getElementById('game-mechanics');
            selectedArray = selectedMechanics;
            items = mechanics;
            break;
        case 'themes':
            outputElement = document.getElementById('themes-output');
            displayElement = document.getElementById('game-theme');
            selectedArray = selectedThemes;
            items = themes;
            break;
    }

    const itemName = outputElement.value;
    const itemIndex = parseInt(outputElement.dataset.itemIndex);

    if (itemName && !selectedArray.some(item => item.name === itemName)) {
        const selectedItem = items[itemIndex];
        selectedArray.push(selectedItem);

        // Update display
        if (selectedArray.length > 0) {
            let names = selectedArray.map(item => `<span class="clickable-item" data-category="${category}" data-index="${items.indexOf(item)}">${item.name}</span>`);
            let outputText = '';

            if (category === 'genres') {
                outputText = 'A ' + names.join(', ') + ' game.';
                displayElement.style.color = '#aa88ff'; // Purple
            } else if (category === 'mechanics') {
                outputText = 'With ' + names.join(' and ') + ' as mechanics.';
                displayElement.style.color = '#ff8888'; // Red
            } else if (category === 'themes') {
                outputText = names.join(', ') + ' themed.';
                displayElement.style.color = '#88ffff'; // Dark cyan
            }

            displayElement.innerHTML = outputText;
        }

        // Clear the input field
        outputElement.value = '';
        outputElement.dataset.itemIndex = '';
    }
}

// Event Listener for Clickable Items
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('clickable-item')) {
        const category = event.target.dataset.category;
        const index = parseInt(event.target.dataset.index);
        let item = null;

        switch (category) {
            case 'genres':
                item = genres[index];
                break;
            case 'mechanics':
                item = mechanics[index];
                break;
            case 'themes':
                item = themes[index];
                break;
        }

        showItemDetails(item);
    }
});

// Show Item Details Function
function showItemDetails(item) {
    let content = `<h3>${item.name}</h3>`;
    if (item.category) {
        content += `<p><strong>Category:</strong> ${item.category}</p>`;
    }
    if (item.description) {
        content += `<p><strong>Description:</strong> ${item.description}</p>`;
    }

    // Display in a modal
    showModal(content);
}

// Modal Function
function showModal(content) {
    let modal = document.createElement('div');
    modal.id = 'modal';
    modal.innerHTML = `
        <div id="modal-content">
            ${content}
            <button id="modal-close">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('modal-close').onclick = function() {
        document.body.removeChild(modal);
    };
}

// Save Idea Function
function saveIdea() {
    const ideaName = document.getElementById('idea-name').value.trim();
    if (!ideaName) {
        alert('Please enter a name for your game idea.');
        return;
    }

    const gameIdea = {
        name: ideaName,
        genres: selectedGenres,
        mechanics: selectedMechanics,
        themes: selectedThemes
    };

    let savedIdeas = JSON.parse(localStorage.getItem('savedIdeas')) || [];
    savedIdeas.push(gameIdea);
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));

    updateSavedIdeasDropdown();
    alert('Game idea saved!');

    // Reset fields
    document.getElementById('idea-name').value = '';
    resetDisplay();
}

// Load Idea Function
function loadIdea() {
    const index = document.getElementById('saved-ideas').value;
    if (index === '') return;

    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas'));
    const idea = savedIdeas[index];

    // Update selected elements
    selectedGenres = idea.genres;
    selectedMechanics = idea.mechanics;
    selectedThemes = idea.themes;

    // Update display
    document.getElementById('idea-name').value = idea.name;
    document.getElementById('game-title').textContent = idea.name;

    // Update Genres Display
    updateDisplay('genres', selectedGenres, 'game-genres', 'A ', ' game.', '#aa88ff');
    // Update Mechanics Display
    updateDisplay('mechanics', selectedMechanics, 'game-mechanics', 'With ', ' as mechanics.', '#ff8888');
    // Update Themes Display
    updateDisplay('themes', selectedThemes, 'game-theme', '', ' themed.', '#88ffff');

    // Hide placeholder text
    document.getElementById('placeholder-text').style.display = 'none';
}

// Update Display Function
function updateDisplay(category, selectedArray, displayElementId, prefix, suffix, color) {
    const displayElement = document.getElementById(displayElementId);
    if (selectedArray.length > 0) {
        let itemsList = selectedArray.map(item => `<span class="clickable-item" data-category="${category}" data-index="${item.index}">${item.name}</span>`);
        displayElement.innerHTML = prefix + itemsList.join(', ') + suffix;
        displayElement.style.color = color;
    } else {
        displayElement.innerHTML = '';
    }
}

// Reset Display Function
function resetDisplay() {
    selectedGenres = [];
    selectedMechanics = [];
    selectedThemes = [];
    document.getElementById('game-title').textContent = '';
    document.getElementById('game-genres').innerHTML = '';
    document.getElementById('game-mechanics').innerHTML = '';
    document.getElementById('game-theme').innerHTML = '';
    document.getElementById('placeholder-text').style.display = 'block';
}

// Update Saved Ideas Dropdown
function updateSavedIdeasDropdown() {
    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas')) || [];
    const dropdown = document.getElementById('saved-ideas');
    dropdown.innerHTML = '<option value="">Select a saved idea</option>';
    savedIdeas.forEach((idea, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = idea.name;
        dropdown.appendChild(option);
    });
}

// Initialize the app
function init() {
    loadData();
    updateSavedIdeasDropdown();
}

window.onload = init;
