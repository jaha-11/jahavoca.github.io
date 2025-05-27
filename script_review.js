
const questions = JSON.parse(localStorage.getItem('wrongAnswers1300') || '[]');
let current = 0, timer, count = 5;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)];
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateCounter() {
  document.getElementById('counter').innerText = `문제 ${current + 1}/${questions.length}`;
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  timerEl.innerText = count;
  timerEl.style.color = count <= 2 ? 'red' : count <= 4 ? 'orange' : 'green';
}

function nextQuestion() {
  if (current >= questions.length) {
    alert('복습 완료!');
    return;
  }
  updateCounter();
  const q = questions[current];
  document.getElementById('question').innerText = q.word;
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  shuffle(q.choices).forEach(choice => {
    const btn = document.createElement('div');
    btn.className = 'choice';
    btn.innerText = choice;
    btn.onclick = () => {
      if (choice === q.answer) btn.style.borderColor = 'green';
      else btn.style.borderColor = 'red';
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

window.onload = () => {
  if (!questions.length) {
    document.getElementById('question').innerText = '저장된 오답이 없습니다.';
    return;
  }
  nextQuestion();
};
