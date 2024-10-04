// Data Lists
const genres = ['Rhythm-based', 'Action', 'RPG', 'Adventure', 'Puzzle', 'Strategy', 'Simulation'];
const mechanics = ['Dice Rolls', 'Permadeath', 'Crafting', 'Stealth', 'Multiplayer', 'Turn-based Combat'];
const themes = ['Cowboys', 'Space', 'Fantasy', 'Horror', 'Cyberpunk', 'Medieval'];

// Selected Elements
let selectedGenres = [];
let selectedMechanics = [];
let selectedTheme = '';

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

    const randomItem = items[Math.floor(Math.random() * items.length)];
    outputElement.value = randomItem;
}

// Add Function
function add(category) {
    let outputText = '';
    let displayElement = null;
    let outputElement = null;
    let placeholder = document.getElementById('placeholder-text');
    placeholder.style.display = 'none';

    switch (category) {
        case 'genres':
            outputElement = document.getElementById('genres-output').value;
            displayElement = document.getElementById('game-genres');
            if (outputElement && !selectedGenres.includes(outputElement)) {
                selectedGenres.push(outputElement);
                outputText = 'A ' + selectedGenres.join(', ') + ' game.';
                displayElement.textContent = outputText;
            }
            break;
        case 'mechanics':
            outputElement = document.getElementById('mechanics-output').value;
            displayElement = document.getElementById('game-mechanics');
            if (outputElement && !selectedMechanics.includes(outputElement)) {
                selectedMechanics.push(outputElement);
                outputText = 'With ' + selectedMechanics.join(' and ') + ' as mechanics.';
                displayElement.textContent = outputText;
            }
            break;
        case 'themes':
            outputElement = document.getElementById('themes-output').value;
            displayElement = document.getElementById('game-theme');
            if (outputElement) {
                selectedTheme = outputElement;
                outputText = selectedTheme + ' themed.';
                displayElement.textContent = outputText;
            }
            break;
    }

    // Update Game Title
    const gameTitle = document.getElementById('idea-name').value.trim();
    document.getElementById('game-title').textContent = gameTitle;

    // Clear the input field
    document.getElementById(category + '-output').value = '';
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

    // Reset fields
    document.getElementById('idea-name').value = '';
    resetDisplay();
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
    document.getElementById('idea-name').value = idea.name;
    document.getElementById('game-title').textContent = idea.name;

    if (selectedGenres.length > 0) {
        document.getElementById('game-genres').textContent = 'A ' + selectedGenres.join(', ') + ' game.';
    } else {
        document.getElementById('game-genres').textContent = '';
    }

    if (selectedMechanics.length > 0) {
        document.getElementById('game-mechanics').textContent = 'With ' + selectedMechanics.join(' and ') + ' as mechanics.';
    } else {
        document.getElementById('game-mechanics').textContent = '';
    }

    if (selectedTheme) {
        document.getElementById('game-theme').textContent = selectedTheme + ' themed.';
    } else {
        document.getElementById('game-theme').textContent = '';
    }

    // Hide placeholder text
    document.getElementById('placeholder-text').style.display = 'none';
}

// Reset Display Function
function resetDisplay() {
    selectedGenres = [];
    selectedMechanics = [];
    selectedTheme = '';
    document.getElementById('game-title').textContent = '';
    document.getElementById('game-genres').textContent = '';
    document.getElementById('game-mechanics').textContent = '';
    document.getElementById('game-theme').textContent = '';
    document.getElementById('placeholder-text').style.display = 'block';
}

// Initialize the app
function init() {
    updateSavedIdeasDropdown();
}

window.onload = init;
