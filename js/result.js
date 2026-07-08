// result.js
// セッション完了画面の制御

document.addEventListener('DOMContentLoaded', () => {

  const progress = getProgress();
  const words = getWords();

  // 正解率を計算
  const studied = progress.studied;
  const correct = progress.correct;
  const miss = studied - correct;
  const percent = studied > 0 ? Math.round((correct / studied) * 100) : 0;

  // 数値を表示
  document.getElementById('score-percent').textContent = `${percent}%`;
  document.getElementById('result-studied').textContent = studied;
  document.getElementById('result-correct').textContent = correct;
  document.getElementById('result-miss').textContent = miss;

  // 正解率に応じたメッセージ
  const message = getResultMessage(percent);
  document.getElementById('result-message').textContent = message;

  // 苦手のみもう一度ボタン
  document.getElementById('retry-btn').addEventListener('click', () => {
    // miss_countが1以上の単語だけをセッションに入れる
    const missWords = words.filter(w => w.miss_count > 0 && w.status !== 'mastered');
    if (missWords.length === 0) {
      alert('苦手な単語はありません！');
      return;
    }
    // localStorageに苦手リストを一時保存してstudy.htmlへ
    localStorage.setItem('toeic_retry_mode', 'true');
    window.location.href = 'study.html';
  });

  // ホームへ戻る
  document.getElementById('home-btn').addEventListener('click', () => {
    localStorage.removeItem('toeic_retry_mode');
    window.location.href = 'index.html';
  });

  // 次のセッションへ
  document.getElementById('next-btn').addEventListener('click', () => {
    // 本日の進捗をリセットせず、そのまま学習画面へ
    localStorage.removeItem('toeic_retry_mode');
    window.location.href = 'study.html';
  });

});

// ───────────────────────────────
// 正解率に応じたメッセージ
// ───────────────────────────────

function getResultMessage(percent) {
  if (percent === 100) return '🎉 パーフェクト！素晴らしいです！';
  if (percent >= 80) return '✨ よくできました！この調子で続けましょう！';
  if (percent >= 60) return '👍 いい感じです！苦手単語を復習しましょう。';
  return '💪 もう一度苦手単語に挑戦しましょう！';
}