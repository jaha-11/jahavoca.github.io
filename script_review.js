
let quiz = JSON.parse(localStorage.getItem("wrongAnswers1300") || "[]");
let current = 0;
let score = 0;
let isPaused = false;
let timer;
let count = 5;

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseBtn").innerText = isPaused ? "▶" : "⏸";
}

function updateCounter() {
  document.getElementById("counter").innerText = `문제 ${current + 1}/${quiz.length}`;
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("timer");
  timerEl.innerText = count;
  timerEl.style.color = count <= 2 ? 'red' : count <= 4 ? 'orange' : 'green';
}

function nextQuestion() {
  if (!quiz || quiz.length === 0) {
    document.getElementById("question").innerText = "저장된 오답이 없습니다.";
    document.getElementById("choices").innerHTML = "";
    return;
  }

  if (current >= quiz.length) {
    alert("복습 완료!");
    return;
  }

  updateCounter();
  const currentItem = quiz[current];
  const correctAnswer = currentItem.answer;
  const choices = shuffle(currentItem.choices || [correctAnswer]);

  document.getElementById("question").innerText = currentItem.word;
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  choices.forEach(choice => {
    const div = document.createElement("div");
    div.className = "choice";
    div.innerText = choice;
    div.onclick = () => {
      const allChoices = document.querySelectorAll(".choice");
      allChoices.forEach(btn => {
        if (btn.innerText === correctAnswer) {
          btn.classList.add("correct");
        } else if (btn.innerText === choice) {
          btn.classList.add("incorrect");
        }
        btn.onclick = null;
      });

      clearInterval(timer);
      setTimeout(() => {
        current++;
        count = 5;
        nextQuestion();
      }, 1000);
    };
    choicesContainer.appendChild(div);
  });

  count = 5;
  updateTimerDisplay();
  clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused) {
      count--;
      updateTimerDisplay();
      if (count <= 0) {
        clearInterval(timer);
        current++;
        nextQuestion();
      }
    }
  }, 1000);
}

window.onload = () => {
  nextQuestion();
};
