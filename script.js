// script.js

console.log("Script loaded successfully!");

class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userInfo = {
            name: '',
            contact: '',
            address: '',
            state: ''
        };
        this.timer = null;
        this.timeLeft = 10;
        console.log("Quiz class initialized");
    }

    // Initialize the quiz
    init() {
        console.log("Initializing quiz...");
        this.showScreen('welcomeScreen');
        this.setupEventListeners();
    }

    // Show specific screen
    showScreen(screenId) {
        console.log("Showing screen:", screenId);
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        // Show target screen
        document.getElementById(screenId).classList.add('active');
    }

    // Setup event listeners
    setupEventListeners() {
        console.log("Setting up event listeners");

        // Welcome screen start button
        const startQuizBtn = document.getElementById('startQuiz');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                console.log("Start quiz button clicked");
                this.showScreen('userInfoScreen');
            });
        } else {
            console.error("Start quiz button not found!");
        }

        // User info form submission
        const userInfoForm = document.getElementById('userInfoForm');
        if (userInfoForm) {
            userInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log("User info form submitted");
                this.collectUserInfo();
            });
        }

        // Next question button
        const nextQuestionBtn = document.getElementById('nextQuestion');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => {
                console.log("Next question button clicked");
                this.nextQuestion();
            });
        }

        // Play again button
        const playAgainBtn = document.getElementById('playAgain');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                console.log("Play again button clicked");
                this.restartQuiz();
            });
        }

        // Share buttons
        const shareWhatsApp = document.getElementById('shareWhatsApp');
        if (shareWhatsApp) {
            shareWhatsApp.addEventListener('click', () => {
                this.shareOnWhatsApp();
            });
        }

        const shareFacebook = document.getElementById('shareFacebook');
        if (shareFacebook) {
            shareFacebook.addEventListener('click', () => {
                this.shareOnFacebook();
            });
        }

        // Download Image button
        const downloadImage = document.getElementById('downloadImage');
        if (downloadImage) {
            downloadImage.addEventListener('click', () => {
                this.downloadScoreImage();
            });
        }
    }

    // Collect user information
    collectUserInfo() {
        console.log("Collecting user info");

        this.userInfo.name = document.getElementById('fullName').value;
        this.userInfo.contact = document.getElementById('contactNumber').value;
        this.userInfo.address = document.getElementById('address').value;
        this.userInfo.state = document.getElementById('state').value;

        console.log("User info:", this.userInfo);

        if (this.validateUserInfo()) {
            this.startQuiz();
        }
    }

    // Validate user information
    validateUserInfo() {
        if (!this.userInfo.name || !this.userInfo.contact || !this.userInfo.address || !this.userInfo.state) {
            alert('Please fill all fields');
            return false;
        }
        return true;
    }

    // Start the quiz
    startQuiz() {
        console.log("Starting quiz");
        this.showScreen('quizScreen');
        this.currentQuestion = 0;
        this.score = 0;
        this.displayQuestion();
    }

    // Display current question
    displayQuestion() {
        console.log("Displaying question:", this.currentQuestion);

        const question = quizQuestions[this.currentQuestion];
        document.getElementById('questionText').textContent = question.question;

        // Update progress (5 questions fixed)
        const progress = ((this.currentQuestion) / 5) * 100;
        document.getElementById('progress').style.width = progress + '%';
        document.getElementById('questionCount').textContent = `Question ${this.currentQuestion + 1}/5`;

        const optionsContainer = document.getElementById('optionsContainer');
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

        // Start timer
        this.startTimer();

        // Disable next button initially
        document.getElementById('nextQuestion').disabled = true;
    }

    // Start timer for current question
    startTimer() {
        this.timeLeft = 10;
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('timer').style.background = 'var(--gold)';
        
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            
            // Timer color change
            if (this.timeLeft <= 3) {
                document.getElementById('timer').style.background = '#ff4444';
            } else if (this.timeLeft <= 7) {
                document.getElementById('timer').style.background = '#ffaa00';
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.nextQuestion();
            }
        }, 1000);
    }

    // Handle option selection with time-based scoring
    selectOption(selectedIndex) {
        console.log("Selected option:", selectedIndex);
        
        // Calculate score based on time
        let questionScore = 20;
        if (this.timeLeft < 10) {
            questionScore = Math.max(0, 20 - ((10 - this.timeLeft) * 2));
        }
        
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
        }

        const question = quizQuestions[this.currentQuestion];
        const options = document.querySelectorAll('.option-btn');

        // Mark selected option
        options.forEach((option, index) => {
            if (index === selectedIndex) {
                option.classList.add('selected');
                if (index === question.correct) {
                    this.score += questionScore;
                    console.log(`Correct! Time: ${this.timeLeft}s, Score: +${questionScore}, Total: ${this.score}`);
                }
            }
        });

        // Enable next button
        document.getElementById('nextQuestion').disabled = false;
    }

    // Move to next question
    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion < 5) { // Fixed 5 questions
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    // End quiz and show results
    endQuiz() {
        console.log("Ending quiz. Final score:", this.score);

        this.showScreen('resultScreen');
        this.displayResults();
        this.saveQuizData();
    }

    // Display results
    displayResults() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('summaryName').textContent = this.userInfo.name;
        document.getElementById('summaryScore').textContent = this.score;
        document.getElementById('summaryState').textContent = document.getElementById('state').options[document.getElementById('state').selectedIndex].text;

        // Result message based on score
        let message = '';

        if (this.score >= 80) {
            message = 'Excellent! You have great Islamic knowledge. 🎉';
        } else if (this.score >= 60) {
            message = 'Good job! Your Islamic knowledge is impressive. 👍';
        } else if (this.score >= 40) {
            message = 'Fair! Keep learning more about Islam. 📚';
        } else {
            message = 'Keep studying! Islam has vast knowledge to explore. 🌟';
        }

        document.getElementById('resultMessage').textContent = message;

        // Update leaderboard
        this.updateLeaderboard();
    }

    // Update leaderboard
    updateLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = `
            <div class="leaderboard-item">
                <span>1. You</span>
                <span>${this.score} points</span>
            </div>
            <div class="leaderboard-item">
                <span>2. Ahmad</span>
                <span>80 points</span>
            </div>
            <div class="leaderboard-item">
                <span>3. Fatima</span>
                <span>60 points</span>
            </div>
        `;
    }

    // Share on WhatsApp
    shareOnWhatsApp() {
        const message = `I scored ${this.score}% in Islamic Quiz! Test your knowledge too.`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Share on Facebook
    shareOnFacebook() {
        const message = `I scored ${this.score}% in Islamic Quiz!`;
        const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Download Score as Image
    downloadScoreImage() {
        alert("Download feature would work with html2canvas library");
        // For actual implementation, include html2canvas library
        // html2canvas(document.querySelector('.result-card')).then(canvas => {
        //     const link = document.createElement('a');
        //     link.download = `islamic-quiz-score-${this.score}.png`;
        //     link.href = canvas.toDataURL();
        //     link.click();
        // });
    }

    // Restart quiz
    restartQuiz() {
        console.log("Restarting quiz");
        this.currentQuestion = 0;
        this.score = 0;
        this.userInfo = { name: '', contact: '', address: '', state: '' };

        // Clear form fields
        document.getElementById('fullName').value = '';
        document.getElementById('contactNumber').value = '';
        document.getElementById('address').value = '';
        document.getElementById('state').value = '';

        this.showScreen('welcomeScreen');
    }

    // Save quiz data
    saveQuizData() {
        const quizData = {
            name: this.userInfo.name,
            contact: this.userInfo.contact,
            address: this.userInfo.address,
            state: this.userInfo.state,
            score: this.score,
            totalQuestions: 5,
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