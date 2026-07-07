// study.js
// 学習画面の制御

let session = [];      // 今回のセッションの単語リスト
let current = 0;       // 現在のカードのインデックス
let isFlipped = false; // カードが裏返っているか

// ───────────────────────────────
// 初期化
// ───────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // セッション単語を準備
  session = buildSession();

  if (session.length === 0) {
    alert('学習できる単語がありません。単語を追加してください。');
    window.location.href = 'index.html';
    return;
  }

  showCard(current);
  updateProgress();

  // カードフリップ
  document.getElementById('card').addEventListener('click', flipCard);

  // 発音ボタン（表・裏）
  document.getElementById('speak-btn').addEventListener('click', (e) => {
    e.stopPropagation(); // カードフリップを防ぐ
    speakWord(session[current].word);
  });
  document.getElementById('speak-btn-back').addEventListener('click', (e) => {
    e.stopPropagation();
    speakWord(session[current].example);
  });

  // 仕分けボタン
  document.getElementById('correct-btn').addEventListener('click', () => handleJudge(true));
  document.getElementById('miss-btn').addEventListener('click', () => handleJudge(false));

  // ホームへ戻る
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // キーボード操作
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') flipCard();
    if (e.key === 'ArrowRight') handleJudge(true);
    if (e.key === 'ArrowLeft') handleJudge(false);
  });

});

// ───────────────────────────────
// セッション構築
// ───────────────────────────────

function buildSession() {
  const words = getWords();
  const settings = getSettings();

  // masteredを除外
  let candidates = words.filter(w => w.status !== 'mastered');

  // 優先度スコアで並べ替え（低いほど優先）
  candidates.sort((a, b) => {
    const scoreA = a.correct_count - (a.miss_count * 2);
    const scoreB = b.correct_count - (b.miss_count * 2);
    return scoreA - scoreB;
  });

  // 目標枚数だけ取り出す
  return candidates.slice(0, settings.daily_goal);
}

// ───────────────────────────────
// カード表示
// ───────────────────────────────

function showCard(index) {
  const word = session[index];

  document.getElementById('card-pos').textContent = word.pos;
  document.getElementById('card-word').textContent = word.word;
  document.getElementById('card-meaning').textContent = word.meaning;
  document.getElementById('card-example').innerHTML = highlightWord(word.example, word.word);
  document.getElementById('card-example-ja').textContent = word.example_ja;

  // カードをリセット（表面に戻す）
  const card = document.getElementById('card');
  card.classList.remove('is-flipped');
  isFlipped = false;
}

// ───────────────────────────────
// カードフリップ
// ───────────────────────────────

function flipCard() {
  const card = document.getElementById('card');
  card.classList.toggle('is-flipped');
  isFlipped = !isFlipped;
}

// ───────────────────────────────
// 仕分け処理
// ───────────────────────────────

function handleJudge(isCorrect) {
  const word = session[current];

  // データ更新
  if (isCorrect) {
    word.correct_count += 1;
    word.status = 'learning';
    // 3回連続正解でmastered
    if (word.correct_count >= 3 && word.miss_count === 0) {
      word.status = 'mastered';
    }
  } else {
    word.miss_count += 1;
    word.status = 'learning';
    // セッション末尾に再挿入
    session.push(word);
  }

  word.last_reviewed = new Date().toISOString().slice(0, 10);
  updateWord(word);

  // 進捗を更新
  const progress = getProgress();
  progress.studied += 1;
  if (isCorrect) progress.correct += 1;
  saveProgress(progress);

  // 次のカードへ
  current += 1;

  if (current >= session.length) {
    // セッション完了
    window.location.href = 'result.html';
  } else {
    showCard(current);
    updateProgress();
  }
}

// ───────────────────────────────
// プログレスバー更新
// ───────────────────────────────

function updateProgress() {
  const total = session.length;
  const percent = Math.round((current / total) * 100);

  document.getElementById('progress-text').textContent = `${current + 1} / ${total}`;
  document.getElementById('progress-fill').style.width = `${percent}%`;
}

// ───────────────────────────────
// 例文内の単語をハイライト
// ───────────────────────────────

function highlightWord(example, word) {
  if (!example || !word) return example;
  // 大文字小文字を区別せずに該当単語を検索して色付け
  const regex = new RegExp(`(${word})`, 'gi');
  return example.replace(regex, '<span class="highlight">$1</span>');
}