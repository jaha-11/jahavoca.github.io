
let selectedVoice = null;

// 음성 목록 로딩 시 처리
window.speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  selectedVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) ||
                  voices.find(v => v.lang === 'en-US') ||
                  null;
};

// 발음 함수
function speak(text) {
  try {
    const cleaned = text
      .replace(/\([^)]*\)/g, "")   // 괄호 제거
      .replace(/[가-힣]/g, "")       // 한글 제거
      .replace(/\s+/g, " ")         // 공백 정리
      .trim();

    if (cleaned.length > 0) {
      const utter = new SpeechSynthesisUtterance(cleaned);
      utter.lang = 'en-US';
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = 1;
      utter.pitch = 1;
      speechSynthesis.speak(utter);
    }
  } catch (e) {
    console.warn("발음 오류:", text, e);
  }
}
