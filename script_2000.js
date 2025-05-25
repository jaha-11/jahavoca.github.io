
let quiz = quizData_2000.sort(() => Math.random() - 0.5)
  .filter((v, i, arr) => arr.findIndex(x => x.word === v.word) === i)
  .slice(0, 500);

let current = 0, correct = 0, attempts = 0;
let currentUser = localStorage.getItem("currentUser") || "guest";

function showQuestion() {
  if (current >= quiz.length) return;
  const q = quiz[current];
  document.getElementById("question").textContent = q.word;
  const choiceEl = document.getElementById("choices");
  choiceEl.innerHTML = "";
  let choices = [q.meaning];
  while (choices.length < 4) {
    const rand = quiz[Math.floor(Math.random() * quiz.length)].meaning;
    if (!choices.includes(rand)) choices.push(rand);
  }
  choices.sort(() => Math.random() - 0.5);
  for (let c of choices) {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.onclick = () => {
      attempts++;
      if (c === q.meaning) correct++;
      localStorage.setItem(currentUser + "_stats", JSON.stringify({
        totalCorrect: correct,
        totalAttempts: attempts,
        lastLoginTime: new Date().toLocaleString()
      }));
      current++;
      showQuestion();
    };
    choiceEl.appendChild(btn);
  }
}
window.onload = showQuestion;
