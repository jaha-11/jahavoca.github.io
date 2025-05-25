
const allowedUsers = {
  "핑크도준": "1107",
  "킹도준": "0101"
};

function login() {
  const nickname = document.getElementById("nickname").value.trim();
  const password = document.getElementById("password").value.trim();
  if (allowedUsers[nickname] && allowedUsers[nickname] === password) {
    localStorage.setItem("nickname", nickname);
    window.location.href = "quiz_withmaster.html";
  } else {
    alert("닉네임 또는 비밀번호가 올바르지 않습니다.");
  }
}
