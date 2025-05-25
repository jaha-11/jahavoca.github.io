let quiz = quizData_2000
  .sort(() => Math.random() - 0.5)
  .filter((v, i, arr) => arr.findIndex(x => x.word === v.word) === i)
  .slice(0, 500);

let current = 0;
let correct = 0;
let attempts = 0;
let paused = false;
let interval;
let currentUser = localStorage.getItem("currentUser") || "guest";

function updateCounter() {
  document.getElementById("counter").textContent = (current + 1) + "/500";
}

function togglePause() {
  paused = !paused;
  document.getElementById("pauseBtn").textContent = paused ? "▶️" : "⏸";
}

function showQuestion() {
  if (current >= quiz.length) return endQuiz();
  const q = quiz[current];
  const choices = [q.meaning];
  while (choices.length < 4) {
    const rand = quiz[Math.floor(Math.random() * quiz.length)].meaning;
    if (!choices.includes(rand)) choices.push(rand);
  }
  choices.sort(() => Math.random() - 0.5);

  document.getElementById("question").textContent = q.word;
  const choiceContainer = document.getElementById("choices");
  choiceContainer.innerHTML = "";
  updateCounter();

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice;
    btn.onclick = () => handleAnswer(choice, q.meaning, btn);
    choiceContainer.appendChild(btn);
  });

  speakWord(q.word);
  startTimer();
}

function speakWord(word) {
  const msg = new SpeechSynthesisUtterance(word);
  msg.lang = "en-US";
  window.speechSynthesis.speak(msg);
}

function startTimer() {
  let t = 5;
  document.getElementById("timer").textContent = t;
  clearInterval(interval);
  interval = setInterval(() => {
    if (paused) return;
    t--;
    document.getElementById("timer").textContent = t;
    if (t <= 0) {
      clearInterval(interval);
      handleAnswer(null, quiz[current].meaning);
    }
  }, 1000);
}

function handleAnswer(selected, correctAnswer, btn) {
  clearInterval(interval);
  attempts++;
  if (selected === correctAnswer) {
    correct++;
    if (btn) btn.classList.add("correct");
  } else {
    if (btn) btn.classList.add("incorrect");
    saveWrong(quiz[current]);
  }

  const correctBtn = [...document.querySelectorAll(".choice")].find(b => b.textContent === correctAnswer);
  if (correctBtn) correctBtn.classList.add("correct");

  updateStats();
  setTimeout(() => {
    current++;
    showQuestion();
  }, 1000);
}

function saveWrong(q) {
  let list = JSON.parse(localStorage.getItem(currentUser + "_wrong") || "[]");
  list.push(q);
  localStorage.setItem(currentUser + "_wrong", JSON.stringify(list));
}

function updateStats() {
  const key = currentUser + "_stats";
  const data = JSON.parse(localStorage.getItem(key) || "{}");
  data.totalCorrect = correct;
  data.totalAttempts = attempts;
  localStorage.setItem(key, JSON.stringify(data));
}

function endQuiz() {
  document.getElementById("question").textContent = "퀴즈 완료!";
  document.getElementById("choices").innerHTML = "";
  document.getElementById("timer").textContent = "";
  updateStats();
}

window.onload = showQuestion;
