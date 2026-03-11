// Food Library Data with specialized units
const FOODS = [
    { id: 1, name: "Apple", caloriesPerUnit: 52, unit: "100g" },
    { id: 2, name: "Banana", caloriesPerUnit: 89, unit: "100g" },
    { id: 3, name: "Chicken Breast", caloriesPerUnit: 165, unit: "100g" },
    { id: 4, name: "Egg", caloriesPerUnit: 78, unit: "piece", isInteger: true },
    { id: 5, name: "White Rice (Cooked)", caloriesPerUnit: 205, unit: "cup" },
    { id: 6, name: "Almonds", caloriesPerUnit: 164, unit: "28g (1oz)" },
    { id: 7, name: "Greek Yogurt", caloriesPerUnit: 100, unit: "170g container" },
    { id: 8, name: "Avocado", caloriesPerUnit: 160, unit: "100g" },
    { id: 9, name: "Salmon", caloriesPerUnit: 208, unit: "100g" },
    { id: 10, name: "Peanut Butter", caloriesPerUnit: 94, unit: "tablespoon" },
    { id: 11, name: "Oatmeal (Cooked)", caloriesPerUnit: 154, unit: "cup" },
    { id: 12, name: "Broccoli", caloriesPerUnit: 31, unit: "cup" },
    { id: 13, name: "Black Beans", caloriesPerUnit: 114, unit: "1/2 cup" },
    { id: 14, name: "Olive Oil", caloriesPerUnit: 119, unit: "tablespoon" },
    { id: 15, name: "Sweet Potato", caloriesPerUnit: 112, unit: "medium" },
    { id: 16, name: "Pizza", caloriesPerUnit: 285, unit: "slice", isInteger: true },
    { id: 17, name: "Burger", caloriesPerUnit: 354, unit: "unit", isInteger: true },
    { id: 18, name: "Spinach", caloriesPerUnit: 7, unit: "cup" },
    { id: 19, name: "Whole Wheat Bread", caloriesPerUnit: 69, unit: "slice", isInteger: true },
    { id: 20, name: "Blueberries", caloriesPerUnit: 84, unit: "cup" }
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
const smartNameInput = document.getElementById('smart-name');
const smartAmountInput = document.getElementById('smart-grams');
const amountLabel = document.getElementById('amount-label');

// Initialize
function init() {
    loadData();
    renderFoodLibrary();
    populateDatalist();
    updateUI();
    setupEventListeners();
}

function setupEventListeners() {
    // Update unit label when user types/selects food
    smartNameInput.addEventListener('input', (e) => {
        const foodMatch = FOODS.find(f => f.name.toLowerCase() === e.target.value.toLowerCase());
        if (foodMatch) {
            amountLabel.textContent = `Amount (${foodMatch.unit}s):`;
            smartAmountInput.placeholder = `How many ${foodMatch.unit}s?`;
            
            // Set step to 1 for items like eggs, pizza slices, etc.
            if (foodMatch.isInteger) {
                smartAmountInput.step = "1";
                smartAmountInput.min = "1";
                // If current value is decimal, round it
                if (smartAmountInput.value && smartAmountInput.value % 1 !== 0) {
                    smartAmountInput.value = Math.round(smartAmountInput.value);
                }
            } else {
                smartAmountInput.step = "0.1";
                smartAmountInput.min = "0.1";
            }
        } else {
            amountLabel.textContent = `Amount:`;
            smartAmountInput.placeholder = `How much?`;
            smartAmountInput.step = "0.1";
            smartAmountInput.min = "0.1";
        }
    });

    smartAddForm.onsubmit = (e) => {
        e.preventDefault();
        
        const foodName = smartNameInput.value;
        let amount = parseFloat(smartAmountInput.value);
        
        const foodMatch = FOODS.find(f => f.name.toLowerCase() === foodName.toLowerCase());
        
        if (foodMatch) {
            // Ensure integer for specific foods
            if (foodMatch.isInteger) {
                amount = Math.round(amount);
            }

            let totalCals;
            // If unit is 100g, calculation is (cals/100) * amount
            if (foodMatch.unit === "100g") {
                totalCals = Math.round((foodMatch.caloriesPerUnit / 100) * amount);
            } else {
                // Otherwise it's a direct multiplier (cups, slices, pieces)
                totalCals = Math.round(foodMatch.caloriesPerUnit * amount);
            }

            addFood({ 
                name: foodMatch.name, 
                calories: totalCals, 
                amount: amount, 
                unit: foodMatch.unit 
            });
            
            smartAmountInput.value = '';
            smartNameInput.value = '';
            amountLabel.textContent = `Amount:`;
            smartAmountInput.placeholder = `How much?`;
            smartAmountInput.step = "0.1";
            smartAmountInput.min = "0.1";
            smartNameInput.focus();
        } else {
            alert(`Sorry, "${foodName}" is not in our library.`);
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

function renderFoodLibrary() {
    foodListEl.innerHTML = '';
    FOODS.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.innerHTML = `
            <span class="name">${food.name}</span>
            <span class="calories">${food.caloriesPerUnit} <small>kcal/${food.unit}</small></span>
        `;
        foodItem.onclick = () => {
            let amount = parseFloat(libraryWeightInput.value) || 1;
            
            if (food.isInteger) {
                amount = Math.round(amount);
            }

            let totalCals;
            if (food.unit === "100g") {
                totalCals = Math.round((food.caloriesPerUnit / 100) * amount);
            } else {
                totalCals = Math.round(food.caloriesPerUnit * amount);
            }
            addFood({ name: food.name, calories: totalCals, amount: amount, unit: food.unit });
        };
        foodListEl.appendChild(foodItem);
    });
}

function addFood(foodEntry) {
    const entry = {
        ...foodEntry,
        instanceId: Date.now() + Math.random()
    };
    trackedFoods.push(entry);
    saveData();
    updateUI();
}

function removeFood(instanceId) {
    trackedFoods = trackedFoods.filter(item => item.instanceId !== instanceId);
    saveData();
    updateUI();
}

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
                <span style="font-size: 0.8rem; color: #666; margin-left: 10px;">${item.amount} ${item.unit}(s) | ${item.calories} kcal</span>
            </div>
            <button class="remove-btn" onclick="removeFood(${item.instanceId})">&times;</button>
        `;
        trackedListEl.appendChild(trackedItem);
    });
}

clearAllBtn.onclick = () => {
    if (confirm("Are you sure?")) {
        trackedFoods = [];
        saveData();
        updateUI();
    }
};

function saveData() {
    localStorage.setItem('calorieTrackerDataV4', JSON.stringify(trackedFoods));
}

function loadData() {
    const data = localStorage.getItem('calorieTrackerDataV4');
    if (data) {
        trackedFoods = JSON.parse(data);
    }
}

init();
