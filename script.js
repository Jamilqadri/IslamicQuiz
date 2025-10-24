// script.js

// Quiz data and questions
const quizQuestions = [
    {
        question: "What is the first month of the Islamic calendar?",
        options: ["Muharram", "Ramadan", "Shawwal", "Dhul-Hijjah"],
        correct: 0
    },
    {
        question: "How many pillars of Islam are there?",
        options: ["4", "5", "6", "7"],
        correct: 1
    },
    {
        question: "Which prayer is performed at dawn?",
        options: ["Fajr", "Dhuhr", "Asr", "Isha"],
        correct: 0
    }
];

class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userInfo = {
            name: '',
            email: '',
            state: ''
        };
    }

    // Initialize the quiz
    init() {
        this.collectUserInfo();
        this.displayQuestion();
        this.setupEventListeners();
    }

    // Collect user information
    collectUserInfo() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.userInfo.name = document.getElementById('name').value;
            this.userInfo.email = document.getElementById('email').value;
            this.userInfo.state = document.getElementById('state').value;
            
            if (this.validateUserInfo()) {
                document.getElementById('userInfoSection').style.display = 'none';
                document.getElementById('quizSection').style.display = 'block';
            }
        });
    }

    // Validate user information
    validateUserInfo() {
        if (!this.userInfo.name || !this.userInfo.email || !this.userInfo.state) {
            alert('Please fill all fields');
            return false;
        }
        return true;
    }

    // Display current question
    displayQuestion() {
        const question = quizQuestions[this.currentQuestion];
        document.getElementById('question').textContent = question.question;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-btn';
            button.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(button);
        });
        
        document.getElementById('progress').textContent = 
            `Question ${this.currentQuestion + 1} of ${quizQuestions.length}`;
    }

    // Handle option selection
    selectOption(selectedIndex) {
        const question = quizQuestions[this.currentQuestion];
        
        if (selectedIndex === question.correct) {
            this.score++;
        }
        
        this.currentQuestion++;
        
        if (this.currentQuestion < quizQuestions.length) {
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.currentQuestion++;
            if (this.currentQuestion < quizQuestions.length) {
                this.displayQuestion();
            } else {
                this.endQuiz();
            }
        });
    }

    // End quiz and show results
    endQuiz() {
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        this.displayResults();
        this.saveQuizData();
    }

    // Display results
    displayResults() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('summaryName').textContent = this.userInfo.name;
        document.getElementById('summaryScore').textContent = this.score;
        document.getElementById('summaryState').textContent = 
            document.getElementById('state').options[document.getElementById('state').selectedIndex].text;

        // Result message based on score
        let message = '';
        if (this.score >= 80) {
            message = 'Excellent! You have great Islamic knowledge.';
        } else if (this.score >= 60) {
            message = 'Good job! Your Islamic knowledge is impressive.';
        } else if (this.score >= 40) {
            message = 'Fair! Keep learning more about Islam.';
        } else {
            message = 'Keep studying! Islam has vast knowledge to explore.';
        }
        
        // Display the message
        document.getElementById('resultMessage').textContent = message;
    }

    // Save quiz data
    saveQuizData() {
        const quizData = {
            name: this.userInfo.name,
            email: this.userInfo.email,
            state: this.userInfo.state,
            score: this.score,
            totalQuestions: quizQuestions.length,
            timestamp: new Date().toISOString()
        };

        // Convert to JSON and log
        console.log(JSON.stringify(quizData));
        
        // Send to Google Sheets
        this.sendToGoogleSheets(quizData);
    }

    // Send data to Google Sheets
    sendToGoogleSheets(quizData) {
        // This will be implemented with Google Apps Script
        console.log('Data to be sent to Google Sheets:', quizData);
        
        // Example implementation (you'll need to set up Google Apps Script)
        // fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(quizData)
        // })
        // .then(response => response.json())
        // .then(data => console.log('Success:', data))
        // .catch(error => console.error('Error:', error));
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new Quiz();
    quiz.init();
});