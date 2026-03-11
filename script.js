// Food Library Data
const FOODS = [
    { id: 1, name: "Apple", calories: 95 },
    { id: 2, name: "Banana", calories: 105 },
    { id: 3, name: "Chicken Breast (100g)", calories: 165 },
    { id: 4, name: "Egg (Large)", calories: 78 },
    { id: 5, name: "Rice (1 cup, cooked)", calories: 205 },
    { id: 6, name: "Almonds (28g)", calories: 164 },
    { id: 7, name: "Greek Yogurt (170g)", calories: 100 },
    { id: 8, name: "Avocado", calories: 322 },
    { id: 9, name: "Salmon (100g)", calories: 208 },
    { id: 10, name: "Peanut Butter (2 tbsp)", calories: 188 },
    { id: 11, name: "Oatmeal (1 cup, cooked)", calories: 154 },
    { id: 12, name: "Broccoli (1 cup, cooked)", calories: 55 },
    { id: 13, name: "Black Beans (1/2 cup, cooked)", calories: 114 },
    { id: 14, name: "Olive Oil (1 tbsp)", calories: 119 },
    { id: 15, name: "Sweet Potato", calories: 112 },
    { id: 16, name: "Pizza (1 slice)", calories: 285 },
    { id: 17, name: "Burger", calories: 354 },
    { id: 18, name: "Spinach (1 cup)", calories: 7 },
    { id: 19, name: "Whole Wheat Bread (1 slice)", calories: 69 },
    { id: 20, name: "Blueberries (1 cup)", calories: 84 }
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
const customFoodForm = document.getElementById('custom-food-form');

// Initialize
function init() {
    loadData();
    renderFoodLibrary();
    updateUI();
    setupEventListeners();
}

function setupEventListeners() {
    customFoodForm.onsubmit = (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('custom-name');
        const calInput = document.getElementById('custom-calories');
        
        const customFood = {
            name: nameInput.value,
            calories: parseInt(calInput.value)
        };
        
        addFood(customFood);
        
        // Reset form
        nameInput.value = '';
        calInput.value = '';
    };
}

// Render the list of available foods
function renderFoodLibrary() {
    foodListEl.innerHTML = '';
    FOODS.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.innerHTML = `
            <span class="name">${food.name}</span>
            <span class="calories">${food.calories} kcal</span>
        `;
        foodItem.onclick = () => addFood(food);
        foodListEl.appendChild(foodItem);
    });
}

// Add food to the consumption log
function addFood(food) {
    const entry = {
        ...food,
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
    // Update log list
    renderTrackedList();

    // Calculate total calories
    const total = trackedFoods.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesEl.textContent = total;

    // Update progress bar
    const percentage = Math.min((total / DAILY_GOAL) * 100, 100);
    progressBarEl.style.width = `${percentage}%`;
    progressTextEl.textContent = `${Math.round((total / DAILY_GOAL) * 100)}% of daily goal`;

    // Visual feedback for exceeding goal
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
                <span style="font-size: 0.8rem; color: #666; margin-left: 10px;">${item.calories} kcal</span>
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
    localStorage.setItem('calorieTrackerData', JSON.stringify(trackedFoods));
}

function loadData() {
    const data = localStorage.getItem('calorieTrackerData');
    if (data) {
        trackedFoods = JSON.parse(data);
    }
}

// Start the app
init();
