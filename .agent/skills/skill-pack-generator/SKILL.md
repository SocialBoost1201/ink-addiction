---
name: skill-pack-generator
description: Skillをパッケージ化する。
---

# skill-pack-generator: Skillパッケージ化

複数のSkillをまとめたスキルパックを生成・配布する。

## パック構造

```
skill-pack-[name]/
  README.md         # パック概要・含まれるSkill一覧
  install.sh        # 一括インストールスクリプト
  skills/
    [skill-name]/
      SKILL.md
```

## install.sh テンプレート

```bash
#!/bin/bash
TARGET="${1:-.agent/skills}"
for dir in skills/*/; do
  skill=$(basename "$dir")
  cp -r "$dir" "$TARGET/$skill"
  echo "Installed: $skill"
done
```

## 配布方法

- GitHub Releases にzipで添付
- npm パッケージとして公開
