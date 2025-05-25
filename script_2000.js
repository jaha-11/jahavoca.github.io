
let quiz = [...quizData_2000];
let current = 0;
let correct = 0;
let attempts = 0;
let isPaused = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseBtn").textContent = isPaused ? "▶️" : "⏸";
}

function showQuestion() {
  if (isPaused) return setTimeout(showQuestion, 1000);

  const item = quiz[current % quiz.length];
  const qEl = document.getElementById("question");
  const cEl = document.getElementById("choices");
  qEl.textContent = item.word;
  cEl.innerHTML = "";

  const options = shuffle([item.meaning, "무작위1", "무작위2", "무작위3"]);
  options.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      attempts++;
      if (choice === item.meaning) correct++;
      current++;
      document.getElementById("counter").textContent = `${current}/500`;
      showQuestion();
    };
    cEl.appendChild(btn);
  });
}

shuffle(quiz);
showQuestion();
