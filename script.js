
let current = 0;
let score = 0;
let isPaused = false;
let timer;
let count = 5;
const wrongAnswers = [];

function shuffle(array) {
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
  document.getElementById("counter").innerText = `${current + 1}/500`;
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("timer");
  timerEl.innerText = count;
  timerEl.style.color = count <= 2 ? 'red' : count <= 4 ? 'orange' : 'green';
}

function nextQuestion() {
  if (current >= quizData.length) {
    alert("퀴즈 완료!");
    localStorage.setItem("wrongAnswers1300", JSON.stringify(wrongAnswers));
    return;
  }

  updateCounter();
  const currentItem = quizData[current];
  const correctAnswer = currentItem.meaning;

  const distractors = quizData
    .filter((item, index) => index !== current)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(item => item.meaning);

  const choices = shuffle([correctAnswer, ...distractors]);

  document.getElementById("question").innerText = currentItem.word;
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  choices.forEach(choice => {
    const div = document.createElement("div");
    div.className = "choice";
    div.innerText = choice;
    div.onclick = () => {
      if (choice === correctAnswer) {
        div.style.borderColor = "green";
      } else {
        div.style.borderColor = "red";
        wrongAnswers.push({
          word: currentItem.word,
          choices: choices,
          answer: correctAnswer
        });
        localStorage.setItem("wrongAnswers1300", JSON.stringify(wrongAnswers));
      }

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
        // 시간 초과도 오답으로 처리
        wrongAnswers.push({
          word: currentItem.word,
          choices: choices,
          answer: correctAnswer
        });
        localStorage.setItem("wrongAnswers1300", JSON.stringify(wrongAnswers));
        current++;
        setTimeout(nextQuestion, 1000);
      }
    }
  }, 1000);
}

window.onload = () => {
  nextQuestion();
};
