
const questions = [
  { word: "apple", choices: ["사과", "바나나", "의자", "하늘"], answer: "사과" },
  { word: "book", choices: ["책", "연필", "사탕", "바다"], answer: "책" },
  { word: "computer", choices: ["자동차", "컴퓨터", "전화기", "고양이"], answer: "컴퓨터" }
];
let current = 0, timer, count = 5;
const wrongAnswers = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  timerEl.innerText = count;
  timerEl.style.color = count <= 2 ? 'red' : count <= 4 ? 'orange' : 'green';
}

function nextQuestion() {
  if (current >= questions.length) {
    localStorage.setItem('wrongAnswers1300', JSON.stringify(wrongAnswers));
    alert('퀴즈 완료!');
    return;
  }
  const q = questions[current];
  document.getElementById('question').innerText = q.word;
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  shuffle(q.choices).forEach(choice => {
    const btn = document.createElement('div');
    btn.className = 'choice';
    btn.innerText = choice;
    btn.onclick = () => {
      if (choice === q.answer) {
        btn.style.borderColor = 'green';
      } else {
        btn.style.borderColor = 'red';
        wrongAnswers.push(q);
      }
      setTimeout(() => {
        current++;
        count = 5;
        nextQuestion();
      }, 1000);
    };
    choicesEl.appendChild(btn);
  });
  count = 5;
  updateTimerDisplay();
  clearInterval(timer);
  timer = setInterval(() => {
    count--;
    updateTimerDisplay();
    if (count <= 0) {
      clearInterval(timer);
      current++;
      setTimeout(nextQuestion, 1000);
    }
  }, 1000);
}

window.onload = () => nextQuestion();
