---
title: 模型上下文協議 (MCP)
description: 模型上下文協議 (Model Context Protocol, MCP) 是由 Anthropic 推出的開放標準，旨在標準化 AI 與外部世界的互動方式，猶如為大型語言模型打造的通用翻譯官。
icon: 'lucide:git-fork'
gitTalk: false
date: 2025-03-22 10:30:00
read: '13'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
navBadges:
  - value: 🚀
    type: primary
---

想像一下，我們有了能說自然語言的 AI 應用，卻發現它無法與現實世界中的系統和資料直接對話，且有資料訓練的滯後性，用起來總是`卡卡的咚滋咚滋`。

模型上下文協議 (MCP) 就像是為 AI 打造的「通用翻譯官」，讓不同語言的 AI 模型能與各式各樣的外部世界溝通!!

## MCP 是什麼？從交通樞紐到世界外交官

試想你身處一個繁忙的國際機場，每個登機門都通往不同的國家，講著不同的語言。在沒有翻譯的情況下，你需要為每個國家學習一種新語言（就像傳統的 AI 整合）。但如果機場設有一個中央翻譯中心，無論你前往哪個國家，都能獲得即時翻譯服務，那會多麼方便！

模型上下文協議（Model Context Protocol, MCP）就是這樣的存在，只不過它幫助的不是旅客，而是 AI 模型。它像是 AI 世界的「聯合國翻譯系統」，讓 AI 助手能夠與各種外部系統和資料來源流暢對話。

::alert{type="info" icon="lucide:info"}
  MCP 可以被視為 AI 應用程式的「USB-C 連接埠」，提供一個通用介面，使 AI 模型能夠連接到各種不同的資料來源和工具，就像一個裝置能透過 USB-C 連接到各種不同的設備。
::

![MCP 概念圖](/images/ai/mcp.png)

MCP 由 Anthropic 於 2024 年 11 月推出，作為一個開放程式碼協議，其目標是標準化應用程式向大型語言模型提供上下文的方式。

### 解決「多語言外交」的難題

在全球貿易的早期，如果 10 個不同語言的國家要互相交流，就需要 45 種不同的翻譯組合（10×9÷2）。同樣地，在 AI 整合領域，當有 M 個模型和 N 個工具時，傳統方法需要 M×N 種整合方式。

MCP 的出現就像是創建了一種「世界通用語」，每個國家只需學習這一種語言即可與所有人交流。這將整合需求從 M×N 降低為只需 M+N，大幅簡化了 AI 與外部工具的連接過程。

```
# 傳統整合方式（需要 M×N 種組合）
AI 模型 1 <--> 工具 1（專屬語言）
AI 模型 1 <--> 工具 2（專屬語言）
AI 模型 2 <--> 工具 1（專屬語言）
...

# MCP 整合方式（只需 M+N 種組合）
AI 模型 1 --> MCP <-- 工具 1
AI 模型 2 --> MCP <-- 工具 2
...
```

## MCP 的起源：從語言伺服器協議到 AI 通用標準

MCP 的靈感部分來自於語言伺服器協議（Language Server Protocol, LSP），後者已成功地標準化了程式編輯器與各種程式語言工具之間的通訊方式。

想像你是一家餐廳的老闆，以前每當聘請一位新廚師（新模型），都需要為他們配備與每種食材供應商（工具）溝通的特殊方法。LSP 的成功向 Anthropic 展示了一種可能：創建一套標準化的「廚房溝通協議」，讓每位廚師都能使用同一種方式與所有供應商交流。

Anthropic 於 2024 年 11 月底將 MCP 作為開放程式碼協議推出，目標是賦予開發人員能力，並促進更快速的成長、更穩健的發展，創造一個共享連接器的生態系統，實現跨領域更豐富的 AI 行為。

## MCP 的架構：咖啡廳模型

MCP 採用客戶端-伺服器架構，這種架構可以類比為一家精品咖啡廳的運作方式：

![MCP 架構](images/ai/mcp-chart.png)

- **MCP 客戶端**（像是前台收銀員）：
  - 位於客戶端應用程式中（如 Claude Desktop、IDE 或 AI 工具）
  - 接收顧客（使用者）的咖啡訂單（查詢）
  - 與後廚（伺服器）溝通，傳達具體需求
  - 確保訂單（資料）的安全傳遞，並最終將咖啡（結果）送達顧客手中

- **MCP 伺服器**（像是咖啡師和專業設備）：
  - 獨立的外部程式，提供特定功能（如製作特定類型的咖啡）
  - 連接到各種資料來源（咖啡豆、牛奶、調味料等原料）
  - 依照客戶端的請求執行操作，提供成品（資訊或執行結果）

這種客戶端-伺服器架構實現了關注點的清晰分離：前台處理與顧客的互動，而後廚則專注於製作美味的咖啡。在 MCP 中，客戶端處理與 LLM 的互動，而伺服器則管理對外部資源的存取。

## MCP 的基本元素：廚房工具與食材

就像一間設備齊全的廚房需要各種工具和食材來製作美食，MCP 也有其基本元素來支持 AI 與外部世界的互動：

### 伺服器端基本元素（廚師的工具箱）

1. **工具 (Tools)**
   - 就像廚師的刀具、鍋具和攪拌機，讓廚師能夠加工食材
   - 伺服器提供的可執行功能或操作（如資料庫查詢、網路搜尋）
   - 模型可以透過伺服器調用這些工具，就像廚師使用工具來完成特定任務
   
2. **資源 (Resources)**
   - 相當於廚房的食材和調味料，為菜餚提供基本內容和風味
   - 伺服器可以發送的結構化資料（如文件片段、程式碼片段）
   - 用於豐富模型的上下文，就像食材為料理提供基本內容

3. **提示 (Prompts)**
   - 類似於食譜和烹飪技巧指南，指導廚師如何準備特定菜餚
   - 預先準備好的指令或模板，用於指導模型生成特定回應
   - 提供標準化的互動方式，確保一致性和高品質的結果

::alert{type="success" icon="lucide:chef-hat"}
  想像 MCP 伺服器就像一位專業廚師，擁有各種烹飪工具（Tool）、新鮮食材（Resource）和獨家食譜（Prompt），能夠根據客人需求製作出精緻料理。
::

### 客戶端基本元素（餐廳管理層面）

1. **根 (Roots)**
   - 就像餐廳劃分的區域權限，規定每位員工可以進入哪些地方
   - 定義伺服器被授權互動的特定位置或範圍
   - 確保外部伺服器僅能存取指定部分，保護敏感資料

2. **取樣 (Sampling)**
   - 類似於廚師向餐廳經理請求特殊食材或烹飪建議的過程
   - 允許伺服器向客戶端請求 LLM 完成，顛倒傳統的客戶端-伺服器關係
   - 客戶端保留對模型選擇、隱私和成本的控制，可拒絕不合理的請求

## MCP 的通訊流程：餐廳點餐到上菜的全過程

當使用者提出一個需要外部資訊的查詢時，MCP 遵循的流程就像是高級餐廳的用餐體驗：

```
1. 顧客（使用者）向服務員（MCP 客戶端）點餐（提出查詢）
2. 服務員向廚房（MCP 伺服器）詢問今日菜單（可用功能）
3. 主廚（AI 模型）了解可用的食材和專長菜式
4. 服務員將顧客的點餐需求傳達給主廚，包括特殊要求
5. 主廚分析需求，決定需要使用哪些食材和烹飪技巧
6. 服務員根據主廚的指示，向廚房的各站點（伺服器功能）發出準備要求
7. 各站點準備好自己負責的部分，並交給服務員
8. 服務員將所有準備好的食物送給主廚進行最終組裝和裝盤
9. 主廚完成料理，服務員將完美的成品送到顧客桌前
```

![MCP 簡化流程](images/ai/mcp-chart-2.png)
這種多步驟的過程確保了 AI 能夠以受控和結構化的方式利用外部資訊和工具，就像一間精密運作的餐廳能夠提供卓越的用餐體驗。

## MCP 的應用：從廚房到真實世界

MCP 不只是理論上的通訊協議，它已經在各種實際應用中展現價值。想像 MCP 為各行各業的 AI 應用打開了一扇新的大門：

- **智慧型客戶支援**：就像一位接待員可以立即查閱顧客檔案、訂單記錄和產品目錄，AI 助理可以無縫地提取客戶歷史記錄、檢查訂單狀態並提供解決方案

- **AI 驅動的個人理財管理員**：如同一位財務顧問能同時掌握你的所有銀行帳戶、投資組合和消費習慣，AI 可以透過 MCP 連接到各種金融服務，輕鬆聚合交易、分類支出、追蹤投資並提供財務見解

- **程式碼助手**：就像一位經驗豐富的軟體架構師可以閱讀、理解和改進現有代碼，AI 驅動的程式碼助手可以透過 MCP 與開發工具互動，分析、重構、優化和保護程式碼

::alert{to="https://modelcontextprotocol.io/examples" target="_blank" icon="lucide:github"}
  想體驗 MCP 的如何建構？可以查看 Anthropic 的官方網站，就像是參觀一間開放式廚房，可以看到各種料理的製作過程！
::



## 如何開發 MCP 伺服器：開設你自己的專業廚房

如果 MCP 是一間餐廳的運作模式，那麼開發自己的 MCP 伺服器就像是開設一間專業廚房，為 AI 提供專屬的烹飪服務。以下是基本步驟：

### 1. 準備廚房設備（設定環境）

```python
# 安裝 MCP SDK（相當於採購專業廚具）
pip install mcp[cli]

# 建立並初始化工作空間（佈置廚房空間）
mkdir my-mcp-server
cd my-mcp-server
python -m venv venv
source venv/bin/activate  # 在 Windows 上使用 venv\Scripts\activate
```

### 2. 開發菜單和烹飪流程（定義伺服器功能）

```python
# 使用 FastMCP 建立 MCP 伺服器（設計菜單和烹飪流程）
from mcp.server import FastMCP

app = FastMCP()

@app.tool()
def search_knowledge_base(query: str, limit: int = 10):
    """
    搜尋知識庫並返回匹配的結果（就像廚師尋找特定食譜）。
    
    Args:
        query: 搜尋查詢字串
        limit: 返回結果的最大數量
    
    Returns:
        匹配查詢的結果清單
    """
    # 實際的搜尋邏輯
    return ["結果1", "結果2", "結果3"]
```

### 3. 選擇溝通方式（傳輸方法）

MCP 支援兩種主要的傳輸方法，就像餐廳可以有不同的點餐系統：

- **Stdio**：像是廚房內部的直接口頭溝通，適合本地密切合作
- **HTTP 與 SSE**：像是使用數位點餐系統，可以跨區域溝通，適合遠端操作

::alert{type="warning" icon="lucide:alert-triangle"}
  開發 MCP 伺服器時，請記得加強資料安全性，就像餐廳需要確保食品安全和顧客資訊保密一樣重要。尤其是當伺服器與敏感資料或外部系統互動時。
::

## MCP 的多語言支援：國際化的廚藝

就像一間國際知名餐廳會聘請精通不同烹飪風格的廚師，MCP 也提供多種程式語言的支援：

- **Python**：就像法式料理，精緻且被廣泛學習，有著豐富的生態系統
- **TypeScript**：如同現代融合料理，靈活且適應性強，MCP 框架本身就是使用它建構的
- **Java**：類似傳統義大利料理，結構嚴謹且在企業環境中廣受歡迎
- **Kotlin**：像是義大利料理的現代演繹，保留了優點並增加了便利性
- **其他語言**：只要能夠「烹飪」（處理輸入輸出），任何語言都可以加入 MCP 的廚藝世界


::alert{to="https://modelcontextprotocol.io/quickstart/server#core-mcp-concepts" target="_blank" icon="lucide:pointer"}
  多種語言如何建構 MCP 
::



## MCP 與上下文感知 AI 的未來

模型上下文協議就像是打造了一個全球性的 AI 通用語言，讓不同的 AI 模型和工具能夠無障礙地交流。它不僅僅是一個技術協議，而是一座橋樑，連接了 AI 與豐富多彩的現實世界。

隨著 MCP 生態系統的成長，可以期待：
- 更多種類的「料理」（MCP 伺服器和功能）湧現
- 各種 AI 平台開始「說同一種語言」（採用 MCP 標準）
- 更複雜的「廚藝表演」（AI 代理行為和自動化流程）成為可能
- 「食譜共享社群」（開發者社群）帶來更多創新

MCP 為我們開啟了一個 AI 能夠真正理解和互動的世界大門，正如一位偉大的廚師不僅精通烹飪技術，還深刻理解食材、文化和顧客需求，期許未來的 AI 將能夠更全面地理解和服務於我們的世界。

## 參考資料

- [Anthropic Model Context Protocol](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [Building with MCP](https://www.anthropic.com/news/model-context-protocol)
- [MCP Technical Documentation](https://github.com/anthropics/model-context-protocol)
- [The Model Context Protocol (MCP) by Anthropic: Origins, functionality, and impact](https://wandb.ai/onlineinference/mcp/reports/The-Model-Context-Protocol-MCP-by-Anthropic-Origins-functionality-and-impact--VmlldzoxMTY5NDI4MQ)
- [What is the Model Context Protocol?](https://workos.com/blog/model-context-protocol)
- [What is Model Context Protocol (MCP)](https://norahsakal.com/blog/mcp-vs-api-model-context-protocol-explained/)
- [More protocol](https://docs.google.com/document/d/1VdFB2jKe5YhYCDfU7SBnj2GZ81kz1adNzNlzdLayw0s/edit?usp=drive_link)
