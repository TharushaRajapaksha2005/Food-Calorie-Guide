const fs = require('fs');

const fwData = {};
const wData = {};

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];
const WORKOUT_TYPES = [
    { type: 'cardio', name: 'Running', dist: 5, time: 30, calBurned: 300 },
    { type: 'cardio', name: 'Walking', dist: 3, time: 45, calBurned: 150 },
    { type: 'cardio', name: 'Cycling', dist: 10, time: 40, calBurned: 250 },
    { type: 'strength', name: 'Bench Press', weight: 60, sets: 3, reps: 10, calBurned: 21 },
    { type: 'strength', name: 'Squats', weight: 80, sets: 4, reps: 8, calBurned: 35 },
    { type: 'strength', name: 'Deadlifts', weight: 100, sets: 3, reps: 5, calBurned: 40 }
];

const FOODS = [
    { id:1, name:"Apple", cal:52, unit:"100g", protein:0.3, carbs:14, fat:0.2 },
    { id:2, name:"Chicken Breast", cal:165, unit:"100g", protein:31, carbs:0, fat:3.6 },
    { id:3, name:"Oatmeal (Cooked)", cal:154, unit:"cup", protein:5, carbs:27, fat:3 },
    { id:4, name:"Pizza", cal:285, unit:"slice", protein:12, carbs:36, fat:10 },
    { id:5, name:"Eggs", cal:78, unit:"piece", protein:6, carbs:0.6, fat:5 },
    { id:6, name:"Salmon", cal:208, unit:"100g", protein:20, carbs:0, fat:13 },
    { id:7, name:"White Rice (Cooked)", cal:130, unit:"100g", protein:2.7, carbs:28, fat:0.3 },
    { id:8, name:"Greek Yogurt", cal:100, unit:"170g", protein:17, carbs:6, fat:0.7 },
    { id:9, name:"Broccoli", cal:31, unit:"cup", protein:2.6, carbs:6, fat:0.3 },
    { id:10, name:"Almonds", cal:164, unit:"28g", protein:6, carbs:6, fat:14 }
];

let idCounter = 1;

for (let offset = 0; offset < 60; offset++) {
    const numFoods = Math.floor(Math.random() * 4) + 2;
    const dayFoods = [];
    for (let j = 0; j < numFoods; j++) {
        const foodTemplate = FOODS[Math.floor(Math.random() * FOODS.length)];
        const amount = foodTemplate.unit === '100g' ? (Math.floor(Math.random() * 3) + 1) * 100 : Math.floor(Math.random() * 3) + 1;
        const multiplier = foodTemplate.unit === '100g' ? amount / 100 : amount;
        
        dayFoods.push({
            id: idCounter++,
            name: foodTemplate.name,
            cal: Math.round(foodTemplate.cal * multiplier),
            amount: amount,
            unit: foodTemplate.unit,
            meal: MEALS[Math.floor(Math.random() * MEALS.length)],
            protein: +(foodTemplate.protein * multiplier).toFixed(1),
            carbs: +(foodTemplate.carbs * multiplier).toFixed(1),
            fat: +(foodTemplate.fat * multiplier).toFixed(1),
            time: "12:00 PM"
        });
    }
    fwData[offset] = {
        food: dayFoods,
        water: Math.floor(Math.random() * 5) + 4
    };

    if (Math.random() > 0.4) {
        const numWorkouts = Math.floor(Math.random() * 2) + 1;
        const dayWorkouts = [];
        for (let j = 0; j < numWorkouts; j++) {
            const workoutTemplate = WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)];
            dayWorkouts.push({
                id: idCounter++,
                ...workoutTemplate,
                timeOfDay: "05:00 PM"
            });
        }
        wData[offset] = dayWorkouts;
    } else {
        wData[offset] = [];
    }
}

fs.writeFileSync('/home/vanquish/Downloads/UCSC/Food-Calorie-Guide/test_food_water.json', JSON.stringify(fwData, null, 2));
fs.writeFileSync('/home/vanquish/Downloads/UCSC/Food-Calorie-Guide/test_workouts.json', JSON.stringify(wData, null, 2));
