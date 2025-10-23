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
    
    // Save data to Google Sheets
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

// Show share template
function showShareTemplate() {
    document.getElementById('congrats-section').classList.remove('active');
    document.getElementById('share-template-section').classList.add('active');
    
    // Update template with user data
    document.getElementById('template-score').textContent = `${score}/100`;
    document.getElementById('template-name').textContent = userData.name;
    
    // Set achievement message based on score
    let message = "";
    let badge = "🏆";
    
    if (score === 100) {
        message = "ماشاءاللہ! کامل اسکور!";
        badge = "🏆";
    } else if (score >= 80) {
        message = "شاندار کارکردگی!";
        badge = "🌟";
    } else if (score >= 60) {
        message = "بہت خوب!";
        badge = "👍";
    } else {
        message = "شکریہ شرکت کا!";
        badge = "📚";
    }
    
    document.getElementById('template-message').textContent = message;
    document.getElementById('template-badge').textContent = badge;
    
    // Set website URL
    document.getElementById('template-website').textContent = "alkunooz.com";
}

// Download template as image
function downloadTemplateAsImage() {
    showNotification('🔄 تصویر تیار ہو رہی ہے...');
    
    const shareTemplate = document.getElementById('share-template');
    
    html2canvas(shareTemplate, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0
    }).then(canvas => {
        // Create download link
        const link = document.createElement('a');
        link.download = `islamic-quiz-${userData.name}-${score}.png`;
        link.href = canvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('✅ تصویر ڈاؤنلوڈ ہو گئی!');
    }).catch(error => {
        console.error('Error:', error);
        showNotification('❌ تصویر ڈاؤنلوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔');
    });
}

// Share template on WhatsApp
function shareTemplateOnWhatsApp() {
    let scoreText = "";
    if (score === 100) {
        scoreText = "مکمل اسکور 🏆";
    } else if (score >= 80) {
        scoreText = "شاندار اسکور 🌟";
    } else if (score >= 60) {
        scoreText = "اچھا اسکور 👍";
    } else {
        scoreText = "کوئز اسکور 📚";
    }
    
    const text = `🌙 *اسلامی کوئز مقابلہ* 🌙

🏆 میرا اسکور: ${score}/100
👤 نام: ${userData.name}
📅 تاریخ: ${new Date().toLocaleDateString('ur-PK')}

میں نے ${scoreText} حاصل کیا! آپ بھی اپنے اسلامی علم کا测验 کریں۔

🔗 لنک: https://alkunooz.com

#اسلامی_کوئز #AlKunooz`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Back to congratulations
function backToCongratulations() {
    document.getElementById('share-template-section').classList.remove('active');
    document.getElementById('congrats-section').classList.add('active');
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

🔗 Link: https://alkunooz.com

#IslamicQuiz #MuslimQuiz #AlKunooz`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Share on Facebook
function shareOnFacebook() {
    const url = encodeURIComponent('https://alkunooz.com');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// Notification function
function showNotification(message) {
    // Remove existing notification
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

// Save to Google Sheets
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
    
    console.log('📊 User Data:', data);
}

// Start the app
window.onload = initApp;
