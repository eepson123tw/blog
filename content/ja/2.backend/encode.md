---
title: 利Encode、Decode、Hash 是幹甚麼東西?
description:  編碼、解碼、加密
icon: 'lucide:lock-keyhole'
gitTalk: false
date: 2023-10-11 23:50:24
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Encode、Decode、Hash

最近同事為了一個需求而苦惱，想要把 URI 上的資料存入前端框架中並能反向讀入儲存字串在反導出 URI，卻發現轉入框架時，資料無法按照他的想法轉換，
同事們討論的過程，聽到了幾個關鍵字，於是想記錄下來 ~

## Encode（編碼）

編碼是指將數據從一種形式轉換為另一種形式的過程，以便在不同系統或環境中進行傳輸或存儲。

- URL 編碼 (URL encoding) : URL 編碼用於將URL中的特殊字符轉換為百分比編碼，以便在網址中進行安全傳輸(RFC 3986)。

```javascript
const originalString = 'Hello, js!';
const encodedString = encodeURIComponent(originalString);
console.log(encodedString); // "Hello%2C%20js!"
```

- Base64 編碼 (Base64 encoding) : Base64 編碼將二進制數據轉換為一種文本表示形式，以便在文本協議中(RFC 4648)傳輸二進制數據，如圖像或音頻文件。

```javascript
const originalString = 'Hello, js!';
const encodedString = btoa(originalString);
const decodedString = atob(encodedString);
console.log(encodedString); // "SGVsbG8sIGpzIQ==
console.log(decodedString); // "Hello, js!"
```

- [btoa](https://developer.mozilla.org/zh-CN/docs/Web/API/btoa)
- [atob](https://developer.mozilla.org/zh-CN/docs/Web/API/atob)

::alert{type='info'}
SSH 密鑰本身以二進制格式存在，但在特定情況下，它們的`公鑰部分可以以 Base64 編碼的文本形式表示`。
> cat XXXX_xxx | base64 | tr -d \\n
::

- HTML 編碼 (HTML encoding) :HTML 編碼用於將HTML文件中的特殊字符轉換為HTML實體，以避免它們被解釋為HTML標記。這有助於防止HTML注入攻擊。

```javascript
// 類似所謂的跳脫字元、除了自行實現，也可以使用第三方 library 達成 Lodash、DOMPurify、he。
function encodeHTML(text) {
  return text.replace(/&/g, '&amp').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const originalString = '<script>alert(\'Hello, js!\');</script>';
const encodedString = encodeHTML(originalString); // 自定義HTML編碼函數
console.log(encodedString); // "&lt;script&gt;alert('Hello, js!');&lt;/script&gt;"
```

### 字符編碼

用於將文本字符映射到二進制數據以便在計算機中儲存和傳輸。

::alert{type='info'}

**ASCII** (American Standard Code for Information Interchange):

1. ASCII 是一個字符編碼標準，最早於1963年發布，僅定義了128個字符（7位二進制數據），包括26個大寫字母、26個小寫字母、數字、標點符號和控制字符。
2. ASCII 不包括非英語字符，因此無法表示多語言文字。
3. ASCII 字符在計算機系統中佔用1個字節（8位）的存儲空間。

**UTF-8** (Unicode Transformation Format - 8-bit)

1. UTF-8 是一個可變長字符編碼標準，最早於1993年發布，它是 Unicode `萬國碼`的一種實現方式。
2. UTF-8 支持世界上幾乎所有的字符，`包括 ASCII 字符，以及多語言字符、符號和表情符號`。
3. UTF-8 中的字符可以使用1至4個字節來表示，具體的字節數取決於字符的 Unicode 編碼。
4. UTF-8 是當前最常用的字符編碼，用於互聯網通信、數據存儲、軟件開發等。

::

## Decode（解碼）

是編碼的反向過程，它將已編碼的數據轉換回其原始形式。解碼的目的是還原編碼過的數據，以便能夠正確讀取或處理它們。

```javascript
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
const encodedString = '&lt;script&gt;alert(\'Hello, js!\');&lt;/script&gt;';
const decodedString = decodeHTML(encodedString); // 自定義HTML解碼函數
console.log(decodedString); // "<script>alert('Hello, js!');</script>"
```

## Hash（哈希）

哈希是一種將任意大小的數據轉換為固定大小散列值的過程。哈希函數通常用於加密、數據完整性檢查、數據結構（如哈希表）等場合。

實做一個 hash 函式:

```javascript
function _hash(key) {
  let hashInt = 0;
  if (typeof key !== 'string') {
    throw new TypeError('oh! need string type to insert to memory');
  }
  for (let i = 0; i < key.length; i++) {
    hashInt += key.charCodeAt(i) * i;
  }
  return hashInt % size;
}
```

:::tip
如何實現一個數據結構 [hash table](https://codepen.io/eepson123tw/pen/dywGdRg)
:::

### 常見的 HASH 函式

- MD5（Message Digest Algorithm 5）:

 > MD5是一種128位哈希函數，通常用於生成數據的校驗和檢測數據完整性。然而，由於它容易受到碰撞攻擊，現在不再被推薦用於安全應用程序。

- SHA-1（Secure Hash Algorithm 1）:

> SHA-1是一種160位哈希函數，用於安全性要求不太高的應用中。然而，它已經被發現存在碰撞攻擊漏洞，因此也不再安全。

- SHA-256（Secure Hash Algorithm 256）:

> SHA-256是SHA-2家族中的一員，生成256位散列值。它在當今的加密和安全應用中非常常見，用於保護數據完整性和加密密鑰。

- SHA-3（Secure Hash Algorithm 3）:

> SHA-3是一個新的SHA家族，與SHA-2不同。它提供了不同的設計，並且在一些安全應用中被廣泛使用。

- bcrypt:

> bcrypt是一個專門用於存儲密碼的哈希函數。它使用適合於安全存儲的鹽（salt）和遞迴計算，以增加安全性。

- PBKDF2（Password-Based Key Derivation Function 2）:

> PBKDF2是一種基於密碼的金鑰派生函數，用於將密碼轉換為密鑰。它通常用於加密存儲和身份驗證。

- HMAC（Hash-based Message Authentication Code）:

> HMAC是一種使用特定哈希函數的訊息認證碼，通常用於驗證消息的完整性和真實性。它可以與不同的哈希函數一起使用。

- CRC32（Cyclic Redundancy Check）:

> CRC32是一種循環冗餘檢查哈希函數，主要用於校驗數據完整性。它通常不用於安全性要求高的應用。

## VUE URI 的問題解法

其實很簡單可以透過 `vue-router`，取得目前 query 或是 params，在透過 JS 原生方法進行編碼及解碼，得到資料後透過 Reference 中的 URLSearchParams 反導取回資料~

## Reference

- [Unicode-萬國碼](https://zh.wikipedia.org/zh-tw/Unicode)
- [Base64](https://www.redhat.com/sysadmin/base64-encoding)
- [Base64 encoded =](https://stackoverflow.com/questions/6916805/why-does-a-base64-encoded-string-have-an-sign-at-the-end)
- [簡介編碼與加密](https://mileschou.me/ironman/11th/authentication/day08/)
- [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986#section-2.1)
- [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [vue-js-using-urlsearchparams](https://stackoverflow.com/questions/74230976/vue-js-using-urlsearchparams-is-showing-me-error)
- [雜湊函數](https://zh.wikipedia.org/zh-tw/%E6%95%A3%E5%88%97%E5%87%BD%E6%95%B8)
