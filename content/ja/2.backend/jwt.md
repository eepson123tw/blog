---
title: JWT機制
description: JSON Web Tokens、Cryptography
icon: 'lucide:table-of-contents'
gitTalk: false
date: 2023-03-25 11:14:47
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---


> 什麼是JWT?

是一種開放標準Requests for comments(RFC)[7519](https://www.rfc-editor.org/rfc/rfc7519)，為了在各種端口安全傳輸JSON。JWT可以被驗證和信任，因為經過數位簽章及金鑰加密的過程(非對稱加密RSA、金鑰雜湊訊息鑑別碼 HMAC、橢圓曲線數位簽章算法 ECDSA)。旨在描述一組token(令牌)，可用於識別當前使用者身分。

## 對稱加密與不對稱加密

屬於密碼學(cryptography)的兩種加密方式(安全機制)，防禦來自現實網路世界的攻擊者，都有加密(encryption)與解密(decryption)兩種動作，但實作上有些許的不同。透過密鑰交換讓兩台電腦在密鑰上達到共識(確認收發者的身分)的算法。

- 對稱加密(symmetric encryption):雙方用一樣的密鑰加密和解密，並共享一個密鑰。
- 不對稱加密(asymmetric encryption):有一組公開密鑰及私有的密鑰，用公鑰加密後，只有有私鑰的人能解密。相反，用私鑰加密後也只有公鑰的擁有者能解密。避免有心人士，還會先行交換公鑰，並在加密數據中加上數位簽章，先用公鑰確認來源數據後，再進行解密。

## JWT是為了解決甚麼問題?有哪些應用呢?

解決了資訊傳遞上及認證使用者身分上的問題，當你登入了一個購物網站，絕對不希望任何有關你的機敏資訊暴露在登入端口上，這時我們的JWT就派上了用場，端口記憶的只會是一組進行過加密的token(內含使用者的身分訊息)，不會有其他多餘訊息，驗證上則會交給後端，確保安全性。加上其回傳的token令牌可以被程式語言解碼(映射)成json物件，此便利性使大多數的開發者願意使用此技術。

> JWT廣泛的被應用在Single Sign On(單點登錄)上，以及網頁的資料交換上。

## JWT的結構

此令牌(token)由三個結構組成，Header、Payload、Signature，

```markdown
xxxxx.yyyyy.zzzzz
```

### Header

通常由兩部分組成：令牌的類型，即 JWT，以及所使用的簽名算法，例如 HMAC SHA256 或 RSA。

```javascript
{
  "alg": "HS256",
  "typ": "JWT"
}
```

然後會被 Base64Url 編碼，形成 JWT 的第一部分。

### Payload

聲明(Claim)內容，有三種:

1. registered 7種訊息建議: iss (issuer), exp (expiration time), sub (subject), aud (audience), and others,
2. public: 可以由使用 JWT 的人隨意定義。但是為了避免衝突，它們應該在 IANA JSON Web 令牌註冊表中定義，或者定義為包含抗衝突命名空間的 URI。
3. private claims: 自定義的欄位,可能會是使用者的一些信息描述。

```markdown
{
"sub": "1234567890",
"name": "John Doe",
"admin": true
}
```

然後會被 Base64Url 編碼，形成 JWT 的第二部分。

### Signature

針對描述的編碼表頭(header)、編碼聲明(payload)、秘密(secret)、表頭中指定的算法，然後對其進行簽名。
secret==>為伺服器端的密鑰，還記得JWT可以使用非對稱加密方式嗎XD

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)

=> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9(hearder).eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsbGVuIiwiaWQiOjI3ODUwNjN9(payload).NVSX8vVwjcw3oXbOsZv7hp9AzdAAU3gQR8htriPD9sQ(secret)


```

合起來就會產生[令牌](https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsbGVuIiwiaWQiOjI3ODUwNjN9.NVSX8vVwjcw3oXbOsZv7hp9AzdAAU3gQR8htriPD9sQ)

## 還有哪些加密概念?

硬件加密

- 替換加密:將輸入的文字按照規律替換後輸出。
- 列移位加密:將輸入的文字按造不規則排列後輸出。
- 英格瑪加密:替換加密的複雜應用，透過A->B->C(但都是不同的替換方式)，每次輸入後，替換方式就會改變，輸出也就不一致。(對稱加密)

軟件加密:

- 數據加密標準(1977年) DES (對稱加密)
- 高級加密標準(2001年) AES 128/192/256位密鑰 => 把輸入數據切塊每16字節，用替換和移位加密。(重複進行至少10次or以上，在安全性及性能上找到平衡) (對稱加密)
- 狄菲赫曼密鑰交換(DIFFIE-HELLMAN KEY EXCHANGE) => 模幕運算
- RSA(非對稱加密)

### 來源

- [JWT](https://jwt.io/introduction)
- [對稱加密與不對稱加密](https://medium.com/@RiverChan/%E5%9F%BA%E7%A4%8E%E5%AF%86%E7%A2%BC%E5%AD%B8-%E5%B0%8D%E7%A8%B1%E5%BC%8F%E8%88%87%E9%9D%9E%E5%B0%8D%E7%A8%B1%E5%BC%8F%E5%8A%A0%E5%AF%86%E6%8A%80%E8%A1%93-de25fd5fa537)
- [RSA](https://zh.wikipedia.org/zh-tw/RSA%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95)
- [ECDSA](https://zhuanlan.zhihu.com/p/97953640)
