# sample_words.json ロジック解説

**ファイル**: `data/sample_words.json`  
**作成日**: 2026-06-01  
**目的**: アプリ動作確認用の初期単語データ（10件）

---

## 概要

`sample_words.json` はアプリ起動時に読み込む初期データファイルです。
JSON（JavaScript Object Notation）形式で単語データを管理します。
実際の学習データは `localStorage` に保存されますが、このファイルは「初回起動時のサンプル」として使います。

---

## JSONとは

**J**ava**S**cript **O**bject **N**otationの略で、データを文字列として表現するフォーマットです。人間にも読みやすく、プログラムでも扱いやすい形式として、Webアプリで広く使われています。

```json
{
  "キー": "値"
}
```

**基本ルール**

| ルール | 例 |
|--------|-----|
| キーは必ずダブルクォートで囲む | `"word"` |
| 文字列はダブルクォートで囲む | `"allocate"` |
| 数値はそのまま書く | `0` |
| 真偽値は小文字 | `true` / `false` |
| 値がない場合は | `null` |
| 配列は `[]` で囲む | `["a", "b"]` |
| オブジェクトは `{}` で囲む | `{"key": "value"}` |

---

## データ構造

ファイル全体は**配列**（`[]`）で、その中に**単語オブジェクト**（`{}`）が並んでいます。

```
[          ← 配列の開始
  { ... }, ← 単語オブジェクト1件目
  { ... }, ← 単語オブジェクト2件目
  ...
]          ← 配列の終了
```

---

## 単語オブジェクトの各フィールド解説

```json
{
  "id": "w_001",
  "word": "allocate",
  "pos": "v.",
  "meaning": "〜を割り当てる、配分する",
  "example": "The budget was allocated to three departments.",
  "example_ja": "予算は3つの部署に配分された。",
  "category": "Part7",
  "status": "new",
  "miss_count": 0,
  "correct_count": 0,
  "last_reviewed": null
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | 文字列 | ユニークID。`w_001` のように連番で管理。更新・削除時に使う |
| `word` | 文字列 | 英単語または熟語 |
| `pos` | 文字列 | 品詞。`v.`（動詞）`n.`（名詞）`adj.`（形容詞）`adv.`（副詞）`phrase`（熟語） |
| `meaning` | 文字列 | 日本語の意味 |
| `example` | 文字列 | 英語例文 |
| `example_ja` | 文字列 | 例文の日本語訳 |
| `category` | 文字列 | 出典。`Part7`・`金の読解` など |
| `status` | 文字列 | 学習ステータス。`new` / `learning` / `mastered` の3段階 |
| `miss_count` | 数値 | 「もう一度」を押した累計回数。多いほど苦手単語 |
| `correct_count` | 数値 | 「覚えた！」を押した累計回数 |
| `last_reviewed` | 文字列\|null | 最後に学習した日付（例: `"2026-06-01"`）。未学習は `null` |

---

## statusの3段階

```
new → learning → mastered
```

| ステータス | 条件 | 意味 |
|-----------|------|------|
| `new` | 初期値 | まだ一度も学習していない |
| `learning` | 1回以上学習した | 学習中 |
| `mastered` | `correct_count` が3以上かつ `miss_count` が0 | 習得済み・通常セッションから除外 |

---

## miss_count と correct_count の役割

この2つの値が**出題優先度アルゴリズム**に使われます。

```
優先度スコア = correct_count - (miss_count × 2)
```

スコアが低いほど優先して出題されます。

**具体例**

| 単語 | correct | miss | スコア | 出題順 |
|------|---------|------|--------|--------|
| 単語A | 0 | 3 | -6 | 最優先 |
| 単語B | 0 | 0 | 0 | 普通 |
| 単語C | 2 | 0 | +2 | 後回し |

---

## 初回データ読み込みの流れ（今後の実装予定）

```javascript
// 初回起動時にlocalStorageが空の場合、JSONを読み込んで保存する
fetch('data/sample_words.json')
  .then(res => res.json())
  .then(words => {
    if (getWords().length === 0) {
      saveWords(words);
    }
  });
```

1. `getWords()` でlocalStorageを確認
2. 空の場合（初回起動）→ `sample_words.json` を読み込む
3. `saveWords()` でlocalStorageに保存
4. 2回目以降はlocalStorageのデータをそのまま使う

---

## 単語を手動で追加するときのルール

新しい単語を追加する場合は以下を守ってください。

1. `id` は連番で重複しないようにする（`w_011`, `w_012` ...）
2. `status` は必ず `"new"` からスタート
3. `miss_count` と `correct_count` は必ず `0`
4. `last_reviewed` は必ず `null`
5. 最後の単語オブジェクトの後にカンマをつけない（JSONエラーになる）

```json
[
  { ... },  ← カンマあり
  { ... },  ← カンマあり
  { ... }   ← 最後はカンマなし！
]
```

---

## 今回登録した10件の単語一覧

| ID | 単語 | 品詞 | 意味 | カテゴリ |
|----|------|------|------|---------|
| w_001 | allocate | v. | 〜を割り当てる | Part7 |
| w_002 | in conjunction with | phrase | 〜と連携して | 金の読解 |
| w_003 | prominent | adj. | 著名な、目立つ | Part7 |
| w_004 | streamline | v. | 〜を合理化する | Part7 |
| w_005 | comply with | phrase | 〜に従う | 金の読解 |
| w_006 | deteriorate | v. | 悪化する | Part7 |
| w_007 | leverage | v. | 〜を活用する | 金の読解 |
| w_008 | eligible | adj. | 資格がある | Part7 |
| w_009 | forthcoming | adj. | 近々予定されている | 金の読解 |
| w_010 | reimburse | v. | 〜に払い戻す | Part7 |
