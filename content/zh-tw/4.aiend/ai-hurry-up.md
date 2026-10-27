---
title: AI 幫幫忙
description: RAG、Embedding、Agent
icon: i-lucide-rotate-3d
gitTalk: true
date: 2025-02-02 12:07:00
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
badges:
  - value: 此分野跑的飛快，資訊也許會變動
navigation:
  icon: i-lucide-rotate-3d
---

與前同事們聽完 2024 的 [webconf](https://webconf.tw/)，雖然在 Topic 中，有提到一些關鍵字，但大家對 AI 本身可以做的應用仍有點不清晰，
問我要不要也做一點講解的 Post，讓他們了解一下，所以有了這個 slide 的誕生。

::callout{color="info" icon="lucide:link"}
  AI 幫幫忙 ai-hurry-up
::

裡面談到了 RAG Embedding Tools Usage 等等概念，
並簡述了目前的發展趨勢以及各種應用，模型需要去哪裡找等等，
更重要的事`學習資源及方法`。

之後會上傳 YT 的影音版 <- 希望不會太卡 🫠

這篇文章就簡單提及 slide 裡面提到的幾個重點

## LLM 大語言模型

大語言模型 (Large Language Models, LLM) 是基於深度學習技術，特別是 Transformer 架構，訓練出來的模型，能夠理解、生成及處理自然語言文字。這些模型通常在大規模語料庫上進行預訓練，從而學習語言的統計特徵和語義結構。

如 GPT、Gemini、LLama ...etc

## Embedding 嵌入向量

不知道大家會不會好奇，

為什麼模型可以理解各種 input(圖片、文字、影音)等等，

其實是因為透過了 Embedding `嵌入`，將各式各樣的資料，轉換成向量，一種可以表示三重空間位置的數字。

![embedding](/images/ai/embedding.png)

相信這樣講還是有點太模糊，

換個角度想想，為什麼我們聽到`狗`這個字，就能在腦海中想到狗的神態呢?或是狗的聲音呢?

其實就是建立類似 Embedding 的連結，我們將文字與聲音連結了起來。

Embedding 也是這樣的，透過數學的方式將文字與聲音建立了連結!

[ai-hurry-up](https://ai-hurry-up.zeabur.app/8) 中有提供幾個有趣的範例，

大家去玩玩看就知道了～

## RAG 擷取增強生成

![RAG](/images/ai/rag.png)

RAG 是一個很複雜的主題，應該說是一個應用模式，透過 Embedding 將我們的資料轉換並存儲在 Vector DB，

沒錯，轉化過後的向量，一般的資料庫是無法處理的，因為他就真的是一連串的數字，

用一般的資料庫並沒有太多意義，而且進行 select 時，

你也很難找到語義化的資料，所以通常會使用特別的向量資料庫進行存放。

透過 RAG 讓 LLM 可以在搜索時能夠先行尋找向量化後的資料，再行回答。

### RAG 解決什麼問題

通常 LLM 會答非所問，並且對現實資料並不敏感，會有幻覺。

這時候 RAG 就可以很好的解決這個問題。

### RAG 的挑戰

輸入的上限、解析的速度、Vector DB 的複雜化、資料過濾

還有很多很多的問題，但這個技術已被應用到很多 App 中

仍是不斷的快速發展

如 `Gmail Gemini` `Notion AI` 已經導入 RAG

新穎一點也有人提出 CAG 等等概念

## Agent 代理

意旨一種可以自行完成決策及行動的人工智慧服務(?)，簡單來說就是讓 LLM 能夠自行透過 Tools (工具)，來協助人類的指派的任務。

![n8n](/images/ai/n8n.png)

如上圖我透過 n8n 一個開源而且免費的自動化工作流平台，串接了 LLM (GPT 4o)，並透過 tools 叫他解析，我每天訂閱來的 ai tech email，
並總結重點後回傳給我。

![n8n summarization](/images/ai/n8n_summarization.png)

當然這只是一個簡單的 Demo，現實場景可以更複雜，

::callout{color="success" icon="lucide:badge-alert"}
  說不定之後還會有工程師 Agent 😈
::

## 總結

用簡單的語言介紹了幾個熱門的 AI 概念，讓大家更容易了解這些技術能幹什麼：

- 大語言模型 (LLM)

> 就像能和你聊天的超級大腦，它能理解並產生自然語言，讓我們用語言和電腦互動。例如 GPT、Gemini 和 LLama 就是這類模型的代表。

- 嵌入向量 (Embedding)

> 想像我們腦海中聽到「狗」這個字，就會聯想到狗的樣子和叫聲，AI 也是這樣。它把各種資料（文字、圖片、影音）轉成數字向量，幫助電腦理解和關聯不同資訊。

- RAG (擷取增強生成)

>有時候大語言模型回答問題會跑題或亂答。RAG 技術讓 AI 先去找相關資料，再根據這些資料回答問題，這樣可以讓答案更準確，不再胡亂回答。

- Agent 代理

> 想像有個超能幫手，可以自己決定該做什麼、怎麼做，並用各種工具協助完成任務。如何用像 n8n 這樣的工具，讓 AI 自動整理每天的資訊郵件，幫我們省下不少時間。

## Reference

- [what-are-embeddings](https://qdrant.tech/articles/what-are-embeddings/)
- [RAG](https://aws.amazon.com/tw/what-is/retrieval-augmented-generation/)
