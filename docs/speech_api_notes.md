# Web Speech API（発音機能）解説

**追加先ファイル**: `js/storage.js`  
**作成日**: 2026-05-31  
**目的**: 単語カードで英語発音を確認できるようにする

---

## 概要

ブラウザ標準搭載の **Web Speech API** を使って、英単語を音声で読み上げる機能です。外部サービス不要・費用ゼロで実装できます。

---

## コード

```javascript
function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang  = 'en-US';
  utterance.rate  = 0.9;
  speechSynthesis.speak(utterance);
}
```

---

## 各行の説明

### SpeechSynthesisUtterance（発話オブジェクト）

```javascript
const utterance = new SpeechSynthesisUtterance(word);
```

「何を読み上げるか」を定義するオブジェクトです。`word` に渡した文字列（例: `"allocate"`）が読み上げの対象になります。

---

### lang（言語設定）

```javascript
utterance.lang = 'en-US';
```

読み上げる言語を指定します。

| 値 | 言語 |
|----|------|
| `'en-US'` | アメリカ英語 |
| `'en-GB'` | イギリス英語 |
| `'ja-JP'` | 日本語 |

TOEICはアメリカ英語が基本なので `en-US` を使います。

---

### rate（読み上げ速度）

```javascript
utterance.rate = 0.9;
```

読み上げ速度を指定します。

| 値 | 速さ |
|----|------|
| `0.5` | かなりゆっくり |
| `0.9` | 少しゆっくり（今回の設定） |
| `1.0` | 標準速度 |
| `1.5` | 速め |

学習用なので少しゆっくりめの `0.9` にしています。

---

### speechSynthesis.speak()

```javascript
speechSynthesis.speak(utterance);
```

実際に読み上げを実行します。`speechSynthesis` はブラウザに標準で用意されているグローバルオブジェクトです。

---

## 使い方（今後の実装予定）

カード画面のスピーカーアイコンをクリック/タップしたときに呼び出します。

```javascript
// 例：ボタンをクリックしたら発音
document.getElementById('speak-btn').addEventListener('click', () => {
  speakWord('allocate');
});
```

---

## 対応ブラウザ

| ブラウザ | 対応 |
|---------|------|
| Chrome | ✅ |
| Safari | ✅ |
| Firefox | ✅ |
| Edge | ✅ |

ほぼ全ての主要ブラウザで動作します。

---

## まとめ

| ポイント | 内容 |
|---------|------|
| 費用 | 無料（ブラウザ標準機能） |
| 実装の手軽さ | 関数1つで完結 |
| カスタマイズ | `lang` で言語、`rate` で速度を調整可能 |
