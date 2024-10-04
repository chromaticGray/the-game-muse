// Data Lists (will be fetched from JSON files)
let genres = [];
let mechanics = [];
let themes = [];

// Selected Elements
let selectedGenres = [];
let selectedMechanics = [];
let selectedTheme = null;

// Info Box Element
let infoBox = null;

// Fetch Data Function
async function fetchData() {
    try {
        const [genresResponse, mechanicsResponse, themesResponse] = await Promise.all([
            fetch('genres.json'),
            fetch('mechanics.json'),
            fetch('themes.json')
        ]);

        genres = await genresResponse.json();
        mechanics = await mechanicsResponse.json();
        themes = await themesResponse.json();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
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

    if (items.length === 0) {
        outputElement.textContent = 'No items available.';
        return;
    }

    const randomItem = items[Math.floor(Math.random() * items.length)];
    outputElement.textContent = randomItem.name;
    outputElement.dataset.index = items.indexOf(randomItem);
}

// Add Function
function add(category) {
    let outputElement = null;
    let displayElement = null;
    let items = [];
    let selectedList = null;

    switch (category) {
        case 'genres':
            outputElement = document.getElementById('genres-output');
            displayElement = document.getElementById('game-genres');
            items = genres;
            selectedList = selectedGenres;
            break;
        case 'mechanics':
            outputElement = document.getElementById('mechanics-output');
            displayElement = document.getElementById('game-mechanics');
            items = mechanics;
            selectedList = selectedMechanics;
            break;
        case 'themes':
            outputElement = document.getElementById('themes-output');
            displayElement = document.getElementById('game-theme');
            items = themes;
            selectedTheme = null; // Reset previous theme
            break;
    }

    const index = outputElement.dataset.index;
    if (index === undefined) return;

    const item = items[index];

    // For themes, we only select one
    if (category === 'themes') {
        selectedTheme = item;
        displayElement.innerHTML = createClickableElement(item, category);
    } else {
        if (!selectedList.some(i => i.name === item.name)) {
            selectedList.push(item);
            updateDisplay(displayElement, selectedList, category);
        }
    }

    // Clear output after adding
    outputElement.textContent = '';
    delete outputElement.dataset.index;
}

// Update Display Function
function updateDisplay(element, list, category) {
    element.innerHTML = '';
    list.forEach(item => {
        element.innerHTML += createClickableElement(item, category);
    });
}

// Create Clickable Element Function
function createClickableElement(item, category) {
    return `<span class="clickable-item" onclick="showInfo('${category}', '${item.name}')">${item.name}</span> `;
}

// Show Info Function
function showInfo(category, itemName) {
    let items = [];
    switch (category) {
        case 'genres':
            items = genres;
            break;
        case 'mechanics':
            items = mechanics;
            break;
        case 'themes':
            items = themes;
            break;
    }

    const item = items.find(i => i.name === itemName);
    if (!item) return;

    let infoContent = `<h4>${item.name}</h4>`;
    if (item.category) {
        infoContent += `<p><strong>Category:</strong> ${item.category}</p>`;
    }
    if (item.description) {
        infoContent += `<p><strong>Description:</strong> ${item.description}</p>`;
    }

    // Display in the info box
    infoBox.innerHTML = infoContent;
}

// Clear Current Idea Function
function clearCurrentIdea() {
    selectedGenres = [];
    selectedMechanics = [];
    selectedTheme = null;

    document.getElementById('game-title').textContent = '';
    document.getElementById('game-genres').innerHTML = '';
    document.getElementById('game-mechanics').innerHTML = '';
    document.getElementById('game-theme').innerHTML = '';

    document.getElementById('genres-output').textContent = '';
    document.getElementById('mechanics-output').textContent = '';
    document.getElementById('themes-output').textContent = '';

    infoBox.innerHTML = '';
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
        theme: selectedTheme
    };

    let savedIdeas = JSON.parse(localStorage.getItem('savedIdeas')) || [];
    savedIdeas.push(gameIdea);
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));

    updateSavedIdeasDropdown();
    alert('Game idea saved!');
    document.getElementById('idea-name').value = '';
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

// Load Idea Function
function loadIdea() {
    const index = document.getElementById('saved-ideas').value;
    if (index === '') return;

    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas'));
    const idea = savedIdeas[index];

    // Update selected elements
    selectedGenres = idea.genres;
    selectedMechanics = idea.mechanics;
    selectedTheme = idea.theme;

    // Update display
    document.getElementById('game-title').textContent = idea.name;
    updateDisplay(document.getElementById('game-genres'), selectedGenres, 'genres');
    updateDisplay(document.getElementById('game-mechanics'), selectedMechanics, 'mechanics');
    if (selectedTheme) {
        document.getElementById('game-theme').innerHTML = createClickableElement(selectedTheme, 'themes');
    } else {
        document.getElementById('game-theme').innerHTML = '';
    }

    // Clear info box
    infoBox.innerHTML = '';
}

// Initialize the app
async function init() {
    await fetchData();
    updateSavedIdeasDropdown();

    // Get the info box element
    infoBox = document.getElementById('info-box');
}

window.onload = init;
