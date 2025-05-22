
let current = 0;
let score = 0;
function showQuestion() {
  const q = words[current];
  document.getElementById("question").textContent = q.eng;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}
function submitAnswer() {
  const userAns = document.getElementById("answer").value.trim().toLowerCase();
  const correctAns = words[current].kor.trim().toLowerCase();
  if (userAns === correctAns) {
    score++;
    document.getElementById("feedback").textContent = "정답이에요!";
  } else {
    document.getElementById("feedback").textContent = `틀렸어요. 정답은: ${correctAns}`;
  }
  current++;
  if (current < words.length) {
    setTimeout(showQuestion, 1000);
  } else {
    document.getElementById("quiz").innerHTML = `<h2>퀴즈 종료! 점수: ${score}/${words.length}</h2>`;
  }
}
window.onload = showQuestion;
