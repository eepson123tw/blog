---
title: SSE 數據流
description: SSE 單向數據流，伺服器推送訊息
icon: 'lucide:tangent'
gitTalk: false
date: 2023-3-25 22:37:00
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

受到 GPT 等一眾 Chatbot，可以帥帥地在前端回覆字串且有種打字機的帥氣感影響，

於是自己寫 Side Project 復刻時，用 api response 回傳一坨字串到前端，然後慢慢顯示到頁面上，想說就是這樣實現的吧。

查了資料後發現 -> 還有一種方式可以實現那就是今天的主角 `SSE` 🫠

## SSE Event 是什麼 `server sent event`

簡單來說是透過伺服器建立單向的數據連線，像是 `WebSocket` 那樣，建立長久的連線，但不同於 socket，SSE 是單向的數據傳送，客戶端無法交互，
只能被動的接收數據，像是影片直播等也是 steam 流的一種。

::alert{type="danger" icon="lucide:info"}
  需注意若使用非 HTTP/2 建立 SSE 連線的話，是有連接上限的，每個瀏覽器不管開多少個 Tab 分頁，每個域名只能連接六個連線。
	但若使用 HTTP/2 的話則可建立 100 個連線。
::

## SSE 的好處

- 輕量好使用且基於 HTTP 協議
- 瀏覽器普遍支援
- 支持斷線重連
- 支持自定義的傳送格式
- 能讓伺服器在任何時間更新頁面資料

::alert{type="info" icon="lucide:bulb"}
除了影片直播，SSE 還很適合用在這些地方：
- **即時通知：** 像是股票價格的更新、系統的告警通知等等。
- **進度條：** 顯示檔案上傳的進度，讓使用者更清楚目前的狀態。
- **串流日誌：** 伺服器即時將日誌推送到前端顯示。
::

  來看看前端怎麼簡單的接收 SSE 的資料吧：
  ```javascript
  const eventSource = new EventSource('/your-sse-endpoint');

  eventSource.onmessage = (event) => {
    console.log('收到資料啦：', event.data);
    // 你可以在這裡更新頁面上的內容，例如顯示 event.data
  };

  eventSource.onerror = (error) => {
    console.error('SSE 發生錯誤！', error);
  };

  上面的 `/your-sse-endpoint` 就是你後端提供 SSE 連線的網址。

```
[examples](https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_sse)

SSE 預設傳送的是純文字格式的資料，但其實也可以傳送 JSON ！

只要在後端設定 `Content-Type: text/event-stream`，然後在 `data` 欄位放 JSON 字串就可以了。
前端在 `event.data` 裡面收到的就會是字串，再用 `JSON.parse()` 轉一下就好啦！

因瀏覽器本身就有內建重連機制！如果連線斷掉了，會自動嘗試重新連線。可以在後端透過 `retry` 這個欄位來告訴瀏覽器下次重連的間隔時間 (時間單位是毫秒)。

## Nginx SSE 踩個坑

也是因為踩坑了，所以想深度的理解一下 SSE 的交互模式，簡單來說，遇到了在 local 時，SSE 的表現是正常的，能夠使用流的模式傳送資料到前端，
但上 Prod 了 Nginx 套上去之後，發現回吐的模式卡卡的，一查之下才發現，原來 Nginx Header 也要另外設置!!

若不設置以下 Header，瀏覽器則會有一些預設的行為，導致頁面卡卡的 🫠

- proxy_http_version 1.1

> SSE 依賴的是 HTTP 的長連接 (persistent connection)。雖然 HTTP/2 也支援長連接，但在這個情境下，明確地設定使用 HTTP/1.1 可以確保 Nginx 使用的是適合這種長連接的模式。有時候，預設的 HTTP 版本可能會導致一些意想不到的問題。
- proxy_set_header Connection ''

> 在一般的 HTTP 請求中，Nginx 可能會自動添加 Connection: close 這個 Header，告訴瀏覽器在這次請求完成後就關閉連線。但對於 SSE 來說，我們需要這個連線一直保持開啟，才能不斷接收伺服器推送的資料。
將 Connection 這個 Header 設置為空字串，可以阻止 Nginx 添加 Connection: close，確保連線不會被意外關閉。
- proxy_buffering off

> 預設情況下，Nginx 會啟用緩衝 (buffering)。這表示 Nginx 會先接收到一部分後端的資料，然後再一起發送給前端。對於一般的 API 來說，這可以提高效率。
但是，對於 SSE 來說，我們希望伺服器有新的資料就立刻推送到前端，而不是等 Nginx 緩衝了一段時間才一起發送。proxy_buffering off; 這個設定就是告訴 Nginx 不要緩衝後端的資料，一收到就立刻轉發給前端，這樣才能實現「流」的效果。這也是解決你遇到的「卡卡的」問題的關鍵！
- proxy_cache off

> 快取 (cache) 的目的是為了減少伺服器的負載，將一些不常變動的資料暫時儲存在 Nginx 上，下次有相同的請求就直接從快取中返回，不需要再向後端請求。
但對於 SSE 這種需要即時更新的資料流來說，如果 Nginx 快取了之前的回應，前端就無法接收到最新的資料了。所以，proxy_cache off; 就是告訴 Nginx 不要快取 SSE 的回應，確保前端總是能接收到最新的數據。

## 總結

透過簡單的介紹及範例程式碼，我們可以快速的了解到 stream 文字的實現方式，以及避免實作後跟想像的不一樣的問題～

## Reference

- [Using_server-sent_events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [阮一峰](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
