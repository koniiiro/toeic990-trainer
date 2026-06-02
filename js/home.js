// home.js
// ホーム画面の表示処理

document.addEventListener('DOMContentLoaded', () => {

  // 日付が変わっていたら進捗をリセット
  resetProgressIfNewDay();

  // データ取得
  const words    = getWords();
  const progress = getProgress();
  const settings = getSettings();

  // 総登録数
  document.getElementById('total-count').textContent = words.length;

  // 今日の学習数
  document.getElementById('studied-count').textContent = progress.studied;

  // 目標枚数
  document.getElementById('goal-count').textContent = settings.daily_goal;

  // ステータス内訳
  const newWords      = words.filter(w => w.status === 'new').length;
  const learningWords = words.filter(w => w.status === 'learning').length;
  const masteredWords = words.filter(w => w.status === 'mastered').length;

  document.getElementById('new-count').textContent      = newWords;
  document.getElementById('learning-count').textContent = learningWords;
  document.getElementById('mastered-count').textContent = masteredWords;

  // ボタンのイベント
  document.getElementById('start-btn').addEventListener('click', () => {
    window.location.href = 'study.html';
  });

  document.getElementById('manage-btn').addEventListener('click', () => {
    window.location.href = 'manage.html';
  });

});