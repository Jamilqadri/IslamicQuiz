// Variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let userData = {};

// App Initialization
function initApp() {
    // Select 5 random questions
    currentQuestions = getRandomQuestions(5);
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    updateProgress();
    showQuestion();
}

// Get random questions
function getRandomQuestions(count) {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

// Show question
function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showScore();
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    
    // Update question number
    document.getElementById('question-number').textContent = 
        `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    
    document.getElementById('question').textContent = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectOption(button, index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('next-btn').style.display = 'block';
    selectedOption = null;
    updateProgress();
}

// Select option
function selectOption(button, index) {
    // Reset previously selected options
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    button.classList.add('selected');
    selectedOption = index;
}

// Next question
function nextQuestion() {
    if (selectedOption === null) {
        alert('Please select an option');
        return;
    }

    // Calculate score - 20 points per question
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correct) {
        score += 20;
    }

    currentQuestionIndex++;
    showQuestion();
}

// Show score
function showScore() {
    document.getElementById('quiz-section').classList.remove('active');
    document.getElementById('score-section').classList.add('active');
    document.getElementById('score-display').textContent = `${score}/100`;
    
    // Add note box
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box';
    noteBox.innerHTML = `
        <strong>نوٹ:</strong> تمام شرکاء میں سے خوش قسمت فاتحین کا انتخاب کیا جائے گا۔ 
        <strong>Al Kunooz</strong> کی طرف سے فاتحین کو خصوصی انعامات دیے جائیں گے۔
    `;
    
    document.getElementById('score-section').appendChild(noteBox);
}

// Show form
function showForm() {
    document.getElementById('score-section').classList.remove('active');
    document.getElementById('form-section').classList.add('active');
}

// Form submission
document.getElementById('user-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userData = {
        name: document.getElementById('name').value,
        whatsapp: document.getElementById('whatsapp').value,
        address: document.getElementById('address').value,
        score: score,
        timestamp: new Date().toLocaleString('en-IN')
    };
    
    // Save data
    saveToGoogleSheets(userData);
    
    // Show congratulations
    showCongratulations();
});

// Show congratulations
function showCongratulations() {
    document.getElementById('form-section').classList.remove('active');
    document.getElementById('congrats-section').classList.add('active');
    
    let message = "";
    if (score === 100) {
        message = `
            <div style="text-align: center;">
                <h2 style="color: #27ae60;">🎉 Outstanding Performance! 🎉</h2>
                <p style="font-size: 20px; margin: 10px 0;">Dear <strong>${userData.name}</strong></p>
                <div style="font-size: 60px; color: #667eea; margin: 20px 0; font-weight: bold;">${score}/100</div>
                <p style="font-size: 18px; color: #666;">Perfect Score! You have excellent Islamic knowledge! 🏆</p>
                <p style="color: #27ae60; margin-top: 10px;">You will receive a special gift insha'Allah!</p>
            </div>
        `;
    } else if (score >= 80) {
        message = `
            <div style="text-align: center;">
                <h2 style="color: #27ae60;">🎉 Congratulations! 🎉</h2>
                <p style="font-size: 20px; margin: 10px 0;">Dear <strong>${userData.name}</strong></p>
                <div style="font-size: 60px; color: #667eea; margin: 20px 0; font-weight: bold;">${score}/100</div>
                <p style="font-size: 18px; color: #666;">Excellent performance! 💫</p>
                <p style="color: #27ae60; margin-top: 10px;">You qualify for a gift insha'Allah!</p>
            </div>
        `;
    } else if (score >= 60) {
        message = `
            <div style="text-align: center;">
                <h2 style="color: #f39c12;">👍 Well Done! 👍</h2>
                <p style="font-size: 20px; margin: 10px 0;">Dear <strong>${userData.name}</strong></p>
                <div style="font-size: 60px; color: #667eea; margin: 20px 0; font-weight: bold;">${score}/100</div>
                <p style="font-size: 18px; color: #666;">Good performance! Keep learning! 📚</p>
            </div>
        `;
    } else {
        message = `
            <div style="text-align: center;">
                <h2 style="color: #e74c3c;">😊 Thank You for Participating! 😊</h2>
                <p style="font-size: 20px; margin: 10px 0;">Dear <strong>${userData.name}</strong></p>
                <div style="font-size: 60px; color: #667eea; margin: 20px 0; font-weight: bold;">${score}/100</div>
                <p style="font-size: 18px; color: #666;">Keep learning about Islam! 📚</p>
                <p style="color: #e74c3c; margin-top: 10px;">Insha'Allah you will do better next time!</p>
            </div>
        `;
    }
    
    document.getElementById('congrats-message').innerHTML = message;
}

// Share on WhatsApp
function shareOnWhatsApp() {
    let scoreText = "";
    if (score === 100) {
        scoreText = "Perfect Score 🏆";
    } else if (score >= 80) {
        scoreText = "Excellent Score 🌟";
    } else if (score >= 60) {
        scoreText = "Good Score 👍";
    } else {
        scoreText = "Quiz Score 📚";
    }
    
    const text = `🌙 *Islamic Quiz Competition* 🌙

🏆 My Score: ${score}/100
👤 Name: ${userData.name}
📅 Date: ${new Date().toLocaleDateString('en-IN')}

I got ${scoreText} in the Islamic Quiz! Test your knowledge of Islam and participate in this amazing quiz.

🔗 Link: ${window.location.href}

#IslamicQuiz #MuslimQuiz`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Share on Facebook
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// Download as Image
function downloadAsImage() {
    alert('📸 Image download feature will be available soon! For now, you can share your score via WhatsApp or Facebook.');
}

// Save to Google Sheets
function saveToGoogleSheets(data) {
    const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        console.log('Data sent to Google Sheets');
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    console.log('📊 User Data:', data);
}

// Start the app
window.onload = initApp; 
