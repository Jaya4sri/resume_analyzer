const fileInput = document.getElementById('resumeInput');
const fileDisplay = document.getElementById('fileDisplay');
const analyzeBtn = document.getElementById('analyzeBtn');
const reportText = document.getElementById('reportText');
const resultSection = document.getElementById('result');
const scoreSection = document.getElementById('scoreSection');
const scoreChartCanvas = document.getElementById('scoreChart');

fileInput.addEventListener('change', () => {
    if (fileInput.files.length === 0) {
        fileDisplay.classList.add('hidden');
        fileDisplay.textContent = '';
        return;
    }
    const file = fileInput.files[0];
    fileDisplay.textContent = `Selected File: ${file.name}`;
    fileDisplay.classList.remove('hidden');
});

analyzeBtn.addEventListener('click', () => {
    if (fileInput.files.length === 0) {
        alert('Please upload your resume!');
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result.trim();
        if (text === '') {
            alert('Error reading file. Please re-upload.');
            return;
        }
        const score = calculateResumeScore(text);
        displayReport(score);

        const advancedScores = analyzeResumeAdvanced(text);
        displayScoreChart(advancedScores);
    };

    reader.readAsText(file);
});

function calculateResumeScore(text) {
    const wordCount = text.split(/\s+/).length;
    let score = 0;
    if (wordCount < 100) {
        score = 40;
    } else if (wordCount < 200) {
        score = 60;
    } else if (wordCount < 400) {
        score = 80;
    } else {
        score = 90 + Math.min(10, Math.floor((wordCount - 400) / 50));
    }
    if (score > 100) score = 100;
    return score;
}

function displayReport(score) {
    reportText.textContent = `Resume Score: ${score}/100`;
    resultSection.classList.remove('hidden');
}

function analyzeResumeAdvanced(text) {
    const lowerText = text.toLowerCase();
    let quantifiedImpact = lowerText.includes('%') || lowerText.includes('reduced') || lowerText.includes('increased') ? 15 : 7;
    let leadership = lowerText.includes('lead') || lowerText.includes('managed') ? 15 : 8;
    let lengthAndDepth = text.split(/\s+/).length > 250 ? 16 : 10;
    let drive = lowerText.includes('project') || lowerText.includes('volunteer') || lowerText.includes('initiative') ? 15 : 8;
    let communication = lowerText.includes('summary') || lowerText.includes('report') || lowerText.includes('presentation') ? 15 : 8;

    return { quantifiedImpact, leadership, lengthAndDepth, drive, communication };
}

function displayScoreChart(scores) {
    const total = scores.quantifiedImpact + scores.leadership + scores.lengthAndDepth + scores.drive + scores.communication;
    const ctx = scoreChartCanvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Impact', 'Leadership', 'Depth', 'Drive', 'Communication'],
            datasets: [{
                data: [
                    scores.quantifiedImpact,
                    scores.leadership,
                    scores.lengthAndDepth,
                    scores.drive,
                    scores.communication
                ],
                backgroundColor: ['#3498db', '#e67e22', '#2ecc71', '#9b59b6', '#f1c40f'],
                borderWidth: 1
            }]
        },
        options: {
            cutout: '60%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    scoreSection.classList.remove('hidden');
}
