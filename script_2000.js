
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

function generateChoices(correctItem) {
  const wrongChoices = quiz
    .filter(q => q.meaning !== correctItem.meaning)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(q => q.meaning);
  return shuffle([...wrongChoices, correctItem.meaning]);
}

function showQuestion() {
  if (current >= 500) {
    document.getElementById("question").textContent = "🎉 퀴즈 완료!";
    document.getElementById("choices").innerHTML = "";
    return;
  }

  if (isPaused) return setTimeout(showQuestion, 1000);

  const item = quiz[current % quiz.length];
  const qEl = document.getElementById("question");
  const cEl = document.getElementById("choices");
  qEl.textContent = item.word;
  cEl.innerHTML = "";

  const options = generateChoices(item);
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
