---
title: 部落格大掃除 - 終於還了這筆技術債
description: 拖了超久的專案整理，終於在某個週末爆發了
icon: 'lucide:wrench'
gitTalk: true
date: 2026-02-10 20:00:00
read: '5'
navBadges:
  - value: New
    type: primary
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

![refactor](/images/smalltalk/blog-refactor.jpg)
> [image link](https://unsplash.com/photos/laptop-computer-showing-codes-zE007SNgcdE)

好啦，終於把這個部落格整理了一番。說真的，這些技術債已經欠超久，每次看到都跟自己說「下次再弄」，結果一拖就是好幾個月... 我真的很會拖 😅

## 起因：看到警告就心煩

某天心血來潮跑了一下 `pnpm audit`，結果螢幕上跳出 **43 個安全性漏洞**，其中 18 個還是 High 等級的。當下整個人都不好了 QQ

雖然知道大部分是間接依賴的問題，但那一整排紅字看了就很阿雜。

還有一些早就該處理的事：

- **敏感資訊裸奔** - PostHog Key、Gitalk Secret 直接寫在 config 裡，想到就覺得不妙
- **nuxt.config.ts 肥到爆** - 整整 235 行欸，每次要找東西都滑到手痠
- **檔名打錯** - `error-handler.ts.ts`，對，兩個 `.ts`，我也不知道當初在想什麼 🤦

::alert{type="warning" icon="lucide:alert-triangle"}
技術債就像信用卡，拖越久利息越高啊...
::

## 好吧，來還債了

這次重構主要分三塊：

### 1. 先把套件升一升

首先處理那些老舊的依賴：

| 套件 | 之前 | 之後 |
|------|------|------|
| Vue | 3.5.16 | 3.5.28 |
| @nuxt/image | 1.10.0 | 2.0.0 |
| @antfu/eslint-config | 4.14.1 | 7.4.2 |
| posthog-js | 1.210.2 | 1.345.2 |

升級過程踩了一個雷：`shadcn-docs-nuxt` 升到 1.1.9 之後 build 直接炸掉，查了一下是跟目前 Nuxt 3 有相容性問題。沒辦法，只好先退回 1.0.2，等之後再說。

升完之後漏洞從 43 個降到 35 個，雖然沒有清乾淨，但至少好多了。

### 2. 敏感資訊搬到環境變數

把 GA、PostHog、Gitalk 這些 Key 通通搬到 `.env`，再用 Nuxt 的 `runtimeConfig` 讀進來。這樣敏感資訊不會被 commit，不同環境也能用不同設定。基本操作，但之前一直沒做 🙈

### 3. 把肥滋滋的 config 拆開

235 行的 `nuxt.config.ts` 實在看了很煩，決定拆成小塊：

```
config/
├── index.ts    # 統一匯出
├── image.ts    # 圖片設定
├── nitro.ts    # 伺服器設定
└── vite.ts     # 建置設定
```

拆完之後主檔剩大概 100 行，清爽超多。

## 順手處理的雜事

既然都在整理了，就把其他小事也一起搞定：

- **加了 lint 跟 typecheck** - 之前居然沒有這兩個 script，難怪程式碼亂七八糟
- **ESLint 忽略 Markdown** - 不然一堆假警告看了很煩
- **自動修了 522 個 lint 錯誤** - 跑一次 `--fix` 就解決，早知道就早點弄

## 整理完的感想

花了大概半天時間，但真的值得：

::alert{type="success" icon="lucide:check-circle"}
**成果：**
- 安全性漏洞少了 19%
- 程式碼結構清楚多了
- 終於有自動檢查了

**心情：**
- 不用再看那些紅字警告了
- 對這個專案更有信心了
::

說真的，這些事早就該做。但人就是這樣，總是先處理「緊急」的事，「重要但不緊急」的就一直拖。這次經驗讓我深刻體會：**技術債真的要定期還**。

## 給未來的自己

最後提醒一下自己（還有你）：

1. **每個月跑一次 `pnpm audit`** - 別等問題堆成山
2. **敏感資訊一定用環境變數** - 這個沒得商量
3. **Config 超過 150 行就該拆了** - 不然維護起來很痛苦
4. **善用 `--fix`** - 很多問題一鍵就能解決

::alert{type="info" icon="lucide:lightbulb"}
技術債不可怕，可怕的是假裝看不見。
::

---

好啦，這次整理就分享到這。如果你的專案也有類似問題，找個週末花點時間處理一下吧。整理完那種清爽感，真的很讚 ✨

有問題歡迎留言討論～
