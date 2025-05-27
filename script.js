
let current = 0;
let score = 0;
let timer = 5;
let timerInterval;
let paused = false;
let quiz = [];
let wrongAnswers = [];
let selectedVoice = null;

window.speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  selectedVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes("Google") || v.name.includes("Microsoft")));
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  if (selectedVoice) utter.voice = selectedVoice;
  speechSynthesis.speak(utter);
}

function updateTimer() {
  const el = document.getElementById("timer");
  el.innerText = timer;
  el.style.color = timer <= 1 ? "red" : timer <= 3 ? "orange" : "green";
}

function markAnswer(_, correct) {
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => {
    if (b.innerText.trim() === correct.trim()) b.classList.add("correct");
  });
  wrongAnswers.push(quiz[current]);
  setTimeout(() => {
    current++;
    loadQuestion();
  }, 1000);
}

function checkAnswer(selected, correct) {
  clearInterval(timerInterval);
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => {
    if (b.innerText.trim() === correct.trim()) b.classList.add("correct");
    if (b.innerText.trim() === selected.trim() && selected.trim() !== correct.trim()) b.classList.add("incorrect");
  });

  if (selected.trim() === correct.trim()) {
    score++;
  } else {
    wrongAnswers.push(quiz[current]);
  }

  // 🔥 정답/오답 상관없이 다음 문제로 진행
  setTimeout(() => {
    current++;
    loadQuestion();
  }, 1000);
}

function loadQuestion() {
  if (current >= quiz.length) {
    document.body.innerHTML = `<h2>퀴즈 완료!</h2><p>점수: ${score}/${quiz.length}</p><br/><button onclick="retryWrong()">오답노트 다시 풀기</button>`;
    localStorage.setItem("wrongAnswers1300", JSON.stringify(wrongAnswers));
    return;
  }
  const q = quiz[current];
  document.getElementById("counter").innerText = `${current + 1}/${quiz.length}`;
  document.getElementById("question").innerText = q.word;
  speak(q.word);

  const options = [q.meaning];
  while (options.length < 4) {
    const option = quiz[Math.floor(Math.random() * quiz.length)].meaning;
    if (!options.includes(option)) options.push(option);
  }
  shuffle(options);

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, q.meaning);
    choicesContainer.appendChild(btn);
  });

  timer = 5;
  updateTimer();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!paused) {
      timer--;
      updateTimer();
      if (timer === 0) {
        clearInterval(timerInterval);
        markAnswer(null, q.meaning);
      }
    }
  }, 1000);
}

function togglePause() {
  paused = !paused;
  document.getElementById("pauseBtn").innerText = paused ? "▶️" : "⏸";
}

function retryWrong() {
  const wrong = JSON.parse(localStorage.getItem("wrongAnswers1300") || "[]");
  if (!wrong.length) return alert("오답이 없습니다.");
  quiz = wrong;
  current = 0;
  score = 0;
  wrongAnswers = [];
  loadQuestion();
}

quiz = shuffle(quizData).slice(0, 500);
loadQuestion();
