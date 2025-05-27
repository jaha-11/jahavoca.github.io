
const stored = localStorage.getItem("wrongWords_1300");
const wrongWords = stored ? JSON.parse(stored) : [];
let current = 0;
let score = 0;
let paused = false;
let timerInterval;

function showQuestion() {
  if (current >= wrongWords.length) {
    document.querySelector(".container").innerHTML = "<h2>복습 완료!</h2>";
    return;
  }

  const { word, meaning, choices } = wrongWords[current];
  document.getElementById("question").textContent = word;
  document.getElementById("counter").textContent = (current + 1) + "/" + wrongWords.length;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      clearInterval(timerInterval);
      if (choice === meaning) {
        btn.style.backgroundColor = "lightgreen";
      } else {
        btn.style.backgroundColor = "salmon";
        const correct = Array.from(choicesDiv.children).find(b => b.textContent === meaning);
        if (correct) correct.style.backgroundColor = "lightgreen";
      }
      setTimeout(() => {
        current++;
        showQuestion();
      }, 1000);
    };
    choicesDiv.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  let time = 5;
  const timer = document.getElementById("timer");
  timer.textContent = time;
  timer.style.color = "green";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (paused) return;
    time--;
    timer.textContent = time;
    if (time === 3) timer.style.color = "orange";
    if (time === 1) timer.style.color = "red";
    if (time <= 0) {
      clearInterval(timerInterval);
      current++;
      showQuestion();
    }
  }, 1000);
}

function togglePause() {
  paused = !paused;
  document.getElementById("pauseBtn").textContent = paused ? "▶" : "⏸";
}

showQuestion();
