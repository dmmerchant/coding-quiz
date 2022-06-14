//#region Screen Element Variables
var endMessageEl = document.querySelector('#endMessage')
var questionEl = document.querySelector('#question')
var responsesEl = document.querySelector('#responses')
var responseResultEl = document.querySelector('#response-result')
var userScoreEl = document.querySelector('#userScore')
var userInitialsEl = document.querySelector('#userInitials')
var timerEl = document.querySelector('#timer')
var noInitials = document.querySelector('#no-initials')
var noHighScoresEl = document.querySelector('#no-high-scores')
var scoreRecordsEl = document.querySelector('#score-records')
// Buttons
var bttnStart = document.querySelector('#start-quiz')
var bttnReStart = document.querySelector('#restart-quiz')
var bttnHomeScreen = document.querySelector('#home-screen')
var bttnHighScores = document.querySelector('#nav-high-scores')
var bttnResetScores = document.querySelector('#reset-scores')
var bttnAddScore = document.querySelector('#add-score')

//Screens
var screens = [
  {name: "index",
  screen: document.querySelector('#index')},
  {name: "question-box",
  screen: document.querySelector('#question-box')},
  {name: "results",
  screen: document.querySelector('#results')},
  {name: "high-scores",
  screen: document.querySelector('#high-scores')}
]
//#endregion

//#region Array of Questions
var allQuestions = [
    {question: "What does CSS stand for?",
    answer: "Cascading Style Sheets",
    options: ["Certified Style Standard", "Coding Standard Style", "Cascading Sheet Styling"]
    },
    {question: "Where is the link placed when referencing an external style sheet?",
    answer: "head",
    options: ["footer", "body", "main"]
    },
    {question: "What does DOM stand for?",
    answer: "Document Object Model",
    options: ["Data Object Matrix", "Decoding Operator Model", "Degrading Optional Matter"]
    },
    {question: "When referencing an ID, the prefix is:",
    answer: "A hashtag",
    options: ["Double forward slash", "Period", "Exclamation point"]
    },
    {question: "What does HTML stand for?",
    answer: "Hypertext Markup Language",
    options: ["Helping Text Markup Language", "Highly Typed Matrix Language", "Cascading Sheet Styling"]
    },
    {question: "The var statement is used to:",
    answer: "Create a new local variable",
    options: ["Set a constant variable", "Code out the line", "End a function"]
    },
    {question: "In an array object, what is the key of the first value?",
    answer: "0",
    options: ["-1", "A", "1"]
    },
    {question: "What is the file extension for a JavaScript file?",
    answer: ".js",
    options: [".javascript", ".jsv", ".jsc"]
    }
]
//#endregion

//#region Global Variables
var activeScreen = "index"
var remainingQuestions = []
var timeLeft;
var correctAnswer;
var userCorrectAnswers = 0;
var storedHighScores=[]
//#endregion

//#region Startup Routine
switchScreens();
renderHighScores();
//#endregion

//#region Screen Functions

function switchScreens() {
  screens.forEach(screen => {
    if (screen.name == activeScreen) {
      screen.screen.style.display = 'flex'
    } else {
      screen.screen.style.display = 'none'
    }
  })
  return
}

function disableBttns(bool) {
  bttnHomeScreen.disabled = bool;
  bttnHighScores.disabled = bool;
}
//#endregion

//#region Quiz Functions

// This is attached to the start button and begins the quiz. It starts 
function startQuiz(event) {
  timerEl.style.display = "unset";
  userCorrectAnswers = 0;
  timeLeft = 60;
  remainingQuestions.push(...allQuestions);
  
  disableBttns(true);
  activeScreen='question-box';
  switchScreens();
  generateQuestion();
  quizTimer();
}

function quizTimer() {
  timerEl.textContent = timeLeft;
  // TODO: Use the `setInterval()` method to call a function to be executed every 1000 milliseconds
  var timeInterval = setInterval(function () {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if(remainingQuestions.length === 0) {
      clearInterval(timeInterval);
    } else if(timeLeft <= 0) {
      clearInterval(timeInterval);
      endQuiz(false);
    }
  },1000);
}

function generateQuestion() {
    //Select a question from random
    i = Math.floor(Math.random() * remainingQuestions.length);
    var currentQuestion = remainingQuestions[i];
    console.log(allQuestions[i].options)
    //Populate the screen with the question
    questionEl.textContent = currentQuestion.question;

    //Set the correct answer
    correctAnswer = currentQuestion.answer;
    
    //Randomize the options and generate options
    var currentOptions = Array.from(currentQuestion.options);
    currentOptions.push(currentQuestion.answer);
    var currentOptions = shuffle(currentOptions);
    generateOptions(currentOptions);

    //Remove current question from the available question array so it won't show again
    remainingQuestions.splice(i,1)
    return   
}

function generateOptions(array) {
  responsesEl.innerHTML = ''
  //create a button for each possible answer.
  array.forEach(option => {
    var responseBttn = document.createElement('li')
    responseBttn.setAttribute("class","response")
    responseBttn.textContent = option;
    responsesEl.appendChild(responseBttn);
  })
  return
}

function submitAnswer(event) {
  event.stopPropagation()
  if (event.target.textContent == correctAnswer) {
    answerCorrect();
  } else {
    answerWrong();
  };
  if(remainingQuestions.length === 0) {
    endQuiz(true);
  } else if (timeLeft <=0 ) {
    endQuiz(false);
  } else {
    generateQuestion();
  }
;
}

function answerWrong() {
  timeLeft = timeLeft - 10;
  timerEl.textContent = timeLeft;
  displayMessage_Timed(responseResultEl,"message wrong","Wrong!",2);
}

function answerCorrect() {
  userCorrectAnswers = userCorrectAnswers + 10;
  displayMessage_Timed(responseResultEl,"message correct","Correct!",2);
}

function endQuiz(bool) {
  activeScreen = "results"
  switchScreens();
  timerEl.style.display = "none";
  if (bool) {
    displayMessage_Static(endMessageEl,"","You answered all the questions!",)
  } else {
    displayMessage_Timed(endMessageEl,"","You ran out of time!", )
  }
  userScoreEl.textContent = userCorrectAnswers
}

//#endregion

//#region High-Score Functions
function addHighScore(event) {
  event.preventDefault()
  if (userInitialsEl.value.length !== 0){
    storedHighScores.push({initials: userInitialsEl.value.toUpperCase(), score: userCorrectAnswers })
    storedHighScores.sort((a, b) => b.score - a.score);
    localStorage.setItem("allHighScores", JSON.stringify(storedHighScores.slice(0,10)))
    userCorrectAnswers = 0;
    activeScreen = 'high-scores';
    userInitialsEl.value = '';
    switchScreens();
    renderHighScores();
    disableBttns(false);
  } else {
    displayMessage_Timed(noInitials,"message wrong", "**Please enter your initials**",5)
  }
  
}

function resetHighScore() {
  localStorage.setItem("allHighScores",JSON.stringify([]))
  renderHighScores();
}

function renderHighScores() {
  scoreRecordsEl.innerHTML = ''
  storedHighScores = JSON.parse(localStorage.getItem("allHighScores"));
  if (storedHighScores.length !== 0) {
    noHighScoresEl.style.display = 'none'
    storedHighScores.forEach(score => {
      var highScoreEl = document.createElement('li');
      highScoreEl.textContent = score.initials + ' - ' + score.score;
      scoreRecordsEl.appendChild(highScoreEl);
    })
  } else {
    storedHighScores = []
    noHighScoresEl.style.display = 'unset';
  }
  
}
//#endregion

//#region Miscellaneous Functions

//Display Static Message Function
//This function can be used to change the textContent of any specified element.
function displayMessage_Static(element, type, msg) {
  element.textContent = msg;
  element.setAttribute("class", type);
}

//Display Timed Message Function
//This function can be used to change the textContent of any specified element for a specified duration of time.
function displayMessage_Timed(element, type, msg, time) {
  element.setAttribute("class", type)
  element.textContent = msg
  element.style.display = 'unset'
  var timeInterval = setInterval(function () {
    time--;
  if(time === 0) {
      element.style.display = "none";
      element.textContent = '';
      clearInterval(timeInterval);
    }
  },1000);
}

//(Fisher–Yates shuffle)
//This is a generic shuffle function to rearrange an array. https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
    var copy = [],  n = array.length, i;
  
    // While there remain elements to shuffle.
    while (n > 0) {
  
      // Pick a remaining element.
      i = Math.floor(Math.random() * n--);
  
      // Push that element into the new array.
      copy.push(array.splice(i, 1)[0])
    }
  
    return copy;
  }
//#endregion

//#region Listeners

bttnAddScore.addEventListener("click",addHighScore)

bttnStart.addEventListener("click",startQuiz)
bttnReStart.addEventListener("click",startQuiz)
bttnResetScores.addEventListener("click",resetHighScore)

bttnHomeScreen.addEventListener("click", function() {
  activeScreen='index';
  switchScreens();
})

bttnHighScores.addEventListener("click", function(){
  activeScreen='high-scores';
  switchScreens();
})

responsesEl.addEventListener("click",submitAnswer)
//#endregion










