
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

let voicesLoaded = false;
speechSynthesis.onvoiceschanged = () => {
  voicesLoaded = true;
};

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  
  // 목소리 목록 불러오기
  const voices = window.speechSynthesis.getVoices();
  
  // 미국 원어민 목소리 중 하나 선택 (예: 'Samantha' or 'Daniel')
  utter.voice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Samantha'));
  
  // 대체 설정
  utter.lang = 'en-US';
  utter.rate = 1;
  utter.pitch = 1;
  
   if (!voicesLoaded) {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.speak(utter);
    };
  } else {
    speechSynthesis.speak(utter);
  }
}

function updateTimer() {
  const el = document.getElementById("timer");
  el.innerText = timer;
  el.style.color = timer <= 1 ? "red" : timer <= 3 ? "orange" : "green";
}

function markAnswer(_, correct, choicesList) {
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => {
    if (b.innerText.trim() === correct.trim()) b.classList.add("correct");
  });
  wrongAnswers.push({
    word: quiz[current].word,
    choices: choicesList,
    answer: correct
  });
  localStorage.setItem("wrongAnswers1300", JSON.stringify(wrongAnswers));
  setTimeout(() => {
    current++;
    loadQuestion();
  }, 1000);
}

function checkAnswer(selected, correct, choicesList) {
  clearInterval(timerInterval);
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => {
    if (b.innerText.trim() === correct.trim()) b.classList.add("correct");
    if (b.innerText.trim() === selected.trim() && selected.trim() !== correct.trim()) b.classList.add("incorrect");
  });

  if (selected.trim() === correct.trim()) {
    score++;
  } else {
    wrongAnswers.push({
      word: quiz[current].word,
      choices: choicesList,
      answer: correct
    });
    localStorage.setItem("wrongAnswers1300", JSON.stringify(wrongAnswers));
  }

  setTimeout(() => {
    current++;
    loadQuestion();
  }, 1000);
}

function loadQuestion() {
  if (current >= quiz.length) {
    document.body.innerHTML = `<h2>퀴즈 완료!</h2><p>점수: ${score}/${quiz.length}</p><br/><button onclick="retryWrong()">오답노트 다시 풀기</button>`;
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
  const shuffled = shuffle(options);

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  shuffled.forEach(opt => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, q.meaning, shuffled);
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
        markAnswer(null, q.meaning, shuffled);
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
