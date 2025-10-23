// Variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let userData = {};

// App Initialization
function initApp() {
    currentQuestions = getRandomQuestions(5);
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    updateProgress();
    showQuestion();
}

function getRandomQuestions(count) {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showScore();
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('question-number').textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
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
    
    selectedOption = null;
    updateProgress();
}

function selectOption(button, index) {
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    button.classList.add('selected');
    selectedOption = index;
}

function nextQuestion() {
    if (selectedOption === null) {
        alert('Please select an option');
        return;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correct) {
        score += 20;
    }

    currentQuestionIndex++;
    showQuestion();
}

function showScore() {
    document.getElementById('quiz-section').classList.remove('active');
    document.getElementById('score-section').classList.add('active');
    document.getElementById('score-display').textContent = `${score}/100`;
}

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
    
    saveToGoogleSheets(userData);
    showCongratulations();
});

function showCongratulations() {
    document.getElementById('form-section').classList.remove('active');
    document.getElementById('congrats-section').classList.add('active');
    
    let message = "";
    if (score === 100) {
        message = `
            <div style="text-align: center;">
                <h2 style="color: #27ae60;">🎉 Outstanding Performance! 🎉</h2>
                <p style="font-size: 20px; margin: 10px 0;">Congratulations <strong>${userData.name}</strong>!</p>
                <div style="font-size: 60px; color: #667eea; margin: 20px 0; font-weight: bold;">${score}/100</div>
                <p style="font-size: 18px; color: #666;">Perfect Score! You have excellent Islamic knowledge! 🏆</p>
                <p style="color: #27ae60; margin-top: 10px;">You will receive a special gift insha'Allah!</p>
                <p style="font-size: 16px; color: #666; margin-top: 15px;">Challenge your friends to beat your score! 💪</p>
            </div>
        `;
    } else if (score >= 80) {
        message = `
            <div style="text-align: center;">
                <h2 style="color: #27ae60;">🎉 Congratulations! 🎉</h2>
                <p style="font-size: 20px; margin: 10px 0;">Well done <strong>${userData.name}</strong>!</p>
                <div style="font-size: 60px; color: #667eea; margin: 20px 0; font-weight: bold;">${score}/100</div>
                <p style="font-size: 18px; color: #666;">Excellent performance! 💫</p>
                <p style="color: #27ae60; margin-top: 10px;">You qualify for a gift insha'Allah!</p>
                <p style="font-size: 16px; color: #666; margin-top: 15px;">Can your friends beat your score? Challenge them! 🔥</p>
            </div>
        `;
    } else if (score >= 60) {
        message = `
            <div style="text-align: center;">
                <h2 style="color: #f39c12;">👍 Well Done! 👍</h2>
                <p style="font-size: 20px; margin: 10px 0;">Good job <strong>${userData.name}</strong>!</p>
                <div style="font-size: 60px; color: #667eea; margin: 20px 0; font-weight: bold;">${score}/100</div>
                <p style="font-size: 18px; color: #666;">Good performance! Keep learning! 📚</p>
                <p style="font-size: 16px; color: #666; margin-top: 15px;">Challenge your friends and improve together! 🚀</p>
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
                <p style="font-size: 16px; color: #666; margin-top: 15px;">Don't give up! Challenge your friends and try again! 💪</p>
            </div>
        `;
    }
    
    document.getElementById('congrats-message').innerHTML = message;
}

// Share Template Functions
function showShareTemplate() {
    document.getElementById('congrats-section').classList.remove('active');
    document.getElementById('share-template-section').classList.add('active');
    
    document.getElementById('template-score').textContent = `${score}/100`;
    document.getElementById('template-name').textContent = userData.name;
    
    let message = "";
    let badge = "🏆";
    
    if (score === 100) {
        message = "Outstanding Performance! Perfect Score!";
        badge = "🏆";
    } else if (score >= 80) {
        message = "Excellent Work! Great Score!";
        badge = "🌟";
    } else if (score >= 60) {
        message = "Well Done! Good Score!";
        badge = "👍";
    } else {
        message = "Thanks for Participating!";
        badge = "📚";
    }
    
    document.getElementById('template-message').textContent = message;
    document.getElementById('template-badge').textContent = badge;
}

function downloadTemplateAsImage() {
    showNotification('🔄 Creating your image...');
    
    const shareTemplate = document.getElementById('share-template');
    
    html2canvas(shareTemplate, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `islamic-quiz-${userData.name}-${score}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('✅ Image downloaded successfully!');
    }).catch(error => {
        showNotification('❌ Failed to download image. Please try again.');
    });
}

function shareTemplateOnWhatsApp() {
    const currentURL = window.location.href;
    
    let challengeText = "";
    if (score === 100) {
        challengeText = "I got a PERFECT SCORE! Can you beat me? 🏆";
    } else if (score >= 80) {
        challengeText = "I got an excellent score! Think you can do better? 💪";
    } else {
        challengeText = "I took the Islamic Quiz! Can you beat my score? 🔥";
    }
    
    const text = `🌙 *Islamic Quiz Challenge* 🌙

${challengeText}

🏆 My Score: ${score}/100
👤 Name: ${userData.name}

I challenge you to test your Islamic knowledge! 
Can you beat my score? 

🔗 Take the quiz here: ${currentURL}

#IslamicQuiz #ChallengeAccepted #AlKunooz`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareOnWhatsApp() {
    const currentURL = window.location.href;
    
    let challengeText = "";
    if (score === 100) {
        challengeText = "I got a PERFECT SCORE! Can you beat me? 🏆";
    } else if (score >= 80) {
        challengeText = "I got an excellent score! Think you can do better? 💪";
    } else {
        challengeText = "I took the Islamic Quiz! Can you beat my score? 🔥";
    }
    
    const text = `🌙 *Islamic Quiz Challenge* 🌙

${challengeText}

🏆 My Score: ${score}/100
👤 Name: ${userData.name}

I challenge you to test your Islamic knowledge! 
Can you beat my score? 

🔗 Take the quiz here: ${currentURL}

#IslamicQuiz #ChallengeAccepted #AlKunooz`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("I took the Islamic Quiz Challenge! Can you beat my score? 🏆");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function backToCongratulations() {
    document.getElementById('share-template-section').classList.remove('active');
    document.getElementById('congrats-section').classList.add('active');
}

function showNotification(message) {
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #667eea;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        font-size: 16px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

function saveToGoogleSheets(data) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwssBD8NJroqoieQlKqi-6-16r4CLoZ3Eetx_0IYXvlurZd5NTuVT0PTgM1oFDHSh0XFg/exec';

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        console.log('✅ Data sent to Google Sheets');
    })
    .catch(error => {
        console.error('❌ Error:', error);
    });
}

// Start the app
window.onload = initApp;
