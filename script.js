// Food Library Data with specialized units
const FOODS = [
    { id: 1, name: "Apple", caloriesPerUnit: 52, unit: "100g" },
    { id: 2, name: "Banana", caloriesPerUnit: 89, unit: "100g" },
    { id: 3, name: "Chicken Breast", caloriesPerUnit: 165, unit: "100g" },
    { id: 4, name: "Egg", caloriesPerUnit: 78, unit: "piece", isInteger: true },
    { id: 5, name: "White Rice (Cooked)", caloriesPerUnit: 130, unit: "100g" },
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
    { id: 20, name: "Blueberries", caloriesPerUnit: 84, unit: "cup" },
    // Sri Lankan Foods
    { id: 21, name: "Red Rice (Cooked)", caloriesPerUnit: 138, unit: "100g" },
    { id: 22, name: "Pol Roti", caloriesPerUnit: 175, unit: "piece", isInteger: true },
    { id: 23, name: "Hopper (Plain)", caloriesPerUnit: 95, unit: "piece", isInteger: true },
    { id: 24, name: "Egg Hopper", caloriesPerUnit: 170, unit: "piece", isInteger: true },
    { id: 25, name: "String Hopper", caloriesPerUnit: 45, unit: "piece", isInteger: true },
    { id: 26, name: "Dhal Curry (Parippu)", caloriesPerUnit: 150, unit: "cup" },
    { id: 27, name: "Pol Sambol", caloriesPerUnit: 85, unit: "tablespoon" },
    { id: 28, name: "Kottu Roti (Chicken)", caloriesPerUnit: 230, unit: "100g" },
    { id: 29, name: "Fish Ambul Thiyal", caloriesPerUnit: 140, unit: "100g" },
    { id: 30, name: "Chicken Curry (Sri Lankan)", caloriesPerUnit: 220, unit: "100g" },
    { id: 31, name: "Parippu Vada", caloriesPerUnit: 120, unit: "piece", isInteger: true },
    { id: 32, name: "Milk Rice (Kiribath)", caloriesPerUnit: 250, unit: "piece", isInteger: true },
    { id: 33, name: "Watalappam", caloriesPerUnit: 280, unit: "100g" },
    { id: 34, name: "Woodapple Juice", caloriesPerUnit: 140, unit: "glass" },
    { id: 35, name: "Manioc (Boiled)", caloriesPerUnit: 160, unit: "100g" }
];

let DAILY_GOAL = 2000;

// State
let trackedFoods = [];

// DOM Elements
const foodListEl = document.getElementById('food-list');
const trackedListEl = document.getElementById('tracked-list');
const totalCaloriesEl = document.getElementById('total-calories');
const progressBarEl = document.getElementById('progress-bar');
const progressTextEl = document.getElementById('progress-text');
const goalValueEl = document.getElementById('goal-value');
const clearAllBtn = document.getElementById('clear-all');
const smartAddForm = document.getElementById('smart-add-form');
const foodDatalist = document.getElementById('food-options');
const smartNameInput = document.getElementById('smart-name');
const smartAmountInput = document.getElementById('smart-grams');
const amountLabel = document.getElementById('amount-label');
const setupModal = document.getElementById('setup-modal');
const goalWarningEl = document.getElementById('goal-warning');
const changeProfileBtn = document.getElementById('change-profile-btn');
const calculatorForm = document.getElementById('calculator-form');
const themeToggleBtn = document.getElementById('theme-toggle');

// Initialize
function init() {
    initTheme();
    loadData();
    checkProfile();
    renderFoodLibrary();
    populateDatalist();
    updateUI();
    setupEventListeners();
}

function initTheme() {
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        savedTheme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function checkProfile() {
    const savedGoal = localStorage.getItem('calorieTrackerGoal');
    if (!savedGoal) {
        setupModal.classList.add('show');
    } else {
        DAILY_GOAL = parseInt(savedGoal);
    }
}

function setupEventListeners() {
    // Theme Toggle
    themeToggleBtn.onclick = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Calculator Submission
    calculatorForm.onsubmit = (e) => {
        e.preventDefault();

        const gender = document.querySelector('input[name="gender"]:checked').value;
        const age = parseInt(document.getElementById('calc-age').value);
        const weight = parseFloat(document.getElementById('calc-weight').value);
        const height = parseFloat(document.getElementById('calc-height').value);
        const activity = parseFloat(document.getElementById('calc-activity').value);

        // Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        const calculatedGoal = Math.round(bmr * activity);

        DAILY_GOAL = calculatedGoal;
        localStorage.setItem('calorieTrackerGoal', calculatedGoal);
        localStorage.setItem('userProfile', JSON.stringify({ gender, age, weight, height, activity }));

        setupModal.classList.remove('show');
        updateUI();
    };

    changeProfileBtn.onclick = () => {
        setupModal.classList.add('show');

        // Pre-fill form if profile exists
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (profile.age) {
            document.getElementById('calc-age').value = profile.age;
            document.getElementById('calc-weight').value = profile.weight;
            document.getElementById('calc-height').value = profile.height;
            document.getElementById('calc-activity').value = profile.activity;
            document.querySelector(`input[name="gender"][value="${profile.gender}"]`).checked = true;
        }
    };

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
            // Default to 100 for 100g units, or 1 for others
            let amount = food.unit === "100g" ? 100 : 1;

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
    goalValueEl.textContent = `${DAILY_GOAL} kcal`;

    const percentage = Math.min((total / DAILY_GOAL) * 100, 100);
    progressBarEl.style.width = `${percentage}%`;
    progressTextEl.textContent = `${Math.round((total / DAILY_GOAL) * 100)}% of daily goal`;

    if (total > DAILY_GOAL) {
        totalCaloriesEl.style.color = 'var(--danger)';
        progressBarEl.style.background = 'var(--danger)';
        goalWarningEl.style.display = 'block';
    } else {
        totalCaloriesEl.style.color = 'var(--primary)';
        progressBarEl.style.background = 'linear-gradient(90deg, var(--primary-light), var(--primary))';
        goalWarningEl.style.display = 'none';
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
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 10px;">${item.amount} ${item.unit}(s) | ${item.calories} kcal</span>
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
