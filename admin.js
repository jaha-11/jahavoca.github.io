
function auth() {
  const pass = document.getElementById("adminPass").value;
  if (pass === "도준1004") {
    document.getElementById("content").style.display = "block";
    loadData();
  } else {
    alert("비밀번호가 틀렸습니다.");
  }
}

function loadData() {
  const dummy = [
    { nickname: "핑크도준", date: "2024-05-29", correct: 487, attempts: 500, time: "02:41:33" },
    { nickname: "킹도준", date: "2024-05-29", correct: 421, attempts: 500, time: "02:42:51" }
  ];

  const tbody = document.getElementById("dataBody");
  dummy.forEach(item => {
    const tr = document.createElement("tr");
    const wrong = item.attempts - item.correct;
    const row = `
      <td>${item.nickname}</td>
      <td>${item.date}</td>
      <td>${item.correct} / ${item.attempts}</td>
      <td>${wrong}</td>
      <td>${item.attempts > 0 ? "O" : "X"}</td>
      <td>${item.time}</td>
    `;
    tr.innerHTML = row;
    tbody.appendChild(tr);
  });
}
