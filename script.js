// Data Lists (will be fetched from JSON files)
let genres = [];
let mechanics = [];
let themes = [];

// Selected Elements
let selectedGenres = [];
let selectedMechanics = [];
let selectedTheme = '';

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
    outputElement.textContent = randomItem;
}

// Add Function
function add(category) {
    let outputText = '';
    let displayElement = null;
    let outputElement = null;

    switch (category) {
        case 'genres':
            outputElement = document.getElementById('genres-output').textContent;
            displayElement = document.getElementById('game-genres');
            if (outputElement && !selectedGenres.includes(outputElement)) {
                selectedGenres.push(outputElement);
                outputText = 'A ' + selectedGenres.join(', ') + ' game.';
                displayElement.textContent = outputText;
            }
            break;
        case 'mechanics':
            outputElement = document.getElementById('mechanics-output').textContent;
            displayElement = document.getElementById('game-mechanics');
            if (outputElement && !selectedMechanics.includes(outputElement)) {
                selectedMechanics.push(outputElement);
                outputText = 'With ' + selectedMechanics.join(', ') + ' mechanics.';
                displayElement.textContent = outputText;
            }
            break;
        case 'themes':
            outputElement = document.getElementById('themes-output').textContent;
            displayElement = document.getElementById('game-theme');
            if (outputElement) {
                selectedTheme = outputElement;
                outputText = selectedTheme + ' themed.';
                displayElement.textContent = outputText;
            }
            break;
    }
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
    document.getElementById('game-genres').textContent = 'A ' + selectedGenres.join(', ') + ' game.';
    document.getElementById('game-mechanics').textContent = 'With ' + selectedMechanics.join(', ') + ' mechanics.';
    document.getElementById('game-theme').textContent = selectedTheme + ' themed.';
}

// Clear Current Idea Function
function clearCurrentIdea() {
    selectedGenres = [];
    selectedMechanics = [];
    selectedTheme = '';

    document.getElementById('game-title').textContent = '';
    document.getElementById('game-genres').textContent = '';
    document.getElementById('game-mechanics').textContent = '';
    document.getElementById('game-theme').textContent = '';

    document.getElementById('genres-output').textContent = '';
    document.getElementById('mechanics-output').textContent = '';
    document.getElementById('themes-output').textContent = '';
}

// Initialize the app
async function init() {
    await fetchData();
    updateSavedIdeasDropdown();
}

window.onload = init;
