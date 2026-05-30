# データ設計書

**プロジェクト名**: TOEIC 990 Vocabulary Trainer  
**バージョン**: 1.0  
**作成日**: 2026-05-30

---

## 1. データ保存方式

ブラウザの `localStorage` を使用する。キーと値（JSON文字列）のペアで管理。

| localStorage キー | 内容 |
|------------------|------|
| `toeic_words` | 単語データ一覧（配列） |
| `toeic_progress` | 本日の学習進捗 |
| `toeic_settings` | アプリ設定 |

---

## 2. 単語データ（`toeic_words`）

### 型定義

```js
// Word オブジェクト
{
  id: string,           // ユニークID（例: "w_001"）
  word: string,         // 英単語・熟語（例: "allocate"）
  pos: string,          // 品詞（例: "v.", "n.", "adj.", "adv.", "phrase"）
  meaning: string,      // 日本語の意味（例: "〜を割り当てる"）
  example: string,      // 英語例文
  example_ja: string,   // 例文の日本語訳
  category: string,     // カテゴリ（例: "Part7", "金の読解", "語彙"）
  status: string,       // 学習ステータス: "new" | "learning" | "mastered"
  miss_count: number,   // 「もう一度」を押した累計回数
  correct_count: number,// 「覚えた」を押した累計回数
  last_reviewed: string | null  // 最終学習日（ISO 8601形式: "2026-05-30"）
}
```

### サンプルデータ

```json
[
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
  },
  {
    "id": "w_002",
    "word": "in conjunction with",
    "pos": "phrase",
    "meaning": "〜と連携して、〜と合わせて",
    "example": "The campaign was run in conjunction with a local charity.",
    "example_ja": "そのキャンペーンは地元の慈善団体と連携して実施された。",
    "category": "金の読解",
    "status": "learning",
    "miss_count": 2,
    "correct_count": 1,
    "last_reviewed": "2026-05-29"
  }
]
```

---

## 3. 学習進捗データ（`toeic_progress`）

```js
{
  date: string,          // 本日の日付（"2026-05-30"）
  studied: number,       // 本日学習した枚数
  correct: number,       // 本日「覚えた」を押した枚数
  session_ids: string[]  // 本日出題した単語IDの配列
}
```

---

## 4. アプリ設定（`toeic_settings`）

```js
{
  show_example: boolean,   // カード表に例文を表示するか（デフォルト: false）
  card_order: string,      // 出題順: "random" | "priority"（苦手優先）| "sequential"
  daily_goal: number       // 1日の目標枚数（デフォルト: 20）
}
```

---

## 5. 出題アルゴリズム（優先度ロジック）

苦手単語を優先するため、以下のスコアを計算して昇順ソートする。

```
優先度スコア = correct_count - (miss_count × 2)
```

スコアが低いほど優先して出題される。同スコアの場合は `last_reviewed` が古い順。

| 状態 | スコア例 |
|------|----------|
| 一度も学習していない（new） | 0 |
| 1回正解・0回不正解 | +1 |
| 0回正解・2回不正解 | -4（最優先） |
| 3回連続正解 | +3 → mastered へ昇格 |

`correct_count` が 3 以上かつ `miss_count` が 0 の場合、`status` を `"mastered"` に更新し、通常セッションから除外する（復習モードのみ出題）。
