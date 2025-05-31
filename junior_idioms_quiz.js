
let currentIndex = 0;
let timer = 5;
let interval = null;
let paused = false;
let selectedQuiz = [];

const questionNumber = document.getElementById("question-number");
const questionWord = document.getElementById("question-word");
const timerEl = document.getElementById("timer");
const choicesEl = document.getElementById("choices");
const pauseButton = document.getElementById("pause-button");

function speak(text) {
  try {
    const cleaned = text
      .replace(/\([^)]*\)/g, "")  // 괄호 제거
      .replace(/[가-힣]/g, "")      // 한글 제거
      .replace(/\s+/g, " ")        // 공백 정리
      .trim();
    if (cleaned.length > 0) {
     const utter = new SpeechSynthesisUtterance(cleaned);
     const voices = window.speechSynthesis.getVoices();
      
      // 미국 원어민 목소리 중 하나 선택 (예: 'Daniel' or 'Samantha')
      utter.voice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Samantha'));
      
      // 대체 설정
      utter.lang = 'en-US';
      utter.rate = 1;
      utter.pitch = 1;
      speechSynthesis.speak(utter);

    }
  } catch (e) {
    console.warn("발음 오류:", text, e);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startQuiz() {
  selectedQuiz = shuffle([...quizData]).slice(0, 100);
  currentIndex = 0;
  showQuestion();
  startTimer();
}

function showQuestion() {
  clearInterval(interval);
  timer = 5;
  timerEl.textContent = `⏱ ${timer}`;

  const current = selectedQuiz[currentIndex];
  questionNumber.textContent = `${currentIndex + 1} / ${selectedQuiz.length}`;
  questionWord.textContent = current.expression;

  speak(current.expression);

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

  startTimer();
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (!paused) {
      timer--;
      timerEl.textContent = `⏱ ${timer}`;
      if (timer === 0) {
        clearInterval(interval);
        handleAnswer(false, "", selectedQuiz[currentIndex].meaning);
      }
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
    if (currentIndex < selectedQuiz.length) {
      showQuestion();
    } else {
      questionWord.textContent = "🎉 퀴즈 완료!";
      questionNumber.textContent = "";
      choicesEl.innerHTML = "";
      timerEl.style.display = "none";
    }
  }, 1500);
}

pauseButton.onclick = () => {
  paused = !paused;
  pauseButton.textContent = paused ? "▶ 재개" : "⏸ 일시정지";
};

startQuiz();
