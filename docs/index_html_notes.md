# index.html 解説ノート

**ファイル**: `index.html`  
**作成日**: 2026-06-02  
**目的**: ホーム画面のHTML骨格

---

## 概要

`index.html` はアプリを開いたときに最初に表示されるホーム画面です。HTMLの構造（骨格）を定義し、CSSで見た目を、JavaScriptで動きをつけます。

---

## 全体構造

```
index.html
├── <head>        メタ情報・CSS読み込み
├── <body>
│   ├── <header>  アプリタイトル・設定ボタン
│   ├── <main>
│   │   ├── .stats         進捗サマリー（今日学習・目標・総登録）
│   │   ├── .status-badges ステータス内訳（new・学習中・習得）
│   │   └── .actions       アクションボタン（学習スタート・単語を管理）
│   └── <footer>  コピーライト
├── <script> storage.js 読み込み
└── <script> home.js 読み込み
```

---

## 各パーツの解説

---

### 1. `<head>` — メタ情報

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**charset="UTF-8"**
日本語を正しく表示するための文字コード指定です。これがないと日本語が文字化けします。

**viewport**
スマートフォン対応（レスポンシブデザイン）に必須の設定です。`width=device-width` で端末の画面幅に合わせて表示します。

---

### 2. `<header>` — ヘッダー

```html
<header class="header">
  <h1 class="header__title">TOEIC 990 Trainer</h1>
  <button class="header__settings" aria-label="設定">⚙</button>
</header>
```

**`<h1>`**
ページの見出しです。SEOとアクセシビリティの観点から、1ページに1つだけ使います。

**`aria-label="設定"`**
スクリーンリーダー（視覚障害者向けの読み上げソフト）向けの説明です。アイコンだけのボタンには必ず付けます。

---

### 3. `.stats` — 進捗サマリー

```html
<section class="stats" aria-label="本日の進捗">
  <div class="stats__item">
    <span class="stats__num" id="studied-count">0</span>
    <span class="stats__label">今日学習</span>
  </div>
  ...
</section>
```

**`id="studied-count"`**
JavaScriptから数値を書き換えるための目印です。`home.js` でこのIDを使って数字を動的に表示します。

**初期値 `0`**
JavaScript読み込み前に一瞬表示される値です。`home.js` が実行されると正しい数値に書き換わります。

**`<section>` と `<div>` の違い**

| タグ | 用途 |
|------|------|
| `<section>` | 意味のあるまとまり（見出しがつくブロック） |
| `<div>` | 意味のない汎用ブロック（レイアウト用） |

---

### 4. `.status-badges` — ステータス内訳

```html
<span class="badge badge--new">new <span id="new-count">0</span></span>
<span class="badge badge--learning">学習中 <span id="learning-count">0</span></span>
<span class="badge badge--mastered">習得 <span id="mastered-count">0</span></span>
```

**BEM記法（`badge--new` など）**
CSSのクラス名の命名規則です。

```
badge          → Block（部品の名前）
badge--new     → Modifier（バリエーション）
badge__label   → Element（部品の中の要素）
```

色やスタイルのバリエーションを `--` でつなげて表現します。

---

### 5. `.actions` — アクションボタン

```html
<button class="btn btn--primary" id="start-btn">学習スタート</button>
<button class="btn btn--neutral" id="manage-btn">単語を管理</button>
```

**`<button>` タグを使う理由**
リンク（`<a>`）ではなくボタン（`<button>`）を使うのは、ページ遷移の処理をJavaScriptで制御するためです。キーボード操作やアクセシビリティにも有利です。

---

### 6. `<script>` — JS読み込み

```html
<script src="js/storage.js"></script>
<script src="js/home.js"></script>
```

**`</body>` の直前に置く理由**
HTMLが全部読み込まれてからJavaScriptを実行するためです。`<head>` に書くとHTMLより先にJSが実行され、要素が見つからないエラーが起きます。

**読み込み順が重要**
`storage.js` を先に読み込むのは、`home.js` が `storage.js` の関数（`getWords()` など）を使うからです。依存関係のあるファイルは先に読み込みます。

---

## まとめ：覚えておくべきポイント

| ポイント | 内容 |
|---------|------|
| `id` 属性 | JSから要素を取得するための目印 |
| `aria-label` | アクセシビリティのための説明テキスト |
| BEM記法 | `block--modifier` でCSSクラスを命名 |
| `<script>` の位置 | `</body>` 直前に置く |
| JS読み込み順 | 依存関係のあるファイルを先に読む |
