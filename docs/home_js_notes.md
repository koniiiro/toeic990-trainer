# home.js 解説ノート

**ファイル**: `js/home.js`  
**作成日**: 2026-06-02  
**目的**: ホーム画面の数値を動的に表示する

---

## 概要

`home.js` はホーム画面（`index.html`）の表示を制御するJavaScriptファイルです。`storage.js` の関数を使ってlocalStorageからデータを取得し、HTMLの数値を書き換えます。またボタンのクリックイベントも管理します。

---

## 全体構造

```
home.js
├── DOMContentLoaded イベント
│   ├── resetProgressIfNewDay()   日付リセット
│   ├── データ取得
│   │   ├── getWords()
│   │   ├── getProgress()
│   │   └── getSettings()
│   ├── HTML数値の書き換え
│   │   ├── 総登録数
│   │   ├── 今日の学習数
│   │   ├── 目標枚数
│   │   └── ステータス内訳（new・learning・mastered）
│   └── ボタンイベント
│       ├── 学習スタート → study.html
│       └── 単語を管理  → manage.html
```

---

## 各処理の解説

---

### 1. DOMContentLoaded イベント

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 処理
});
```

**何をするのか**

HTMLが全て読み込まれてから処理を実行するためのイベントです。

**なぜ必要か**

JavaScriptはHTMLより先に実行されることがあります。HTMLが読み込まれる前に `getElementById()` を呼び出すと、要素が見つからずエラーになります。`DOMContentLoaded` を使うことで「HTMLが準備できてから実行する」ことを保証します。

```
HTML読み込み完了 → DOMContentLoaded発火 → JS実行
```

---

### 2. データ取得

```javascript
const words    = getWords();
const progress = getProgress();
const settings = getSettings();
```

`storage.js` で定義した3つの関数を呼び出してデータを取得します。

| 変数 | 取得するデータ |
|------|--------------|
| `words` | 単語データの配列 |
| `progress` | 本日の学習進捗 |
| `settings` | アプリ設定（目標枚数など） |

---

### 3. HTML数値の書き換え

```javascript
document.getElementById('total-count').textContent = words.length;
```

**`getElementById()`**
指定したIDを持つHTML要素を取得します。`index.html` の `id="total-count"` の要素を取得しています。

**`textContent`**
要素のテキスト内容を書き換えるプロパティです。

```html
<!-- 書き換え前 -->
<span id="total-count">0</span>

<!-- 書き換え後（words.lengthが42の場合） -->
<span id="total-count">42</span>
```

**`words.length`**
配列の要素数を返します。単語が42件あれば `42` が返ります。

---

### 4. ステータス内訳の集計

```javascript
const newWords      = words.filter(w => w.status === 'new').length;
const learningWords = words.filter(w => w.status === 'learning').length;
const masteredWords = words.filter(w => w.status === 'mastered').length;
```

**`Array.filter()`**
条件に一致する要素だけを抽出した新しい配列を返します。

```javascript
// statusが'new'の単語だけを抽出 → その件数を取得
words.filter(w => w.status === 'new').length
```

**アロー関数 `w => ...`**
`function(w) { return ... }` を短く書いた形です。

```javascript
// 通常の書き方
words.filter(function(w) { return w.status === 'new'; })

// アロー関数（同じ意味）
words.filter(w => w.status === 'new')
```

---

### 5. ボタンのイベント処理

```javascript
document.getElementById('start-btn').addEventListener('click', () => {
  window.location.href = 'study.html';
});
```

**`addEventListener('click', ...)`**
ボタンがクリックされたときに実行する処理を登録します。

**`window.location.href`**
ページを別のURLに移動させます。`study.html` に遷移するリンクの役割を果たします。

---

## storage.js との関係

```
storage.js          home.js
─────────────────   ──────────────────────────
getWords()       ←  words    = getWords()
getProgress()    ←  progress = getProgress()
getSettings()    ←  settings = getSettings()
resetProgress... ←  resetProgressIfNewDay()
```

`home.js` は `storage.js` の関数を呼び出すだけで、localStorage の直接操作はしません。役割を分離することでコードが読みやすくなります。

---

## まとめ：覚えておくべきポイント

| ポイント | 内容 |
|---------|------|
| `DOMContentLoaded` | HTML読み込み完了後にJSを実行する |
| `getElementById()` | IDでHTML要素を取得する |
| `textContent` | 要素のテキストを書き換える |
| `Array.filter()` | 条件に合う要素だけを抽出する |
| `addEventListener` | イベント（クリックなど）を登録する |
| `window.location.href` | 別ページに遷移する |
