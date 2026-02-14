// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        selectedPage.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Reset quiz if navigating away from quiz page
    if (pageId !== 'quizzes') {
        resetQuizState();
    }
}

// Animated Background Particles
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.5)`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Quiz Data with Superheroes
const quizQuestions = [
    {
        id: 1,
        superhero: "Captain Consent",
        heroImage: "IMG-20260213-WA0005.jpg",
        question: "Your uncle wants to hug you but you don't feel comfortable. What should you do?",
        options: [
            "Hug him anyway to be polite",
            "Say 'No thank you, I'd prefer a high-five!'",
            "Run and hide",
            "Stay quiet and feel uncomfortable"
        ],
        correct: 1,
        explanation: "Captain Consent says: YOUR BODY, YOUR CHOICE! You can always say no to any touch that makes you uncomfortable, even from family. Suggest an alternative like a wave or high-five!",
        audioFile: "audio/question1.mp3"
    },
    {
        id: 2,
        superhero: "Detective Divya",
        heroImage: "IMG-20260213-WA0003.jpg",
        question: "Someone online asks for your home address and wants to meet you. What should you do?",
        options: [
            "Give them your address",
            "Tell a trusted adult immediately",
            "Meet them at a public place",
            "Share your school address instead"
        ],
        correct: 1,
        explanation: "Detective Divya warns: NEVER share personal information online! If someone asks where you live or wants to meet, tell a parent, teacher, or trusted adult right away. This is a RED FLAG!",
        audioFile: "audio/question2.mp3"
    },
    {
        id: 3,
        superhero: "Signal Surya",
        heroImage: "IMG-20260213-WA0006.jpg",
        question: "What is the CHILDLINE number you can call 24/7 if you need help?",
        options: [
            "100",
            "1098",
            "911",
            "108"
        ],
        correct: 1,
        explanation: "Signal Surya reminds you: CHILDLINE 1098 is FREE, available 24/7, and completely confidential! You can call for ANY problem - big or small. Help is just a call away!",
        audioFile: "audio/question3.mp3"
    },
    {
        id: 4,
        superhero: "Justice Jaya",
        heroImage: null,
        question: "Under the POCSO Act, who is protected from sexual abuse?",
        options: [
            "Only girls under 18",
            "Only children who report it",
            "ALL children under 18 years",
            "Only children in cities"
        ],
        correct: 2,
        explanation: "Justice Jaya explains: The POCSO Act 2012 protects ALL children under 18 - boys, girls, everyone! This law ensures that those who harm children face serious consequences and that children get justice!",
        audioFile: "audio/question4.mp3"
    },
    {
        id: 5,
        superhero: "Guardian Gopal",
        heroImage: "IMG-20260213-WA0004.jpg",
        question: "Which of these is an example of GOOD TOUCH?",
        options: [
            "Someone touches your private parts",
            "A doctor examining you with parent present",
            "Someone makes you touch them inappropriately",
            "Being forced into a hug"
        ],
        correct: 1,
        explanation: "Guardian Gopal teaches: Good touches are safe, respectful, and make you feel comfortable! Medical exams with a parent/guardian present are okay. Bad touches make you feel uncomfortable, scared, or confused - ALWAYS tell a trusted adult!",
        audioFile: "audio/question5.mp3"
    },
    {
        id: 6,
        superhero: "Counsellor Chitra",
        heroImage: "IMG-20260213-WA0002.jpg",
        question: "If something bad happens to you, what should you remember?",
        options: [
            "Keep it a secret forever",
            "It's your fault",
            "It's NOT your fault and you should talk about it",
            "Be ashamed and don't tell anyone"
        ],
        correct: 2,
        explanation: "Counsellor Chitra wants you to know: It's NEVER your fault if someone hurts you! Talking about your feelings is brave and helps you heal. You deserve support, love, and protection. Never keep unsafe secrets!",
        audioFile: "audio/question6.mp3"
    }
];

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let autoPlay = true;
let questionAudio = null;

// Audio elements
const correctAudio = new Audio('audio/hurray.mp3');
const incorrectAudio = new Audio('audio/oops.mp3');

// Start Quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    
    document.getElementById('quiz-start').classList.remove('active');
    document.getElementById('quiz-questions').classList.add('active');
    
    loadQuestion();
}

// Load Question
function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
    
    // Update question number
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    document.getElementById('total-q').textContent = quizQuestions.length;
    
    // Clear previous selection and feedback
    selectedAnswer = null;
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback';
    
    // Create question HTML with superhero
    let questionHTML = `
        <div class="question-card" style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);">
            <div class="superhero-intro" style="text-align: center; margin-bottom: 30px;">
                ${question.heroImage ? 
                    `<img src="${question.heroImage}" alt="${question.superhero}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 5px solid #ff6ec7; box-shadow: 0 10px 30px rgba(255, 110, 199, 0.3);">` :
                    `<div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #ff6ec7, #4a90e2); display: flex; align-items: center; justify-content: center; font-size: 48px; margin: 0 auto; border: 5px solid #ff6ec7;">⚖️</div>`
                }
                <h3 style="color: #ff6ec7; margin-top: 15px; font-size: 24px;">${question.superhero} asks:</h3>
                <button onclick="playQuestionAudio()" style="background: linear-gradient(135deg, #4a90e2, #667eea); color: white; border: none; padding: 12px 25px; border-radius: 30px; cursor: pointer; font-size: 16px; margin-top: 10px; box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);">
                    🔊 Listen to Question
                </button>
            </div>
            
            <div class="question-text" style="font-size: 22px; color: #333; margin-bottom: 30px; text-align: center; font-weight: 600; line-height: 1.6;">
                ${question.question}
            </div>
            
            <div class="options-container" style="display: grid; gap: 15px;">
    `;
    
    question.options.forEach((option, index) => {
        questionHTML += `
            <div class="quiz-option" onclick="selectAnswer(${index})" data-index="${index}" style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 20px; border-radius: 15px; cursor: pointer; transition: all 0.3s; border: 3px solid transparent; font-size: 18px;">
                <span style="font-weight: bold; color: #ff6ec7; margin-right: 10px;">${String.fromCharCode(65 + index)}.</span>
                ${option}
            </div>
        `;
    });
    
    questionHTML += `
            </div>
        </div>
    `;
    
    document.getElementById('question-container').innerHTML = questionHTML;
    
    // Auto-play question
    if (autoPlay) {
        playQuestionAudio();
    }
}

// Play Question Audio
function playQuestionAudio() {
    const question = quizQuestions[currentQuestionIndex];
    
    // Try to play pre-recorded audio
    if (questionAudio) {
        questionAudio.pause();
        questionAudio = null;
    }
    
    questionAudio = new Audio(question.audioFile);
    questionAudio.onerror = () => {
        // Fallback to text-to-speech if audio file not found
        console.log('Audio file not found, using text-to-speech fallback');
        speakText(`${question.superhero} asks: ${question.question}`);
    };
    questionAudio.play().catch(err => {
        console.log('Could not play audio, trying text-to-speech');
        speakText(`${question.superhero} asks: ${question.question}`);
    });
}

// Fallback text-to-speech
function speakText(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    }
}

// Select Answer
function selectAnswer(index) {
    // Don't allow changing answer after submission
    if (document.getElementById('feedback').innerHTML !== '') {
        return;
    }
    
    selectedAnswer = index;
    
    // Highlight selected option
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, i) => {
        if (i === index) {
            option.style.borderColor = '#ff6ec7';
            option.style.background = 'linear-gradient(135deg, #ffeef8, #ffe5f3)';
            option.style.transform = 'scale(1.02)';
        } else {
            option.style.borderColor = 'transparent';
            option.style.background = 'linear-gradient(135deg, #f8f9fa, #e9ecef)';
            option.style.transform = 'scale(1)';
        }
    });
}

// Submit Answer
function submitAnswer() {
    if (selectedAnswer === null) {
        alert('Please select an answer first! 😊');
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('feedback');
    
    // Disable all options
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Check if answer is correct
    if (selectedAnswer === question.correct) {
        score++;
        
        // Highlight correct answer in green
        options[selectedAnswer].style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
        options[selectedAnswer].style.borderColor = '#28a745';
        
        // Show success feedback
        feedback.innerHTML = `
            <div style="background: linear-gradient(135deg, #d4edda, #c3e6cb); padding: 25px; border-radius: 15px; margin-top: 20px; border: 3px solid #28a745;">
                <div style="font-size: 48px; text-align: center; margin-bottom: 15px;">🎉</div>
                <h3 style="color: #28a745; text-align: center; font-size: 24px; margin-bottom: 15px;">Hurray! Correct! 🌟</h3>
                <p style="color: #155724; font-size: 16px; line-height: 1.6; text-align: center;">${question.explanation}</p>
            </div>
        `;
        feedback.className = 'feedback show';
        
        // Play success sound
        correctAudio.play().catch(err => {
            speakText('Hurray! Correct answer!');
        });
        
    } else {
        // Highlight wrong answer in red and correct in green
        options[selectedAnswer].style.background = 'linear-gradient(135deg, #f8d7da, #f5c6cb)';
        options[selectedAnswer].style.borderColor = '#dc3545';
        options[question.correct].style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
        options[question.correct].style.borderColor = '#28a745';
        
        // Show error feedback
        feedback.innerHTML = `
            <div style="background: linear-gradient(135deg, #f8d7da, #f5c6cb); padding: 25px; border-radius: 15px; margin-top: 20px; border: 3px solid #dc3545;">
                <div style="font-size: 48px; text-align: center; margin-bottom: 15px;">😔</div>
                <h3 style="color: #dc3545; text-align: center; font-size: 24px; margin-bottom: 15px;">Oops! Wrong Answer</h3>
                <p style="color: #721c24; font-size: 16px; line-height: 1.6; text-align: center;">${question.explanation}</p>
            </div>
        `;
        feedback.className = 'feedback show';
        
        // Play failure sound
        incorrectAudio.play().catch(err => {
            speakText('Oops! Wrong answer. Let me explain.');
        });
    }
    
    // Change button to "Next Question"
    const navButtons = document.querySelector('.quiz-navigation');
    navButtons.innerHTML = `
        <button class="quiz-btn" onclick="nextQuestion()" style="padding: 15px 40px; font-size: 18px; background: linear-gradient(135deg, #ff6ec7, #ff9a9e); color: white; border: none; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 20px rgba(255, 110, 199, 0.4); font-weight: bold;">
            ${currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question ➡️' : 'See Results 🏆'}
        </button>
    `;
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
        
        // Reset submit button
        const navButtons = document.querySelector('.quiz-navigation');
        navButtons.innerHTML = `
            <button class="quiz-btn" onclick="submitAnswer()" style="padding: 15px 40px; font-size: 18px; background: linear-gradient(135deg, #4a90e2, #667eea); color: white; border: none; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 20px rgba(74, 144, 226, 0.4); font-weight: bold;">
                Submit Answer
            </button>
        `;
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    document.getElementById('quiz-questions').classList.remove('active');
    document.getElementById('quiz-results').classList.add('active');
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    let badge = '';
    let message = '';
    let superheroResponse = '';
    
    if (percentage === 100) {
        badge = '🏆';
        message = 'PERFECT SCORE!';
        superheroResponse = `<p><strong>All the superheroes are SO PROUD of you! 🌟</strong></p>
            <p>You're a true Safety Champion! You know exactly how to protect yourself and others. You've earned the Super Safety Squad Badge! Keep using your knowledge to stay safe and help others!</p>`;
    } else if (percentage >= 80) {
        badge = '⭐';
        message = 'EXCELLENT!';
        superheroResponse = `<p><strong>The Super Safety Squad is impressed! 🎉</strong></p>
            <p>You have great safety knowledge! You're well on your way to becoming a Safety Champion. Review the questions you missed to become even stronger!</p>`;
    } else if (percentage >= 60) {
        badge = '💪';
        message = 'GOOD JOB!';
        superheroResponse = `<p><strong>The squad says: You're learning well! 👍</strong></p>
            <p>You know quite a bit about staying safe! Take the quiz again to improve your score and become even more confident in protecting yourself and others!</p>`;
    } else {
        badge = '📚';
        message = 'KEEP LEARNING!';
        superheroResponse = `<p><strong>Don't give up, young hero! 💙</strong></p>
            <p>Learning about safety takes time. Read through the comics and laws sections again, then retake the quiz. The Super Safety Squad believes in you!</p>`;
    }
    
    document.getElementById('score-display').innerHTML = `
        <div style="font-size: 96px; margin-bottom: 20px;">${badge}</div>
        <div style="font-size: 36px; color: #ff6ec7; margin-bottom: 10px;">${message}</div>
        <div style="font-size: 56px; font-weight: bold; color: #4a90e2;">
            ${score} / ${quizQuestions.length}
        </div>
        <div style="font-size: 24px; color: #666; margin-top: 10px;">${percentage}% Correct</div>
    `;
    
    document.getElementById('superhero-message').innerHTML = superheroResponse;
    
    // Speak the results
    speakText(`${message}! You scored ${score} out of ${quizQuestions.length}!`);
}

// Restart Quiz
function restartQuiz() {
    document.getElementById('quiz-results').classList.remove('active');
    document.getElementById('quiz-start').classList.add('active');
    resetQuizState();
}

// Reset Quiz State
function resetQuizState() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    if (questionAudio) {
        questionAudio.pause();
        questionAudio = null;
    }
    window.speechSynthesis.cancel();
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ripple-effect') || e.target.closest('.ripple-effect')) {
        const button = e.target.classList.contains('ripple-effect') ? e.target : e.target.closest('.ripple-effect');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    
    // Show home page by default
    showPage('home');
});