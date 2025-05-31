
let currentIndex = 0;
let timer = 5;
let interval = null;

const questionNumber = document.getElementById("question-number");
const questionWord = document.getElementById("question-word");
const timerEl = document.getElementById("timer");
const choicesEl = document.getElementById("choices");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startQuiz() {
  quizData.sort(() => Math.random() - 0.5);
  showQuestion();
  startTimer();
}

function showQuestion() {
  clearInterval(interval);
  timer = 5;
  timerEl.textContent = `⏱ ${timer}`;

  const current = quizData[currentIndex];
  questionNumber.textContent = `${currentIndex + 1} / ${quizData.length}`;
  questionWord.textContent = current.expression;

  const options = shuffle([
    current.meaning,
    ...quizData.filter(q => q.meaning !== current.meaning).slice(0, 3).map(q => q.meaning)
  ]);
  choicesEl.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "choice-button";
    btn.onclick = () => handleAnswer(opt === current.meaning, opt, current.meaning);
    choicesEl.appendChild(btn);
  });

  interval = setInterval(() => {
    timer--;
    timerEl.textContent = `⏱ ${timer}`;
    if (timer === 0) {
      clearInterval(interval);
      handleAnswer(false, "", current.meaning);
    }
  }, 1000);
}

function handleAnswer(isCorrect, selected, correct) {
  clearInterval(interval);
  const buttons = document.querySelectorAll(".choice-button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
    }
    if (!isCorrect && btn.textContent === selected) {
      btn.style.backgroundColor = "red";
      btn.style.color = "white";
    }
  });

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < quizData.length) {
      showQuestion();
      startTimer();
    } else {
      questionWord.textContent = "🎉 퀴즈 완료!";
      questionNumber.textContent = "";
      choicesEl.innerHTML = "";
      timerEl.style.display = "none";
    }
  }, 1500);
}

startQuiz();
