---
name: unit-test-generator
description: テストコードを生成する。
---

# unit-test-generator: テスト生成

実装コードからユニットテスト・統合テストを生成する。

## テスト生成ルール

- Vitest / Jest を使用する
- `describe` / `it` 構造で記述する
- 正常系・異常系・境界値を網羅する
- モック設計を明示する

## テンプレート

```typescript
describe('関数名', () => {
  it('正常系: [期待する動作]', () => {
    // arrange
    // act
    // assert
  });
  it('異常系: [エラーケース]', () => {
    // ...
  });
});
```
