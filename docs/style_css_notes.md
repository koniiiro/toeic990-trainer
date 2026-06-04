# style.css 解説ノート

**ファイル**: `css/style.css`  
**作成日**: 2026-06-04  
**目的**: ホーム画面のデザイン・レイアウト

---

## 概要

`style.css` はアプリ全体の見た目を定義するファイルです。色・フォント・余白・角丸・影などを指定します。今回はホーム画面（`index.html`）を対象に、スマートフォン・PC両対応のデザインを実装しました。

---

## 全体構造

```
style.css
├── CSS変数（:root）    カラーパレット・角丸・影の定義
├── リセット            ブラウザ差異をなくす
├── body               全体レイアウト
├── .header            ヘッダー（タイトル・設定ボタン）
├── .main              メインコンテンツエリア
├── .stats             進捗サマリー
├── .status-badges     ステータスバッジ
├── .actions / .btn    アクションボタン
└── .footer            フッター
```

---

## 各セクションの解説

---

### 1. CSS変数（`:root`）

```css
:root {
  --color-primary:    #534AB7;
  --color-primary-lt: #EEEDFE;
  --color-success:    #2D7A3A;
  --radius-md:        10px;
  --shadow-sm:        0 1px 4px rgba(0,0,0,0.08);
}
```

**何をするのか**

アプリ全体で使う色・角丸・影を変数として定義します。

**なぜ使うのか**

色を変更したいとき、変数を1箇所直すだけで全体に反映されます。変数がないと同じ色を何十箇所も書き直すことになります。

**`:root` とは**

HTMLのルート要素（`<html>`）を指します。ここに変数を定義するとページ全体で使えます。

**命名規則**

```
--color-primary     メインカラー（濃い）
--color-primary-lt  メインカラーの薄い版（lt = light）
--shadow-sm         小さい影（sm = small）
--radius-md         中くらいの角丸（md = medium）
```

**カラーパレット一覧**

| 変数名 | 色コード | 用途 |
|--------|---------|------|
| `--color-primary` | #534AB7 | ボタン・見出し・アクセント |
| `--color-primary-lt` | #EEEDFE | バッジ背景など薄い紫 |
| `--color-success` | #2D7A3A | 「覚えた」ボタン・習得バッジ |
| `--color-danger` | #C0392B | 「もう一度」ボタン |
| `--color-text` | #1A1A1A | 本文テキスト |
| `--color-text-muted` | #AAAAAA | 補足テキスト・ラベル |
| `--color-bg` | #F7F7F5 | ページ背景 |
| `--color-bg-card` | #FFFFFF | カード・ヘッダー背景 |

---

### 2. リセット

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

**何をするのか**

ブラウザが勝手に設定するデフォルトスタイルを消します。

**`box-sizing: border-box`**

要素のサイズ計算方式を変更します。

```
デフォルト（content-box）:
  幅100px + padding20px = 実際の幅120px（はみ出す）

border-box:
  幅100px の中にpaddingが収まる = 実際の幅100px（はみ出さない）
```

レイアウトが崩れにくくなるため、ほぼ全てのプロジェクトで設定します。

**`*::before`, `*::after`**

疑似要素（CSSで追加できる装飾要素）にも同じ設定を適用します。

---

### 3. body — 全体レイアウト

```css
body {
  font-family: "Hiragino Sans", "Noto Sans JP", sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

**`font-family` のフォールバック**

```
"Hiragino Sans"  → Mac/iOSの日本語フォント
"Noto Sans JP"   → Windowsなどの日本語フォント
sans-serif       → どちらもなければブラウザ標準のゴシック体
```

左から順に使えるフォントを試します。

**`min-height: 100vh`**

`vh` はビューポート（画面）の高さを基準にした単位です。`100vh` = 画面の高さ100%。コンテンツが少なくてもフッターが画面下に来るようにします。

**`display: flex` + `flex-direction: column`**

bodyをフレックスコンテナにして、ヘッダー・メイン・フッターを縦並びにします。`.main` に `flex: 1` を指定することでメインが余白を埋めます。

---

### 4. ヘッダー

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

**`position: sticky`**

スクロールしてもヘッダーが画面上部に固定されます。`fixed` と違い、元のレイアウトを維持したまま固定されます。

**`z-index: 100`**

要素の重なり順を指定します。数値が大きいほど前面に表示されます。ヘッダーが他の要素の上に来るように大きな値を設定します。

**`transition: background 0.15s`**

ホバー時の背景色変化を0.15秒かけてなめらかにします。

---

### 5. 進捗サマリー（`.stats`）

```css
.stats {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
}

.stats__item {
  flex: 1;
  border-right: 1px solid var(--color-border);
}

.stats__item:last-child {
  border-right: none;
}
```

**`display: flex`**

3つの統計アイテムを横並びにします。

**`flex: 1`**

各アイテムが均等に幅を分け合います。3つあれば1/3ずつになります。

**`:last-child`**

最後の要素だけに適用するセレクターです。最後のアイテムには右ボーダーを表示しません（二重線を防ぐ）。

**`box-shadow`**

```css
box-shadow: 0 1px 4px rgba(0,0,0,0.08);
/*          ↑ ↑  ↑   ↑
            X Y ぼかし 色と透明度 */
```

---

### 6. バッジ

```css
.badge {
  border-radius: 999px;
}
```

**`border-radius: 999px`**

要素の高さより大きな値を指定すると完全な丸みになります。pill形（錠剤型）のバッジを作るときの定番テクニックです。

---

### 7. ボタン

```css
.btn:active {
  transform: scale(0.98);
  opacity: 0.85;
}
```

**`transform: scale(0.98)`**

ボタンを押したとき、少し小さくなるアニメーションです。物理的なボタンを押す感覚を再現します。

**`transition: opacity 0.15s, transform 0.1s`**

複数のプロパティにトランジションを指定できます。`,` で区切ります。

---

## まとめ：覚えておくべきポイント

| ポイント | 内容 |
|---------|------|
| CSS変数 | `--変数名` で定義、`var(--変数名)` で使う |
| `box-sizing: border-box` | paddingが要素幅に含まれる計算方式 |
| `display: flex` | 子要素を横並びにする |
| `flex: 1` | 余白を均等に分け合う |
| `position: sticky` | スクロールしても固定される |
| `border-radius: 999px` | pill形（丸いバッジ）を作るテクニック |
| `transform: scale()` | ボタンを押したときの縮小アニメーション |
| `:last-child` | 最後の要素だけに適用するセレクター |
| `vh` | ビューポート（画面）の高さを基準にした単位 |
| フォントのフォールバック | 使えるフォントを左から順に試す |
