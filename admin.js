window.addEventListener('DOMContentLoaded', () => {
  const users = ["핑크도준", "킹도준"];
  const tbody = document.querySelector("#adminTable tbody");
  users.forEach(name => {
    const stats = JSON.parse(localStorage.getItem(name + "_stats") || "{}");
    const wrong = (stats.totalAttempts || 0) - (stats.totalCorrect || 0);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${stats.attendance || 0}</td>
      <td>${stats.totalCorrect || 0} / ${stats.totalAttempts || 0}</td>
      <td>${wrong}</td>
      <td>${stats.lastLoginTime || "기록 없음"}</td>`;
    tbody.appendChild(row);
  });
});
