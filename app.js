// RestWell - Sleep & Caffeine Tracker
// Main Application JavaScript

// Baseline data by age group and gender
const DATA = {
    sleep: {
        '5-13': { male: { avg: 10, min: 9, max: 12 }, female: { avg: 10.2, min: 9, max: 12 } },
        '14-17': { male: { avg: 7.5, min: 8, max: 10 }, female: { avg: 7.3, min: 8, max: 10 } },
        '18-25': { male: { avg: 6.9, min: 7, max: 9 }, female: { avg: 7.2, min: 7, max: 9 } },
        '26-64': { male: { avg: 6.8, min: 7, max: 9 }, female: { avg: 7.0, min: 7, max: 9 } },
        '65+': { male: { avg: 6.5, min: 7, max: 8 }, female: { avg: 6.7, min: 7, max: 8 } }
    },
    caffeine: {
        '5-13': { male: { avg: 25, max: 45 }, female: { avg: 20, max: 45 } },
        '14-17': { male: { avg: 110, max: 100 }, female: { avg: 90, max: 100 } },
        '18-25': { male: { avg: 180, max: 400 }, female: { avg: 150, max: 400 } },
        '26-64': { male: { avg: 220, max: 400 }, female: { avg: 180, max: 400 } },
        '65+': { male: { avg: 200, max: 300 }, female: { avg: 165, max: 300 } }
    }
};

// Helper functions
function getAgeGroup(age) {
    if (age <= 13) return '5-13';
    if (age <= 17) return '14-17';
    if (age <= 25) return '18-25';
    if (age <= 64) return '26-64';
    return '65+';
}

function estimateCaffeine(sleep, age, gender) {
    const ag = getAgeGroup(age);
    const g = (gender === 'male' || gender === 'female') ? gender : 'male';
    const cBase = DATA.caffeine[ag][g];
    const sBase = DATA.sleep[ag][g];
    return Math.max(0, Math.round(cBase.avg + (sBase.avg - sleep) * 35));
}

const sleepTips = [
    "Keep a consistent sleep schedule",
    "Keep bedroom cool and dark",
    "Avoid screens before bed",
    "Limit caffeine after 2 PM",
    "Create a relaxing bedtime routine"
];

const caffeineTips = [
    "Reduce intake gradually by 25% weekly",
    "Switch to half-caff or decaf",
    "Replace afternoon coffee with tea",
    "Stay hydrated with water",
    "Try a power nap instead"
];

function getRandomTips(arr, n) {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

// Chart drawing function
function drawChart(userPoint, avgPoint, zone) {
    const svg = document.getElementById('chart');
    const width = 380, height = 240;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const xMin = 0, xMax = 500, yMin = 4, yMax = 12;

    const scaleX = (v) => margin.left + ((v - xMin) / (xMax - xMin)) * chartWidth;
    const scaleY = (v) => margin.top + ((yMax - v) / (yMax - yMin)) * chartHeight;

    let html = `<rect x="0" y="0" width="${width}" height="${height}" fill="#1e293b" rx="8"/>`;

    // Grid lines
    [0, 100, 200, 300, 400, 500].forEach(v => {
        html += `<line x1="${scaleX(v)}" y1="${margin.top}" x2="${scaleX(v)}" y2="${height - margin.bottom}" stroke="#334155"/>`;
        html += `<text x="${scaleX(v)}" y="${height - margin.bottom + 16}" fill="#94a3b8" font-size="10" text-anchor="middle">${v}</text>`;
    });
    [4, 6, 8, 10, 12].forEach(v => {
        html += `<line x1="${margin.left}" y1="${scaleY(v)}" x2="${width - margin.right}" y2="${scaleY(v)}" stroke="#334155"/>`;
        html += `<text x="${margin.left - 8}" y="${scaleY(v) + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${v}h</text>`;
    });

    // Axis labels
    html += `<text x="${width / 2}" y="${height - 5}" fill="#94a3b8" font-size="11" text-anchor="middle">Caffeine (mg/day)</text>`;
    html += `<text x="14" y="${height / 2}" fill="#94a3b8" font-size="11" text-anchor="middle" transform="rotate(-90, 14, ${height / 2})">Sleep (hours)</text>`;

    // Healthy zone
    if (zone) {
        const zx = scaleX(zone.xMin);
        const zy = scaleY(zone.yMax);
        const zw = scaleX(zone.xMax) - scaleX(zone.xMin);
        const zh = scaleY(zone.yMin) - scaleY(zone.yMax);
        html += `<rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" fill="rgba(52,211,153,0.25)" stroke="rgba(52,211,153,0.8)" stroke-width="2"/>`;
    }

    // Average point (triangle)
    if (avgPoint) {
        const ax = scaleX(avgPoint.caffeine);
        const ay = scaleY(avgPoint.sleep);
        html += `<polygon points="${ax},${ay - 10} ${ax - 8},${ay + 6} ${ax + 8},${ay + 6}" fill="#fbbf24"/>`;
    }

    // User point (circle)
    if (userPoint) {
        const ux = scaleX(userPoint.caffeine);
        const uy = scaleY(userPoint.sleep);
        html += `<circle cx="${ux}" cy="${uy}" r="14" fill="#38bdf8" stroke="#fff" stroke-width="3"/>`;
        html += `<text x="${ux}" y="${uy + 4}" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">YOU</text>`;
    }

    svg.innerHTML = html;
}

// Initialize chart on page load
drawChart(null, null, null);

// Form submission handler
document.getElementById('healthForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const sleep = parseFloat(document.getElementById('sleep').value);
    const caffeineInput = document.getElementById('caffeine').value;

    if (!age || !gender || !sleep) {
        alert('Please fill in age, gender, and sleep hours');
        return;
    }

    const ag = getAgeGroup(age);
    const g = (gender === 'male' || gender === 'female') ? gender : 'male';
    const sData = DATA.sleep[ag][g];
    const cData = DATA.caffeine[ag][g];

    let caffeine, estimated = false;
    if (caffeineInput === '') {
        caffeine = estimateCaffeine(sleep, age, gender);
        estimated = true;
    } else {
        caffeine = parseFloat(caffeineInput);
    }

    // Update chart
    drawChart(
        { caffeine: caffeine, sleep: sleep },
        { caffeine: cData.avg, sleep: sData.avg },
        { xMin: 0, xMax: cData.max, yMin: sData.min, yMax: sData.max }
    );

    // Calculate results
    const sleepDiff = sleep - sData.avg;
    const sleepAbove = sleep >= sData.avg;
    const sleepOk = sleep >= sData.min && sleep <= sData.max;

    const caffDiff = caffeine - cData.avg;
    const caffAbove = caffeine > cData.avg;
    const caffSafe = caffeine <= cData.max;

    // Show results
    document.getElementById('results').classList.add('show');

    // Sleep result
    let sleepBadge, sleepBadgeClass;
    if (sleepOk) { sleepBadge = '✓ IN RANGE'; sleepBadgeClass = 'badge-blue'; }
    else if (sleepAbove) { sleepBadge = '↑ ABOVE AVG'; sleepBadgeClass = 'badge-green'; }
    else { sleepBadge = '↓ BELOW AVG'; sleepBadgeClass = 'badge-red'; }

    document.getElementById('sleepResult').innerHTML = `
        <div class="result-box">
            <div class="result-header">
                <span class="result-title">😴 Sleep</span>
                <span class="badge ${sleepBadgeClass}">${sleepBadge}</span>
            </div>
            <p class="result-text">
                You: <strong>${sleep}h</strong> | Avg: <strong>${sData.avg}h</strong> | 
                <span class="${sleepAbove ? 'text-green' : 'text-red'}">${Math.abs(sleepDiff).toFixed(1)}h ${sleepAbove ? 'above' : 'below'}</span>
            </p>
            ${sleep < sData.min ? `<div class="tips-box">${getRandomTips(sleepTips, 3).map(t => '→ ' + t).join('<br>')}</div>` : ''}
            ${sleepOk ? '<div class="congrats-box">🎉 Great! Your sleep is in the healthy range!</div>' : ''}
        </div>
    `;

    // Caffeine result
    let caffBadge, caffBadgeClass;
    if (!caffAbove) { caffBadge = '↓ BELOW AVG'; caffBadgeClass = 'badge-green'; }
    else if (caffSafe) { caffBadge = '↑ ABOVE AVG'; caffBadgeClass = 'badge-blue'; }
    else { caffBadge = '↑ ABOVE AVG'; caffBadgeClass = 'badge-red'; }

    document.getElementById('caffeineResult').innerHTML = `
        <div class="result-box">
            <div class="result-header">
                <span class="result-title">☕ Caffeine ${estimated ? '<span class="badge badge-yellow">EST</span>' : ''}</span>
                <span class="badge ${caffBadgeClass}">${caffBadge}</span>
            </div>
            <p class="result-text">
                You: <strong>${caffeine}mg</strong> | Avg: <strong>${cData.avg}mg</strong> | 
                <span class="${!caffAbove ? 'text-green' : 'text-blue'}">${Math.abs(caffDiff).toFixed(0)}mg ${caffAbove ? 'above' : 'below'}</span>
            </p>
            ${!caffSafe ? `<div class="tips-box">${getRandomTips(caffeineTips, 3).map(t => '→ ' + t).join('<br>')}</div>` : ''}
            ${caffSafe && !caffAbove ? '<div class="congrats-box">🎉 Excellent! Below average and within safe limits!</div>' : ''}
        </div>
    `;
});

// Chat functionality
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
let chatHistory = [];

function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = 'message ' + (isUser ? 'message-user' : 'message-ai');
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;

    addMessage(msg, true);
    chatInput.value = '';
    sendBtn.disabled = true;
    chatInput.disabled = true;

    chatHistory.push({ role: 'user', content: msg });

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-ai';
    typingDiv.textContent = 'Thinking...';
    typingDiv.id = 'typing';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Call our secure backend API (not Anthropic directly)
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API error');
        }
        
        const aiMsg = data.content[0].text;

        chatHistory.push({ role: 'assistant', content: aiMsg });

        document.getElementById('typing').remove();
        addMessage(aiMsg, false);
    } catch (error) {
        document.getElementById('typing').remove();
        addMessage("Sorry, I couldn't process that. Please try again.", false);
    }

    sendBtn.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});
