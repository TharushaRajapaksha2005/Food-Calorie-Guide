// Food Library Data (Standardized to kcal per 100g)
const FOODS = [
    { id: 1, name: "Apple", caloriesPer100g: 52 },
    { id: 2, name: "Banana", caloriesPer100g: 89 },
    { id: 3, name: "Chicken Breast", caloriesPer100g: 165 },
    { id: 4, name: "Egg", caloriesPer100g: 155 },
    { id: 5, name: "White Rice (Cooked)", caloriesPer100g: 130 },
    { id: 6, name: "Almonds", caloriesPer100g: 579 },
    { id: 7, name: "Greek Yogurt", caloriesPer100g: 59 },
    { id: 8, name: "Avocado", caloriesPer100g: 160 },
    { id: 9, name: "Salmon", caloriesPer100g: 208 },
    { id: 10, name: "Peanut Butter", caloriesPer100g: 588 },
    { id: 11, name: "Oatmeal (Cooked)", caloriesPer100g: 68 },
    { id: 12, name: "Broccoli", caloriesPer100g: 34 },
    { id: 13, name: "Black Beans", caloriesPer100g: 132 },
    { id: 14, name: "Olive Oil", caloriesPer100g: 884 },
    { id: 15, name: "Sweet Potato", caloriesPer100g: 86 },
    { id: 16, name: "Pizza", caloriesPer100g: 266 },
    { id: 17, name: "Burger", caloriesPer100g: 295 },
    { id: 18, name: "Spinach", caloriesPer100g: 23 },
    { id: 19, name: "Whole Wheat Bread", caloriesPer100g: 247 },
    { id: 20, name: "Blueberries", caloriesPer100g: 57 }
];

const DAILY_GOAL = 2000;

// State
let trackedFoods = [];

// DOM Elements
const foodListEl = document.getElementById('food-list');
const trackedListEl = document.getElementById('tracked-list');
const totalCaloriesEl = document.getElementById('total-calories');
const progressBarEl = document.getElementById('progress-bar');
const progressTextEl = document.getElementById('progress-text');
const clearAllBtn = document.getElementById('clear-all');
const smartAddForm = document.getElementById('smart-add-form');
const foodDatalist = document.getElementById('food-options');
const libraryWeightInput = document.getElementById('library-weight');

// Initialize
function init() {
    loadData();
    renderFoodLibrary();
    populateDatalist();
    updateUI();
    setupEventListeners();
}

function setupEventListeners() {
    smartAddForm.onsubmit = (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('smart-name');
        const gramInput = document.getElementById('smart-grams');
        
        const foodName = nameInput.value;
        const grams = parseFloat(gramInput.value);
        
        // Find food in library
        const foodMatch = FOODS.find(f => f.name.toLowerCase() === foodName.toLowerCase());
        
        if (foodMatch) {
            const totalCals = Math.round((foodMatch.caloriesPer100g / 100) * grams);
            addFood({ name: foodMatch.name, calories: totalCals, grams: grams });
            
            // Clear only grams for convenience
            gramInput.value = '';
            nameInput.value = '';
            nameInput.focus();
        } else {
            alert(`Sorry, "${foodName}" is not in our library yet. Please select an item from the suggestions.`);
        }
    };
}

function populateDatalist() {
    foodDatalist.innerHTML = '';
    FOODS.forEach(food => {
        const option = document.createElement('option');
        option.value = food.name;
        foodDatalist.appendChild(option);
    });
}

// Render the list of available foods
function renderFoodLibrary() {
    foodListEl.innerHTML = '';
    FOODS.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.innerHTML = `
            <span class="name">${food.name}</span>
            <span class="calories">${food.caloriesPer100g} <small>kcal/100g</small></span>
        `;
        foodItem.onclick = () => {
            const grams = parseFloat(libraryWeightInput.value) || 100;
            const totalCals = Math.round((food.caloriesPer100g / 100) * grams);
            addFood({ name: food.name, calories: totalCals, grams: grams });
        };
        foodListEl.appendChild(foodItem);
    });
}

// Add food to the consumption log
function addFood(foodEntry) {
    const entry = {
        ...foodEntry,
        instanceId: Date.now() + Math.random()
    };
    trackedFoods.push(entry);
    saveData();
    updateUI();
}

// Remove food from the log
function removeFood(instanceId) {
    trackedFoods = trackedFoods.filter(item => item.instanceId !== instanceId);
    saveData();
    updateUI();
}

// Update the UI: totals, log, and progress bar
function updateUI() {
    renderTrackedList();

    const total = trackedFoods.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesEl.textContent = total;

    const percentage = Math.min((total / DAILY_GOAL) * 100, 100);
    progressBarEl.style.width = `${percentage}%`;
    progressTextEl.textContent = `${Math.round((total / DAILY_GOAL) * 100)}% of daily goal`;

    if (total > DAILY_GOAL) {
        totalCaloriesEl.style.color = 'var(--danger)';
        progressBarEl.style.background = 'var(--danger)';
    } else {
        totalCaloriesEl.style.color = 'var(--primary)';
        progressBarEl.style.background = 'linear-gradient(90deg, var(--primary-light), var(--primary))';
    }
}

// Render the list of consumed foods
function renderTrackedList() {
    trackedListEl.innerHTML = '';
    
    if (trackedFoods.length === 0) {
        trackedListEl.innerHTML = '<div class="empty-msg">No foods added today.</div>';
        return;
    }

    trackedFoods.forEach(item => {
        const trackedItem = document.createElement('div');
        trackedItem.className = 'tracked-item';
        trackedItem.innerHTML = `
            <div>
                <span style="font-weight: 600;">${item.name}</span>
                <span style="font-size: 0.8rem; color: #666; margin-left: 10px;">${item.grams}g | ${item.calories} kcal</span>
            </div>
            <button class="remove-btn" onclick="removeFood(${item.instanceId})">&times;</button>
        `;
        trackedListEl.appendChild(trackedItem);
    });
}

// Clear all tracked data
clearAllBtn.onclick = () => {
    if (confirm("Are you sure you want to clear your entire log?")) {
        trackedFoods = [];
        saveData();
        updateUI();
    }
};

// Local Storage helpers
function saveData() {
    localStorage.setItem('calorieTrackerDataV3', JSON.stringify(trackedFoods));
}

function loadData() {
    const data = localStorage.getItem('calorieTrackerDataV3');
    if (data) {
        trackedFoods = JSON.parse(data);
    }
}

init();
