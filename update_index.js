const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. CSS adjustments for tabs
const cssAddition = `
        /* ── WORKOUT & TABS ── */
        .main-content-tab {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        .main-content-tab > * {
            animation: fadeInUp 0.6s ease-out backwards;
        }
        .main-content-tab > *:nth-child(1) { animation-delay: 0.05s; }
        .main-content-tab > *:nth-child(2) { animation-delay: 0.1s; }
        .main-content-tab > *:nth-child(3) { animation-delay: 0.15s; }
        .main-content-tab > *:nth-child(4) { animation-delay: 0.2s; }
        .main-content-tab > *:nth-child(5) { animation-delay: 0.25s; }
`;
html = html.replace('.main-content > * {', cssAddition + '\n        .main-content > * {'); // just to append safely

// 2. Sidebar Navigation adjustments
const newSidebarNav = `
        <div class="sidebar-nav">
            <button class="nav-btn active" id="btn-dashboard" onclick="switchTab('dashboard')">
                <span class="nav-icon">📊</span> Dashboard
            </button>
            <button class="nav-btn" id="btn-workout" onclick="switchTab('workout')">
                <span class="nav-icon">🏋️</span> Workout
            </button>
            <button class="nav-btn" id="btn-profile" onclick="openProfileModal()">
                <span class="nav-icon">⚙️</span> Edit Profile
            </button>
            <button class="nav-btn" id="btn-theme" onclick="toggleTheme()">
                <span class="nav-icon" id="theme-icon">🌙</span> <span id="theme-label">Dark Mode</span>
            </button>
        </div>
`;
html = html.replace(/<div class="sidebar-nav">[\s\S]*?<\/div>/, newSidebarNav);

// 3. Main Content Wrapper
// Find <main class="main-content">
// We need to wrap existing children in <div id="dashboard-section" class="main-content-tab">
html = html.replace('<main class="main-content">', '<main class="main-content">\n        <div id="dashboard-section" class="main-content-tab">');
// Close the wrapper before </main> and add Workout section
const workoutSectionHTML = `
        </div> <!-- End dashboard-section -->

        <div id="workout-section" class="main-content-tab" style="display: none;">
            <div class="section-title">Workout Progress</div>

            <!-- Weight & Height Tracker -->
            <div class="quick-add-card">
                <h2>Body Metrics</h2>
                <div class="add-form-row">
                    <div class="form-field">
                        <label>Weight (kg)</label>
                        <input type="number" id="current-weight" step="0.1">
                    </div>
                    <div class="form-field">
                        <label>Height (cm)</label>
                        <input type="number" id="current-height">
                    </div>
                    <button class="add-btn-primary" onclick="logBodyMetrics()">Save</button>
                </div>
                <div style="margin-top: 16px;">
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <button class="cat-tab active" onclick="setWeightFilter('week', this)">Week</button>
                        <button class="cat-tab" onclick="setWeightFilter('month', this)">Month</button>
                        <button class="cat-tab" onclick="setWeightFilter('year', this)">Year</button>
                    </div>
                    <div class="bar-chart" id="weight-chart" style="height: 120px; align-items: flex-end;"></div>
                </div>
            </div>

            <!-- Log Strength -->
            <div class="quick-add-card">
                <h2>Log Strength Training</h2>
                <div class="add-form-row">
                    <div class="form-field grow">
                        <label>Exercise</label>
                        <input type="text" id="strength-name" placeholder="e.g. Bench Press">
                    </div>
                    <div class="form-field" style="width: 80px;">
                        <label>Weight</label>
                        <input type="number" id="strength-weight" placeholder="kg">
                    </div>
                    <div class="form-field" style="width: 80px;">
                        <label>Sets</label>
                        <input type="number" id="strength-sets" placeholder="0">
                    </div>
                    <div class="form-field" style="width: 80px;">
                        <label>Reps</label>
                        <input type="number" id="strength-reps" placeholder="0">
                    </div>
                    <button class="add-btn-primary" onclick="logStrength()">+ Log</button>
                </div>
            </div>

            <!-- Log Cardio -->
            <div class="quick-add-card">
                <h2>Log Cardio</h2>
                <div class="add-form-row">
                    <div class="form-field grow">
                        <label>Type</label>
                        <select id="cardio-type">
                            <option value="Walking">Walking</option>
                            <option value="Running">Running</option>
                            <option value="Sprinting">Sprinting</option>
                        </select>
                    </div>
                    <div class="form-field" style="width: 120px;">
                        <label>Distance (km)</label>
                        <input type="number" id="cardio-dist" step="0.1" placeholder="0">
                    </div>
                    <div class="form-field" style="width: 120px;">
                        <label>Duration (min)</label>
                        <input type="number" id="cardio-time" placeholder="0">
                    </div>
                    <button class="add-btn-primary" onclick="logCardio()">+ Log</button>
                </div>
            </div>

            <!-- Workout Log -->
            <div class="log-card">
                <div class="log-header">
                    <h2>Today's Workouts</h2>
                    <div class="log-actions">
                        <div style="font-weight: 600; color: var(--danger);">
                            🔥 <span id="burned-calories">0</span> kcal burned
                        </div>
                    </div>
                </div>
                <div id="workout-log-list"></div>
            </div>
`;
html = html.replace('</main>', workoutSectionHTML + '\n    </main>');

// 4. State Additions
const stateAdditions = `
let workoutLog = []; 
let weightHistory = []; 
let currentWeight = 70;
let currentHeight = 170;
`;
html = html.replace('let water = 0;', 'let water = 0;\n' + stateAdditions);

// 5. Load/Save additions
html = html.replace('function loadAll() {', `function loadAll() {
    const savedWorkout = localStorage.getItem('czWorkout-' + todayKey());
    if (savedWorkout) workoutLog = JSON.parse(savedWorkout);
    
    const savedWeightHist = localStorage.getItem('czWeightHist');
    if (savedWeightHist) weightHistory = JSON.parse(savedWeightHist);
    
    const p = JSON.parse(localStorage.getItem('calProfile') || '{}');
    if (p.weight) currentWeight = p.weight;
    if (p.height) currentHeight = p.height;
`);

html = html.replace('function init() {', `function init() {`);

// 6. JS functions
const jsFunctions = `
// ─── WORKOUT LOGIC ───
function switchTab(tab) {
    document.getElementById('dashboard-section').style.display = tab === 'dashboard' ? 'flex' : 'none';
    document.getElementById('workout-section').style.display = tab === 'workout' ? 'flex' : 'none';
    
    document.getElementById('btn-dashboard').classList.toggle('active', tab === 'dashboard');
    document.getElementById('btn-workout').classList.toggle('active', tab === 'workout');
}

function logBodyMetrics() {
    const w = parseFloat(document.getElementById('current-weight').value);
    const h = parseFloat(document.getElementById('current-height').value);
    if (!w || !h) { showToast('⚠️ Enter weight and height'); return; }
    currentWeight = w;
    currentHeight = h;
    
    const p = JSON.parse(localStorage.getItem('calProfile') || '{}');
    p.weight = w;
    p.height = h;
    localStorage.setItem('calProfile', JSON.stringify(p));
    
    const d = new Date().toISOString().slice(0,10);
    const existing = weightHistory.find(x => x.date === d);
    if (existing) existing.weight = w;
    else weightHistory.push({ date: d, weight: w });
    
    localStorage.setItem('czWeightHist', JSON.stringify(weightHistory));
    
    showToast('✅ Body metrics saved');
    renderWeightChart();
}

function logStrength() {
    const name = document.getElementById('strength-name').value || 'Strength Training';
    const weight = parseFloat(document.getElementById('strength-weight').value) || 0;
    const sets = parseInt(document.getElementById('strength-sets').value) || 0;
    const reps = parseInt(document.getElementById('strength-reps').value) || 0;
    
    if (!sets || !reps) { showToast('⚠️ Enter sets and reps'); return; }
    
    const calBurned = Math.round(sets * reps * 0.5 + weight * 0.1);
    
    workoutLog.push({
        id: Date.now(),
        type: 'strength',
        name, weight, sets, reps, calBurned,
        timeOfDay: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    });
    
    saveWorkout();
    renderWorkout();
    
    document.getElementById('strength-name').value = '';
    document.getElementById('strength-weight').value = '';
    document.getElementById('strength-sets').value = '';
    document.getElementById('strength-reps').value = '';
    showToast(\`✅ Logged \${name} (\${calBurned} kcal burned)\`);
}

function logCardio() {
    const type = document.getElementById('cardio-type').value;
    const dist = parseFloat(document.getElementById('cardio-dist').value) || 0;
    const time = parseFloat(document.getElementById('cardio-time').value) || 0;
    
    if (!dist && !time) { showToast('⚠️ Enter distance or duration'); return; }
    
    let multiplier = 0.75;
    if (type === 'Running') multiplier = 1.03;
    if (type === 'Sprinting') multiplier = 1.2;
    
    let calBurned = 0;
    if (dist) {
        calBurned = Math.round(dist * currentWeight * multiplier);
    } else {
        let speed = type === 'Walking' ? 5 : (type === 'Running' ? 10 : 15);
        let estDist = (time / 60) * speed;
        calBurned = Math.round(estDist * currentWeight * multiplier);
    }
    
    workoutLog.push({
        id: Date.now(),
        type: 'cardio',
        name: type, dist, time, calBurned,
        timeOfDay: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    });
    
    saveWorkout();
    renderWorkout();
    
    document.getElementById('cardio-dist').value = '';
    document.getElementById('cardio-time').value = '';
    showToast(\`✅ Logged \${type} (\${calBurned} kcal burned)\`);
}

function removeWorkout(id) {
    workoutLog = workoutLog.filter(x => x.id !== id);
    saveWorkout();
    renderWorkout();
}

function saveWorkout() {
    localStorage.setItem('czWorkout-' + todayKey(), JSON.stringify(workoutLog));
}

function renderWorkout() {
    const list = document.getElementById('workout-log-list');
    if (!workoutLog.length) {
        list.innerHTML = \`<div class="log-empty"><span class="log-empty-icon">💪</span><p>No workouts logged today.</p></div>\`;
        document.getElementById('burned-calories').textContent = '0';
        return;
    }
    
    let totalBurned = 0;
    let html = \`<div class="log-row header-row">
        <div>Workout</div>
        <div>Details</div>
        <div>Burned</div>
        <div></div>
    </div>\`;
    
    workoutLog.forEach(w => {
        totalBurned += w.calBurned;
        
        let details = w.type === 'strength' 
            ? \`\${w.weight ? w.weight+'kg • ' : ''}\${w.sets} sets × \${w.reps} reps\`
            : \`\${w.dist ? w.dist+' km' : ''}\${w.dist && w.time ? ' • ' : ''}\${w.time ? w.time+' min' : ''}\`;
            
        html += \`<div class="log-row">
            <div>
                <div class="log-food-name">\${w.name}</div>
                <div class="log-food-amount">\${w.timeOfDay || ''}</div>
            </div>
            <div class="log-food-amount">\${details}</div>
            <div><span class="log-cal-badge" style="background:var(--danger-bg); color:var(--danger);">\${w.calBurned} kcal</span></div>
            <div>
                <button class="remove-log-btn" onclick="removeWorkout(\${w.id})">✕</button>
            </div>
        </div>\`;
    });
    
    list.innerHTML = html;
    document.getElementById('burned-calories').textContent = totalBurned;
}

let activeWeightFilter = 'week';
function setWeightFilter(filter, el) {
    activeWeightFilter = filter;
    el.parentElement.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderWeightChart();
}

function renderWeightChart() {
    const chart = document.getElementById('weight-chart');
    if (!weightHistory.length) {
        chart.innerHTML = \`<div style="text-align:center; width:100%; font-size:0.8rem; color:var(--text-muted); margin-top:20px;">No weight history yet.</div>\`;
        return;
    }
    
    let n = 7;
    if (activeWeightFilter === 'month') n = 30;
    if (activeWeightFilter === 'year') n = 365;
    
    // Get latest entries up to N
    const data = weightHistory.slice(-n);
    if (data.length === 0) return;
    
    const max = Math.max(...data.map(d => d.weight)) + 5;
    const min = Math.max(0, Math.min(...data.map(d => d.weight)) - 5);
    
    // Limit bars to display for year view to avoid overcrowding
    let displayData = data;
    if (n === 365 && data.length > 12) {
        // Just mock taking a few evenly spaced items
        displayData = data.filter((_, i) => i % Math.ceil(data.length / 12) === 0);
    } else if (n === 30 && data.length > 15) {
        displayData = data.filter((_, i) => i % 2 === 0);
    }
    
    chart.innerHTML = displayData.map(d => {
        const pct = Math.min(((d.weight - min) / (max - min)) * 100, 100);
        const dateObj = new Date(d.date);
        const dayLabel = n === 7 ? dateObj.toLocaleDateString('en-US', {weekday:'short'}) 
                       : dateObj.toLocaleDateString('en-US', {month:'short', day:'numeric'});
        return \`
            <div class="bar-col">
                <div class="bar-fill-wrap" style="height:100px;">
                    <div class="bar-fill today" style="height:\${pct}%; background:var(--blue);"></div>
                </div>
                <span class="bar-day">\${dayLabel}</span>
                <span class="bar-day" style="color:var(--text); font-weight:600;">\${d.weight}</span>
            </div>\`;
    }).join('');
}

// Ensure init renders workout stuff
`;

html = html.replace('// ─── TOAST ───', jsFunctions + '\n// ─── TOAST ───');

html = html.replace('function renderAll() {', `function renderAll() {
    renderWorkout();
    renderWeightChart();
    document.getElementById('current-weight').value = currentWeight || '';
    document.getElementById('current-height').value = currentHeight || '';
`);

fs.writeFileSync('index.html', html);
console.log('Successfully updated index.html');
