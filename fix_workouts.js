const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const analyticsRegex = /<div style="display: flex; gap: 12px; justify-content: space-around;[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const newAnalyticsUI = `
                <div style="display: flex; gap: 12px; justify-content: space-around; background: var(--surface-2); padding: 16px; border-radius: var(--radius); border: 1px solid var(--border); align-items: center; margin-bottom: 16px;">
                    <div style="text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Workouts</div>
                        <div style="font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: var(--text);" id="wa-total-count">0</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Burned</div>
                        <div style="font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: var(--danger);" id="wa-total-cal">0 <span style="font-size: 0.8rem; font-family: 'DM Sans', sans-serif;">kcal</span></div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Distance</div>
                        <div style="font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: var(--blue);" id="wa-total-dist">0 <span style="font-size: 0.8rem; font-family: 'DM Sans', sans-serif;">km</span></div>
                    </div>
                </div>
                <!-- Analytic Charts -->
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">Workouts</div>
                        <div id="wa-chart-count" style="height: 80px; width: 100%;"></div>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">Calories Burned</div>
                        <div id="wa-chart-cal" style="height: 80px; width: 100%;"></div>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">Distance (km)</div>
                        <div id="wa-chart-dist" style="height: 80px; width: 100%;"></div>
                    </div>
                </div>
            </div>`;
html = html.replace(analyticsRegex, newAnalyticsUI);

const historyRegex = /<div class="log-header">\s*<h2>Today's Workouts<\/h2>\s*<div class="log-actions">\s*<div style="font-weight: 600; color: var\(--danger\);">\s*🔥 <span id="burned-calories">0<\/span> kcal burned\s*<\/div>\s*<\/div>\s*<\/div>/;
const newHistoryUI = `<div class="log-header" style="flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <h2>Workout History</h2>
                        <input type="date" id="history-date" onchange="loadWorkoutHistory()" style="padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font-family: 'DM Sans', sans-serif;">
                    </div>
                    <div class="log-actions">
                        <div style="font-weight: 600; color: var(--danger);">
                            🔥 <span id="burned-calories">0</span> kcal burned
                        </div>
                    </div>
                </div>`;
html = html.replace(historyRegex, newHistoryUI);

const oldRenderAnalyticsStr = `    if (endDate >= startDate) {
        let current = new Date(startDate);
        let failsafe = 0;
        while (current <= endDate && failsafe < 365) {
            const dateStr = current.toISOString().slice(0, 10);
            const savedData = localStorage.getItem('czWorkout-' + dateStr);
            if (savedData) {
                const logs = JSON.parse(savedData);
                totalWorkouts += logs.length;
                logs.forEach(w => {
                    totalCals += (w.calBurned || 0);
                    if (w.type === 'cardio') totalDist += (w.dist || 0);
                });
            }
            current.setDate(current.getDate() + 1);
            failsafe++;
        }
    }

    document.getElementById('wa-total-count').textContent = totalWorkouts;
    document.getElementById('wa-total-cal').innerHTML = totalCals + ' <span style="font-size: 0.8rem; font-family: \\'DM Sans\\', sans-serif;">kcal</span>';
    document.getElementById('wa-total-dist').innerHTML = parseFloat(totalDist).toFixed(1) + ' <span style="font-size: 0.8rem; font-family: \\'DM Sans\\', sans-serif;">km</span>';
}`;

const newRenderAnalyticsStr = "    let dailyData = [];\n" +
"    if (endDate >= startDate) {\n" +
"        let current = new Date(startDate);\n" +
"        let failsafe = 0;\n" +
"        while (current <= endDate && failsafe < 365) {\n" +
"            const dateStr = current.toISOString().slice(0, 10);\n" +
"            const savedData = localStorage.getItem('czWorkout-' + dateStr);\n" +
"            let dayCount = 0, dayCal = 0, dayDist = 0;\n" +
"            if (savedData) {\n" +
"                const logs = JSON.parse(savedData);\n" +
"                dayCount = logs.length;\n" +
"                logs.forEach(w => {\n" +
"                    dayCal += (w.calBurned || 0);\n" +
"                    if (w.type === 'cardio') dayDist += (w.dist || 0);\n" +
"                });\n" +
"                totalWorkouts += dayCount;\n" +
"                totalCals += dayCal;\n" +
"                totalDist += dayDist;\n" +
"            }\n" +
"            dailyData.push({ date: dateStr, count: dayCount, cal: dayCal, dist: dayDist });\n" +
"            current.setDate(current.getDate() + 1);\n" +
"            failsafe++;\n" +
"        }\n" +
"    }\n" +
"\n" +
"    document.getElementById('wa-total-count').textContent = totalWorkouts;\n" +
"    document.getElementById('wa-total-cal').innerHTML = totalCals + ' <span style=\"font-size: 0.8rem; font-family: \\'DM Sans\\', sans-serif;\">kcal</span>';\n" +
"    document.getElementById('wa-total-dist').innerHTML = parseFloat(totalDist).toFixed(1) + ' <span style=\"font-size: 0.8rem; font-family: \\'DM Sans\\', sans-serif;\">km</span>';\n" +
"    \n" +
"    // Draw Charts\n" +
"    drawMiniChart('wa-chart-count', dailyData, 'count', 'var(--text)');\n" +
"    drawMiniChart('wa-chart-cal', dailyData, 'cal', 'var(--danger)');\n" +
"    drawMiniChart('wa-chart-dist', dailyData, 'dist', 'var(--blue)');\n" +
"}\n" +
"\n" +
"function drawMiniChart(containerId, data, key, color) {\n" +
"    const container = document.getElementById(containerId);\n" +
"    if (!container) return;\n" +
"    if (data.length === 0) { container.innerHTML = ''; return; }\n" +
"    \n" +
"    // Downsample if too many points (>31)\n" +
"    let displayData = data;\n" +
"    if (data.length > 31) {\n" +
"        displayData = [];\n" +
"        const step = Math.ceil(data.length / 30);\n" +
"        for(let i=0; i<data.length; i+=step) {\n" +
"            const chunk = data.slice(i, i+step);\n" +
"            const sum = chunk.reduce((s, x) => s + x[key], 0);\n" +
"            displayData.push({ date: chunk[0].date, [key]: sum / chunk.length }); // average over chunk\n" +
"        }\n" +
"    }\n" +
"    \n" +
"    const max = Math.max(...displayData.map(d => d[key])) || 1; // avoid /0\n" +
"    const w = container.clientWidth || 300;\n" +
"    const h = 80;\n" +
"    \n" +
"    let html = `<svg width=\"100%\" height=\"${h}\" style=\"overflow:visible;\">`;\n" +
"    const barW = Math.max((w / displayData.length) - 2, 2);\n" +
"    \n" +
"    displayData.forEach((d, i) => {\n" +
"        const pct = d[key] / max;\n" +
"        const barH = Math.max(pct * h, 2); // minimum 2px height for 0 values\n" +
"        const x = i * (w / displayData.length);\n" +
"        const y = h - barH;\n" +
"        const opacity = d[key] > 0 ? 1 : 0.2;\n" +
"        html += `<rect x=\"${x}\" y=\"${y}\" width=\"${barW}\" height=\"${barH}\" fill=\"${color}\" opacity=\"${opacity}\" rx=\"2\">`;\n" +
"        html += `<title>${d.date}: ${d[key].toFixed(1)}</title>`;\n" +
"        html += `</rect>`;\n" +
"    });\n" +
"    html += `</svg>`;\n" +
"    container.innerHTML = html;\n" +
"}";
html = html.replace(oldRenderAnalyticsStr, newRenderAnalyticsStr);

const oldLogStrength = `    workoutLog.push({
        id: Date.now(),
        type: 'strength',
        name, weight, sets, reps, calBurned,
        timeOfDay: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    });
    
    saveWorkout();
    renderWorkout();`;

const newLogStrength = `    // Always log to today
    let todaysLog = [];
    const saved = localStorage.getItem('czWorkout-' + todayKey());
    if (saved) todaysLog = JSON.parse(saved);
    todaysLog.push({
        id: Date.now(),
        type: 'strength',
        name, weight, sets, reps, calBurned,
        timeOfDay: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    });
    localStorage.setItem('czWorkout-' + todayKey(), JSON.stringify(todaysLog));
    
    if (document.getElementById('history-date').value === todayKey()) {
        workoutLog = todaysLog;
        renderWorkout();
    }
    renderWorkoutAnalytics();`;
html = html.replace(oldLogStrength, newLogStrength);

const oldLogCardio = `    workoutLog.push({
        id: Date.now(),
        type: 'cardio',
        name: type, dist, time, calBurned,
        timeOfDay: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    });
    
    saveWorkout();
    renderWorkout();`;

const newLogCardio = `    // Always log to today
    let todaysLog = [];
    const saved = localStorage.getItem('czWorkout-' + todayKey());
    if (saved) todaysLog = JSON.parse(saved);
    todaysLog.push({
        id: Date.now(),
        type: 'cardio',
        name: type, dist, time, calBurned,
        timeOfDay: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    });
    localStorage.setItem('czWorkout-' + todayKey(), JSON.stringify(todaysLog));
    
    if (document.getElementById('history-date').value === todayKey()) {
        workoutLog = todaysLog;
        renderWorkout();
    }
    renderWorkoutAnalytics();`;
html = html.replace(oldLogCardio, newLogCardio);

const oldRemoveWorkout = `function removeWorkout(id) {
    workoutLog = workoutLog.filter(x => x.id !== id);
    saveWorkout();
    renderWorkout();
}`;

const newRemoveWorkout = `function removeWorkout(id) {
    workoutLog = workoutLog.filter(x => x.id !== id);
    const selectedDate = document.getElementById('history-date').value || todayKey();
    localStorage.setItem('czWorkout-' + selectedDate, JSON.stringify(workoutLog));
    renderWorkout();
    renderWorkoutAnalytics();
}`;
html = html.replace(oldRemoveWorkout, newRemoveWorkout);

html = html.replace(`document.getElementById('current-height').value = currentHeight || '';`, `document.getElementById('current-height').value = currentHeight || '';
    if(!document.getElementById('history-date').value) {
        document.getElementById('history-date').value = todayKey();
    }`);

html = html.replace('function removeWorkout', `function loadWorkoutHistory() {
    const selectedDate = document.getElementById('history-date').value || todayKey();
    const saved = localStorage.getItem('czWorkout-' + selectedDate);
    workoutLog = saved ? JSON.parse(saved) : [];
    renderWorkout();
}

function removeWorkout`);

html = html.replace(/function saveWorkout\(\) \{[\s\S]*?\}/, '');

fs.writeFileSync('index.html', html);
console.log('Successfully updated index.html for workout analytics and history');
