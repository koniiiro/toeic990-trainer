// storage.js
// localStorageの読み書きユーティリティ

const KEYS = {
  WORDS:    'toeic_words',
  PROGRESS: 'toeic_progress',
  SETTINGS: 'toeic_settings',
};

// ───────────────────────────────
// 単語データ（toeic_words）
// ───────────────────────────────

// 全単語を取得
function getWords() {
  const data = localStorage.getItem(KEYS.WORDS);
  return data ? JSON.parse(data) : [];
}

// 全単語を保存
function saveWords(words) {
  localStorage.setItem(KEYS.WORDS, JSON.stringify(words));
}

// 単語を1件追加
function addWord(word) {
  const words = getWords();
  words.push(word);
  saveWords(words);
}

// 単語を1件更新
function updateWord(updatedWord) {
  const words = getWords().map(w =>
    w.id === updatedWord.id ? updatedWord : w
  );
  saveWords(words);
}

// 単語を1件削除
function deleteWord(id) {
  const words = getWords().filter(w => w.id !== id);
  saveWords(words);
}

// ───────────────────────────────
// 学習進捗（toeic_progress）
// ───────────────────────────────

function getProgress() {
  const data = localStorage.getItem(KEYS.PROGRESS);
  return data ? JSON.parse(data) : {
    date:        '',
    studied:     0,
    correct:     0,
    session_ids: [],
  };
}

function saveProgress(progress) {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

// 日付が変わっていたらリセット
function resetProgressIfNewDay() {
  const today    = new Date().toISOString().slice(0, 10);
  const progress = getProgress();
  if (progress.date !== today) {
    saveProgress({ date: today, studied: 0, correct: 0, session_ids: [] });
  }
}

// ───────────────────────────────
// 設定（toeic_settings）
// ───────────────────────────────

function getSettings() {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    show_example: false,
    card_order:   'priority',
    daily_goal:   20,
  };
}

function saveSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}
