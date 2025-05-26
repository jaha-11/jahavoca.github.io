
const stored = localStorage.getItem("wrongWords");
let words = stored ? JSON.parse(stored) : [];
let index = 0, score = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQuestion() {
  if (words.length === 0) {
    document.getElementById("question").innerText = "오답이 없습니다.";
    return;
  }
  if (index >= words.length) index = 0;
  shuffle(words);
  const current = words[index++];
  document.getElementById("question-number").innerText = `${index} / ${words.length}`;
  document.getElementById("question").innerText = current.word;
  const choices = [...current.choices];
  shuffle(choices);
  const container = document.getElementById("choices");
  container.innerHTML = '';
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => {
      if (choice === current.meaning) {
        score++;
        btn.style.backgroundColor = "lightgreen";
      } else {
        btn.style.backgroundColor = "salmon";
      }
      setTimeout(showQuestion, 1000);
    };
    container.appendChild(btn);
  });
}

window.onload = () => {
  shuffle(words);
  showQuestion();
};
