// manage.js
// 単語管理画面の制御

let editingId = null; // 編集中の単語ID（nullなら新規追加）

// ───────────────────────────────
// 初期化
// ───────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  renderWordList();

  // 追加ボタン
  document.getElementById('add-btn').addEventListener('click', () => {
    openModal(null);
  });

  // キャンセルボタン
  document.getElementById('cancel-btn').addEventListener('click', closeModal);

  // モーダル背景クリックで閉じる
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // 保存ボタン
  document.getElementById('save-btn').addEventListener('click', saveWord);

  // 検索
  document.getElementById('search-input').addEventListener('input', renderWordList);

  // カテゴリフィルター
  document.getElementById('category-filter').addEventListener('change', renderWordList);

  // ホームへ戻る
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

});

// ───────────────────────────────
// 単語一覧の描画
// ───────────────────────────────

function renderWordList() {
  const words    = getWords();
  const search   = document.getElementById('search-input').value.toLowerCase();
  const category = document.getElementById('category-filter').value;

  // フィルタリング
  const filtered = words.filter(w => {
    const matchSearch   = w.word.toLowerCase().includes(search) ||
                          w.meaning.toLowerCase().includes(search);
    const matchCategory = category === '' || w.category === category;
    return matchSearch && matchCategory;
  });

  const list = document.getElementById('word-list');

  if (filtered.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#aaa;padding:2rem;">単語が見つかりません</p>';
    return;
  }

  list.innerHTML = filtered.map(w => `
    <li class="word-item">
      <div class="word-item__info">
        <span class="word-item__word">${w.word}</span>
        <span class="word-item__pos">${w.pos}</span>
        <p class="word-item__meaning">${w.meaning}</p>
      </div>
      <span class="badge badge--${w.status === 'new' ? 'new' : w.status === 'mastered' ? 'mastered' : 'learning'}">
        ${w.status === 'new' ? 'new' : w.status === 'mastered' ? '習得' : '学習中'}
      </span>
      <div class="word-item__actions">
        <button class="btn-icon" onclick="openModal('${w.id}')">✏️</button>
        <button class="btn-icon btn-icon--delete" onclick="deleteWordById('${w.id}')">🗑️</button>
      </div>
    </li>
  `).join('');
}

// ───────────────────────────────
// モーダルを開く
// ───────────────────────────────

function openModal(id) {
  editingId = id;
  const modal = document.getElementById('modal-overlay');
  modal.classList.add('is-open');

  if (id) {
    // 編集モード
    const word = getWords().find(w => w.id === id);
    document.getElementById('modal-title').textContent       = '単語を編集';
    document.getElementById('input-word').value              = word.word;
    document.getElementById('input-pos').value               = word.pos;
    document.getElementById('input-meaning').value           = word.meaning;
    document.getElementById('input-example').value           = word.example || '';
    document.getElementById('input-example-ja').value        = word.example_ja || '';
    document.getElementById('input-category').value          = word.category || '';
  } else {
    // 新規追加モード
    document.getElementById('modal-title').textContent = '単語を追加';
    document.getElementById('input-word').value        = '';
    document.getElementById('input-pos').value         = 'v.';
    document.getElementById('input-meaning').value     = '';
    document.getElementById('input-example').value     = '';
    document.getElementById('input-example-ja').value  = '';
    document.getElementById('input-category').value    = '';
  }
}

// ───────────────────────────────
// モーダルを閉じる
// ───────────────────────────────

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('is-open');
  document.getElementById('input-word').classList.remove('is-error');
  document.getElementById('input-meaning').classList.remove('is-error');
  editingId = null;
}

// ───────────────────────────────
// 単語を保存（追加・編集）
// ───────────────────────────────

function saveWord() {
  const word    = document.getElementById('input-word').value.trim();
  const pos     = document.getElementById('input-pos').value;
  const meaning = document.getElementById('input-meaning').value.trim();
  const example    = document.getElementById('input-example').value.trim();
  const exampleJa  = document.getElementById('input-example-ja').value.trim();
  const category   = document.getElementById('input-category').value.trim();

  // バリデーション
  let hasError = false;
  if (!word) {
    document.getElementById('input-word').classList.add('is-error');
    hasError = true;
  }
  if (!meaning) {
    document.getElementById('input-meaning').classList.add('is-error');
    hasError = true;
  }
  if (hasError) return;

  if (editingId) {
    // 編集
    const words   = getWords();
    const current = words.find(w => w.id === editingId);
    updateWord({
      ...current,
      word, pos, meaning,
      example:    example,
      example_ja: exampleJa,
      category:   category,
    });
  } else {
    // 新規追加
    const words  = getWords();
    const lastId = words.length > 0
      ? parseInt(words[words.length - 1].id.replace('w_', ''))
      : 0;
    const newId  = `w_${String(lastId + 1).padStart(3, '0')}`;

    addWord({
      id: newId,
      word, pos, meaning,
      example:       example,
      example_ja:    exampleJa,
      category:      category,
      status:        'new',
      miss_count:    0,
      correct_count: 0,
      last_reviewed: null,
    });
  }

  closeModal();
  renderWordList();
}

// ───────────────────────────────
// 単語を削除
// ───────────────────────────────

function deleteWordById(id) {
  if (!confirm('この単語を削除しますか？')) return;
  deleteWord(id);
  renderWordList();
}