// script.js

console.log("Script loaded successfully!");

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
        console.log("Quiz class initialized");
    }

    // Initialize the quiz
    init() {
        console.log("Initializing quiz...");
        this.showUserInfoSection();
        this.setupEventListeners();
    }

    // Show user info section
    showUserInfoSection() {
        console.log("Showing user info section");
        document.getElementById('userInfoSection').classList.add('active');
        document.getElementById('quizSection').classList.remove('active');
        document.getElementById('resultsSection').classList.remove('active');
    }

    // Setup event listeners
    setupEventListeners() {
        console.log("Setting up event listeners");
        
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log("Start button clicked");
                this.collectUserInfo();
            });
        } else {
            console.error("Start button not found!");
        }

        // Restart button
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                console.log("Restart button clicked");
                this.restartQuiz();
            });
        }
    }

    // Collect user information
    collectUserInfo() {
        console.log("Collecting user info");
        
        this.userInfo.name = document.getElementById('name').value;
        this.userInfo.email = document.getElementById('email').value;
        this.userInfo.state = document.getElementById('state').value;
        
        console.log("User info:", this.userInfo);
        
        if (this.validateUserInfo()) {
            document.getElementById('userInfoSection').classList.remove('active');
            document.getElementById('quizSection').classList.add('active');
            this.displayQuestion();
        }
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
        console.log("Displaying question:", this.currentQuestion);
        
        const question = quizQuestions[this.currentQuestion];
        document.getElementById('question').textContent = question.question;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-btn';
            button.addEventListener('click', () => {
                console.log("Option clicked:", index);
                this.selectOption(index);
            });
            optionsContainer.appendChild(button);
        });
        
        document.getElementById('progress').textContent = 
            `Question ${this.currentQuestion + 1} of ${quizQuestions.length}`;
            
        document.getElementById('totalQuestions').textContent = quizQuestions.length;
    }

    // Handle option selection
    selectOption(selectedIndex) {
        console.log("Selected option:", selectedIndex);
        
        const question = quizQuestions[this.currentQuestion];
        
        if (selectedIndex === question.correct) {
            this.score++;
            console.log("Correct! Score:", this.score);
        }
        
        this.currentQuestion++;
        
        if (this.currentQuestion < quizQuestions.length) {
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    // End quiz and show results
    endQuiz() {
        console.log("Ending quiz. Final score:", this.score);
        
        document.getElementById('quizSection').classList.remove('active');
        document.getElementById('resultsSection').classList.add('active');
        
        this.displayResults();
        this.saveQuizData();
    }

    // Display results
    displayResults() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('summaryName').textContent = this.userInfo.name;
        document.getElementById('summaryScore').textContent = this.score;
        document.getElementById('summaryState').textContent = this.userInfo.state;

        // Result message based on score
        let message = '';
        const percentage = (this.score / quizQuestions.length) * 100;
        
        if (percentage >= 80) {
            message = 'Excellent! You have great Islamic knowledge.';
        } else if (percentage >= 60) {
            message = 'Good job! Your Islamic knowledge is impressive.';
        } else if (percentage >= 40) {
            message = 'Fair! Keep learning more about Islam.';
        } else {
            message = 'Keep studying! Islam has vast knowledge to explore.';
        }
        
        document.getElementById('resultMessage').textContent = message;
    }

    // Restart quiz
    restartQuiz() {
        console.log("Restarting quiz");
        this.currentQuestion = 0;
        this.score = 0;
        this.userInfo = { name: '', email: '', state: '' };
        
        // Clear form fields
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('state').value = '';
        
        this.showUserInfoSection();
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

        console.log('Quiz Data:', quizData);
        this.sendToGoogleSheets(quizData);
    }

    // Send data to Google Sheets
    sendToGoogleSheets(quizData) {
        console.log('Data to be sent to Google Sheets:', quizData);
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    const quiz = new Quiz();
    quiz.init();
});