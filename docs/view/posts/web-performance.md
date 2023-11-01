---
layout: doc
date: 2022-12-15 21:18:08
description: Performance,Metrics
title: 網頁的效能指標及優化
---

<PageInfo/>

# 知道網頁有哪些效能指標嗎?

常常聽到網頁開發撰寫功能時，需要顧及效能及優化網頁效率等用詞，但我們真的知道如何去改善這些指標嗎?更進一步的說我們知道指標到底有那些嗎?
這些指標又各自代表著甚麼意義，需要我們如何調校呢?接下來我們一一的介紹並分析這些指標吧~

## 效能對使用者來說?

對使用者來說，網站的優劣，其實也不難分辨，就是網站載入的速度，使用上的流程體感是否順暢，頁面功能都能正常使用，畫面不會有跑版的情況發生，就已經足夠了。但這些簡單的評估方法，也就包含了許多的效能指標~

## First Contentful Paint(首次內容加載、繪製時間)

首次内容繪製 (FCP) 指標即测量頁面從開始加載到頁面内容(包含文本、圖片、canvas等...)的任何部分在視窗上完成渲染的時間，**但並非是所有內容。**
一個好的網頁FCP應該在1.8內被繪製，換句話說，即是在1.8秒內有任意內容被繪製到網頁上，讓使用者可以看到內容。

FCP可以使用F12的燈塔觀察，或是使用第三方套件測量，js也有提供相關效能api可供檢測，但有些特殊形況，可能會造成差異，需要特別注意。

> 優化FCP方法:
>
> 1. 消除阻塞渲染的资源(小心重排與垂繪)
> 2. 壓縮 CSS 大小(加載的速度)
> 3. 移除未使用的 CSS(tree shaking)
> 4. 預連接到所需的来源
> 5. 避免巨大的網路負載
> 6. Dom的大小控制
> 7. 關鍵請求數的控制(瀏覽器有上限，超過就要等待回傳)

## Largest Contentful Paint 最大内容繪製、最大視覺元素載入的时間

依據頁面首次開始加載的時間點来報告可視區域内可見的最大圖像或文本內容完成渲染的相對時間。
對於SEO来说最重要的指標~! 應在2.5秒内完成最大內容繪製，也就是讓使用者能盡快的看到網頁的重點圖像或文本。
載入的時間越快，則越能容易讓使用者留下使用。**注意在加載時，若當前元素被移除，則會重新計算加載時間**

> 優化LCP方法:
>
> 1. 優化[關鍵渲染路徑](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Critical_rendering_path)(CSSOM+DOM+布局等)
> 2. 優化css(不使用會重新計算的屬性)
> 3. 優化圖像(圖像大小控制、暫存等等..)
> 4. 優化js(控制js行數，使布局可以更快被運算出來)

## First Input Delay 首次輸入延遲

計算使用者第一次與網頁互動(點擊連結、點開下拉選單、填表格…etc)時的延遲時間。也就是使用者互動後產生反應的所需時間。
良好的輸入延遲應該控制在100毫秒內。主線程的任何處理都有可能影響此數值，需要好好控管，畢竟這代表該網站的第一印象。

> 優化FID方法:
>
> 1. 減少第三方代碼的影響
> 2. 减少 JavaScript 執行時間
> 3. 最小化主線程工作
> 4. 保持較低的HTTP請求數和較小的傳輸內容大小

## Time to Interactive 可交互時間 (TTI)

從開始加載到主要子資源完成渲染，並能夠快速、可靠地響應使用者輸入所需的時間。
良好的TTI應控制在五秒內，在SSR框架中因為頁面注入的時間較快，常導致頁面出現但功能無法執行的窘境，也是導致使用者耐心下降的原因之一。
為了解決這個問題有新的技術出現，例如[孤島架構](https://juejin.cn/post/7155300194773860382)，讓核心葉面組件，可以有更快的TTI，並兼顧SEO~

> 優化TTI方法:
>
> 1. 減少關鍵請求數量與大小
> 2. 減少第三方代碼的影響
> 3. 減少js執行時間
> 4. 預加載資源

## Total Blocking Time 總阻塞时间 (TBT)

意指FCP到TTI之間，主線程”塞住”的時間加總。也就是阻塞主線程并影響页面可用性的時間長短。
若主線程被阻塞超過50毫秒，就有可能會造成使用者的體驗下降。良好的TBT應控制在300毫秒內。

> 優化TBT方法:
>
> 1. 減少關鍵請求數量與大小
> 2. 減少第三方代碼的影響
> 3. 減少js執行時間

## Cumulative Layout Shift 累積布局偏移 (CLS)

衡量頁面點擊某些内容位置發生偏移後对頁面造成的影響，**CLS 為整個頁面生命周期內發生的所有意外布局偏移中最大的布局偏移分數。**
良好的CLS應控制在0.1以下。只要可視區域中可見元素的起始位置在兩帧之间發生了變更，這样的元素被視为不穩定元素。若要改變起始位置，可以使用transform屬性取代。

> 優化CLS方法:
>
> 1. **始终在您的圖片和視頻元素上包含尺寸属性，或通過使用CSS 長寬比容器之類的方式預留所需的空間**這種方法可以確保瀏覽器能夠在加載圖片期間在文檔中分配正确的空間大小。請
> 2. **非到必要切勿在現有內容的上方插入内容**確保發生的任何布局偏移都在預期中。
> 3. 多使用transform屬性，而非是那些會觸發[偏移的屬性](https://web.dev/debug-layout-shifts/)。

## 結論

在這些指標中，有幾個共通的重點，例如:請求的數量與大小，第三方套件的影響，布局重排重繪的時間，等等...都是我們開發者必須去注意的!
我們可以善用打包工具與框架套件的優勢，去優化這些指標，將這些要點放入我們的日常開發中，這樣網站就會更加可靠~

參考資料:
[google dev](https://web.dev/user-centric-performance-metrics/)