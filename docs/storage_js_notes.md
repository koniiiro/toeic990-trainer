# storage.js ロジック解説

**ファイル**: `js/storage.js`  
**作成日**: 2026-05-31  
**目的**: localStorageの読み書きユーティリティ

---

## 概要

`storage.js` はアプリ全体のデータ保存・取得を一手に担うファイルです。
ブラウザの `localStorage` を使って、単語データ・学習進捗・設定の3種類のデータを管理します。

---

## 全体構造

```
storage.js
├── KEYS             定数：localStorageのキー名をまとめたオブジェクト
├── 単語データ関連
│   ├── getWords()       全単語を取得
│   ├── saveWords()      全単語を保存
│   ├── addWord()        単語を1件追加
│   ├── updateWord()     単語を1件更新
│   └── deleteWord()     単語を1件削除
├── 学習進捗関連
│   ├── getProgress()            進捗を取得
│   ├── saveProgress()           進捗を保存
│   └── resetProgressIfNewDay()  日付が変わったらリセット
└── 設定関連
    ├── getSettings()    設定を取得
    └── saveSettings()   設定を保存
```

---

## 詳細説明

---

### 1. KEYS（定数オブジェクト）

```javascript
const KEYS = {
  WORDS:    'toeic_words',
  PROGRESS: 'toeic_progress',
  SETTINGS: 'toeic_settings',
};
```

**なぜ使うのか**

localStorageはキーと値のペアで保存します。キー名を文字列で直接書くと、タイポ（打ち間違い）が起きやすく、バグの原因になります。`KEYS.WORDS` のように定数にまとめることで、タイポを防ぎ、キー名を一箇所で管理できます。

**ポイント**

`const` で宣言しているので、後から上書きできません。定数として安全に使えます。

---

### 2. getWords()

```javascript
function getWords() {
  const data = localStorage.getItem(KEYS.WORDS);
  return data ? JSON.parse(data) : [];
}
```

**何をするのか**

localStorageから単語データを取得して返します。

**ロジックの流れ**

1. `localStorage.getItem('toeic_words')` でデータを取り出す
2. データがある場合 → `JSON.parse()` でJSON文字列をJavaScriptの配列に変換して返す
3. データがない場合（初回起動時など）→ 空の配列 `[]` を返す

**ポイント：三項演算子**

```javascript
return data ? JSON.parse(data) : [];
//     ↑条件   ↑trueの場合      ↑falseの場合
```

`if文` を1行で書く書き方です。`data` が `null` や空文字の場合はfalseとして扱われます。

**ポイント：JSON.parse()**

localStorageは文字列しか保存できません。配列やオブジェクトは自動的に文字列に変換されて保存されるため、取り出すときに `JSON.parse()` で元の形式に戻す必要があります。

---

### 3. saveWords()

```javascript
function saveWords(words) {
  localStorage.setItem(KEYS.WORDS, JSON.stringify(words));
}
```

**何をするのか**

単語の配列をlocalStorageに保存します。

**ポイント：JSON.stringify()**

JavaScriptの配列・オブジェクトをJSON文字列に変換します。`getWords()` の `JSON.parse()` と対になっています。

```
配列/オブジェクト → JSON.stringify() → 文字列（保存）
文字列（取得）   → JSON.parse()     → 配列/オブジェクト
```

---

### 4. addWord()

```javascript
function addWord(word) {
  const words = getWords();
  words.push(word);
  saveWords(words);
}
```

**何をするのか**

新しい単語を1件追加します。

**ロジックの流れ**

1. `getWords()` で現在の全単語を取得
2. `.push()` で新しい単語を配列の末尾に追加
3. `saveWords()` で上書き保存

**ポイント**

localStorageには「1件だけ追加する」という機能がないため、「全件取得 → 追加 → 全件保存」という手順を踏む必要があります。

---

### 5. updateWord()

```javascript
function updateWord(updatedWord) {
  const words = getWords().map(w =>
    w.id === updatedWord.id ? updatedWord : w
  );
  saveWords(words);
}
```

**何をするのか**

IDが一致する単語を更新します。

**ポイント：Array.map()**

配列の全要素を1つずつ処理して、新しい配列を返すメソッドです。

```javascript
// IDが一致する → 新しいデータに置き換え
// IDが一致しない → そのまま
w.id === updatedWord.id ? updatedWord : w
```

元の配列は変更せず、新しい配列を作って `saveWords()` で保存します。

---

### 6. deleteWord()

```javascript
function deleteWord(id) {
  const words = getWords().filter(w => w.id !== id);
  saveWords(words);
}
```

**何をするのか**

指定したIDの単語を削除します。

**ポイント：Array.filter()**

条件に一致する要素だけを残した新しい配列を返すメソッドです。

```javascript
// id が一致しない要素だけを残す = 一致する要素を除外する
w.id !== id
```

---

### 7. getProgress() / saveProgress()

```javascript
function getProgress() {
  const data = localStorage.getItem(KEYS.PROGRESS);
  return data ? JSON.parse(data) : {
    date:        '',
    studied:     0,
    correct:     0,
    session_ids: [],
  };
}
```

**何をするのか**

本日の学習進捗を取得します。データがない場合は初期値を返します。

**ポイント：初期値オブジェクト**

`getWords()` が空配列 `[]` を返すのと同様に、初回起動時のデフォルト値をここで定義しています。

---

### 8. resetProgressIfNewDay()

```javascript
function resetProgressIfNewDay() {
  const today    = new Date().toISOString().slice(0, 10);
  const progress = getProgress();
  if (progress.date !== today) {
    saveProgress({ date: today, studied: 0, correct: 0, session_ids: [] });
  }
}
```

**何をするのか**

日付が変わっていたら、進捗データを0にリセットします。

**ロジックの流れ**

1. `new Date().toISOString().slice(0, 10)` で今日の日付を `"2026-06-01"` 形式で取得
2. 保存済みの `progress.date` と比較
3. 違う場合（日付が変わっている）→ 進捗をリセットして保存

**ポイント：toISOString().slice(0, 10)**

```javascript
new Date().toISOString()
// → "2026-06-01T12:34:56.789Z"

.slice(0, 10)
// → "2026-06-01"  （先頭10文字だけ取り出す）
```

---

### 9. getSettings() / saveSettings()

```javascript
function getSettings() {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    show_example: false,
    card_order:   'priority',
    daily_goal:   20,
  };
}
```

**何をするのか**

アプリの設定を取得します。初回は以下のデフォルト値を返します。

| 設定キー | デフォルト値 | 意味 |
|---------|------------|------|
| `show_example` | `false` | カード表面に例文を表示しない |
| `card_order` | `'priority'` | 苦手単語を優先して出題 |
| `daily_goal` | `20` | 1日の目標枚数20枚 |

---

## まとめ：覚えておくべき3つのポイント

| ポイント | 内容 |
|---------|------|
| JSON変換 | 保存時は `JSON.stringify()`、取得時は `JSON.parse()` |
| 初期値 | データがないときのデフォルト値を必ず用意する |
| 全件操作 | localStorageは1件操作ができないため「取得→変更→保存」の手順を踏む |
