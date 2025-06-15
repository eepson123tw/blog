---
title: 瀏覽器是如何運作的?
description: How browser work?
icon: 'lucide:dice-2'
gitTalk: false
date: 2023-08-27 19:13:47
read: '20'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> How browser work?

::alert{type="success"}
💡 Main Goal ：藉由理解此文章理解 morden browser 的底層運作
::

問題點:

- 瀏覽器對於 HTML 撰寫的容錯度?
- 為什麼大家都說重排勢必重繪，要盡量避免?
- CSS 的深度層級是怎麼被解讀的?為什麼都不會有抓不到的時候?
- 同一個區塊內依照順序 有 p⇒zindex :-1 與 p⇒zindex:13 的元素，哪一個會先被繪製呢?
- 重排(回流) 與重繪的差別 ?
- CSS 的解析為什麼要影響 JS?
- 瀏覽器引擎跟解釋器是同一個嗎？

## ␦ 目前瀏覽器的使用率佔比

![browser](/images/browser/browser.png)

## 🀆 瀏覽器的主要功能( **functionality** )

透過解析使用者的統一資源識別符 URI (Uniform Resource Identifier) 將 需求的 request 顯示到頁面上.回傳頁面的規格則由 W3C 規定[[瀏覽器戰爭](https://zh.wikipedia.org/zh-tw/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A4%A7%E6%88%98)].

常規且共通的使用介面功能：

1. URI 的地址輸入解釋器(上方的 input )
2. 上下頁的按鈕
3. 書籤選項
4. 更新和停止按鈕
5. 主頁按鈕

::: details 用戶界面
瀏覽器的用戶界面沒有在任何正式規範中指定，它只是來自多年經驗和瀏覽器相互模仿形成的良好實踐。
:::

## 🀄︎瀏覽器的高階架構( **structure** )

![browser-structure](/images/browser/browser-structure.png)

1. UI介面
   1. 除了 request page 之外的所有 UI 介面，
2. [瀏覽器引擎](https://zh.wikipedia.org/zh-tw/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E)
   1. 將 UI 和渲染引擎之間的操作做連結.
   2. Google ⇒ **Blink** Mozilla **⇒ Gecko [1998年啟用 最久遠]** Internet Explorer ⇒ **Blink** Safari **⇒ Webkit 自有分支**
3. [渲染引擎](https://developer.mozilla.org/en-US/docs/Glossary/Rendering_engine)
   1. 將需求的 HTML CSS 等渲染至瀏覽器頁面上
4. 網路工作
   1. 處理 network calls 像是 HTTP 需求等, **獨立於平台接口,針對不同平台使用不同的實現！**
   2. HTTP **`java.net`** (Java平台) **`HttpClient`** (C#/.NET平台) **`requests`** (Python平台) **`NSURLSession`** (iOS/macOS平台)
5. UI 後端介面
   1. 用於繪製基本小工具（例如下拉框、視窗等）的後端。這個後端提供了一個通用的介面，並不依賴於特定平台。例如選擇框、輸入框、複選框和窗口。
6. JavaScript 解釋器
   1. 是一個內建於瀏覽器的程式，用於解析並執行 JavaScript 代碼。
   2. **V8 (Chrome 和其他 Chromium-based 瀏覽器)、SpiderMonkey (Firefox)、JavaScriptCore (Safari)**
7. 資料存儲
   1. 用於在本地保存各種數據
   2. as cookie。瀏覽器還支持 localStorage、IndexedDB、WebSQL 和 FileSystem

> Chrome 等瀏覽器為`多進程架構`，以便運行渲染引擎的多個實例 ⇒ 每個選項卡 Tab 都在單獨的進程中運行。

## 🀪 渲染引擎 ( Rendering engines )

Chrome 使用 [WebKit](https://webkit.org/)， WebKit 是一個開源渲染引擎，最初是作為 Linux 平台的引擎，後來被 Apple 修改為支持 Mac 和 Windows。

### 主要流程

![basic-flow](/images/browser/basic-flow.webp)

在 network 處理完下載的資源後，即會開始解析 HTML 並轉換成 DOM 樹，並解析 CSS 將 DOM 樹加上樣式信息組成 Render tree.

即為

![render-tree](/images/browser/render-tree.png)

但在形成上方的樹狀結構前，還有幾個步驟，接下來會依序的介紹這過程並且各自展開。

> 這是一個漸進式的過程，若在某一個步驟發生較大的計算，會造成頁面渲染較慢的問題。

### 詳細流程圖

![main-flow](/images/browser/main-flow.webp)

Gecko 和 WebKit [現已轉移至 **Blink** ]是常用的引擎，它們在網頁渲染過程和術語上有細微差異。Gecko 使用 Frame Tree、Reflow；而 WebKit 使用Render Tree、Layout，還有 Attachment 連接 DOM 和視覺信息。但最後皆會相同地繪製到頁面上。

## 🀇 解析器與節點 ( **Parsing )**

解析是將輸入文本( HTML 與 CSS )按照語言規則轉換為結構化的樹狀結構( DOM 與 CSSOM )的過程。它包括詞法分析和語法分析，可以使用自上而下或自下而上兩種類型的解析器來實現。解析器可以通過自動生成工具來生成，幫助實現語言的解析過程。

**各大前端框架也有實作自己的解析器將語法糖進行轉換，皆是按照類似的模式進行解析。**

解析的結果通常是一個節點樹，表示文檔的結構，也被稱為解析樹或語法樹。

![parsing](/images/browser/parsing.webp)

> 每個節點代表一個操作符或操作數，從而準確地表示原始表達式的結構。

### 確立語法

依照文檔規則，具有由詞彙和語法規則組成的確定性語法。它被稱為上下文無關語法(**註3**)。

### 解析語法 ⇒ 解析器←→詞法分析器組合

詞法分析器將輸入拆分成詞彙單元（ tokens ），這些單元是語言的有效構建塊。

語法分析是根據語言的語法規則應用解析。

詞法分析器（有時稱為 tokenizer ）和負責根據語言的語法規則分析文檔結構並構建解析樹的解析器組件組成。詞法分析器知道如何去除不相關的字符，例如空格和換行符。

解析過程是迭代的，解析器請求詞法分析器提供詞彙單元，嘗試匹配語法規則，添加對應節點至解析樹；若無匹配，保存詞彙單元直至找到匹配規則，否則拋出異常表示文檔無效。

![tokenize](/images/browser/tokenize.png)

### 翻譯 ( Translation ) 為機械語言

souceCode → Parsing[語法確立及分析] → 翻譯成機器代碼[0101] 也就是下圖.

![translation](/images/browser/translation.png)

## 🀏 HTML 解析器 ( **HTML Parser ) ⇒ DOM**

HTML 語法定義由 w3c 定義，不適合用傳統的上下文無關文法（context-free grammar）來定義，因為HTML具有寬容性，允許省略某些標籤或開始和結束標籤，這使得它難以使用正常的文法進行解析。HTML與XML相似，但其靈活寬容的語法與XML的嚴格語法有所不同，導致XML解析器無法直接解析HTML。

### HTML 定義

[DTD](https://www.notion.so/algorithm-338534fc0b084397b4d53ab2b614c656?pvs=21)

HTML的定義採用DTD（Document Type Definition）格式，這種格式用於定義SGML（Standard Generalized Markup Language）家族的語言。

DTD包含了所有允許的元素、屬性和層次結構的定義。

### **DOM樹**

DOM 是文檔對像模型的縮寫。它是HTML文檔的對象表示，是HTML元素與外界的接口，就像JavaScript一樣。須符合 W3C 規範。

![dom-tree](/images/browser/dom-tree.webp)

### 解析算法 ( **parsing algorithm )**

由於 HTML 的特性，無法使用傳統的自上而下或自下而上解析器進行解析。為了處理 HTML，瀏覽器使用自定義的解析器。

解析 HTML 的算法由 HTML5 規範詳細描述，它包含兩個階段：詞法分析（tokenization）和樹構造（tree construction）。

tokenization 是詞法分析，將輸入解析成詞彙單元（tokens），包括開始標籤、結束標籤、屬性名稱和屬性值等。

tokenization 將詞彙單元傳遞給樹構造器，並逐個消耗輸入字符，直到輸入結束。

想像一下會如何解析並建構 DOM

```jsx
<html>
  <body>Hello world</body>
</html>;
```

![tag-algorithm](/images/browser/tag-algorithm.png)

![tag-algorithm-2](/images/browser/tag-algorithm-2.png)

> **當解析完成後，會到文檔進行標記[完成]，並且執行那些應該在當前文檔解析後執行的文檔[加載]**

### 瀏覽器的容錯能力

```jsx
<html>
  <mytag>
  </mytag>
  <div>
  <p>
  </div>
    Really lousy HTML
  </p>
</html>
```

雖然使用了錯誤的閉合標籤，但不會跳出錯誤。

HTML 解析器會進行相應處理。解析器會將所有的標籤逐一關閉，直到達到禁止添加該元素的標籤為止。

主要負責:

1. 當前元素被明確禁止出現在某些外部標籤中，需要關閉這些標籤。
2. 如果在當前元素之前忘記了某些標籤（或該標籤是可選的），需要逐一關閉直到達到該元素可以被添加的位置。
3. 嘗試在行內元素中添加塊級元素時，需要先關閉所有行內元素，直到達到下一個更高級的塊級元素。
4. 如果以上處理仍然無法添加元素，則會繼續關閉標籤，直到可以添加元素，或者忽略該標籤。

## 🀐 CSS 解析器 ( **CSS parsing** ) ⇒ CSSOM

CSS物件模型（ CSSOM ）與 DOM 類似，它們都是樹狀結構，但它們是獨立的資料結構。瀏覽器將 CSS 規則轉換為一個可理解且可操作的樣式映射。瀏覽器會遍歷 CSS 中的每個規則集，根據 CSS 選擇器創建一個節點樹，這些節點之間具有父子和兄弟關係。CSS 是上下文無關語法，可以使用分享的[解析器](https://www.notion.so/How-browser-work-397f244949f14440a1448a78166191e6?pvs=21)進行解析。

1.詞彙語法會依照正則匹配

```jsx
comment   \/\*[^*]*\*+([^/*][^*]*\*+)*\/
num       [0-9]+|[0-9]*"."[0-9]+
nonascii  [\200-\377]
nmstart   [_a-z]|{nonascii}|{escape}
nmchar    [_a-z0-9-]|{nonascii}|{escape}
name      {nmchar}+
ident     {nmstart}{nmchar}* <= 標識符的縮寫
```

2.語法分析是用 BNF**註4**定義，用於描述各種 CSS 規則、選擇器、屬性和其他語法元素。

```jsx
ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration [ ';' S* declaration ]* '}' S*
  ;
selector
  : simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?
  ;
simple_selector
  : element_name [ HASH | class | attrib | pseudo ]*
  | [ HASH | class | attrib | pseudo ]+
  ;
class
  : '.' IDENT
  ;
element_name
  : IDENT | '*'
  ;
attrib
  : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S*
    [ IDENT | STRING ] S* ] ']'
  ;
pseudo
  : ':' [ IDENT | FUNCTION S* [IDENT S*] ')' ]
  ;
```

範例 就會被配對到 selector

```jsx
div.error, a.error {
  color:red;
  font-weight:bold;
}
```

> WebKit 使用 [Flex/Bison](https://zhuanlan.zhihu.com/p/120812270) 解析器生成器從 CSS 語法文件自動創建解析器。「**一個自下而上的**移位歸約解析器」**(註5)**

最終形成:

![css-parsing](/images/browser/css-parsing.webp)

> 開發者工具中的" Recalculate Style "顯示的是解析 CSS、構建 CSSOM 樹和遞歸計算計算樣式所需的總時間。

## 🀘 Style 樣式表( **Style sheets** ) 和處理腳本( Scripts )的執行順序

### 預加載掃描器

預載掃描器會解析可用的內容並請求高優先級的資源，例如 CSS、JavaScript和網頁字型。得益於預載掃描器，我們不需要等到解析器找到外部資源的引用再請求它。它會在後台檢索資源，這樣當 HTML 解析器到達所請求的資源時，它們可能已經在傳輸中或已經下載完畢。

### Script 載入順序

在網頁的同步模型中，當解析器遇到**`<script>`**標籤時，期望腳本會立即被解析和執行。文檔的解析過程將停止，直到腳本的執行完成。

- 腳本是外部腳本，則必須同步從網絡上獲取資源，這會導致解析過程暫停，直到資源獲取完成。
- **`defer`**屬性到**`<script>`**標籤，這樣腳本將在文檔解析完成後執行，不會阻止解析過程。
- **`async`**屬性，可以將腳本標記為異步的。這意味著腳本將以非阻塞的方式加載和執行，不會影響文檔的解析過程，並且可以利用不同的線程進行解析和執行，從而更好地提高網頁性能。

### Script 推測性解析

當 script 被解析時會由另一個線程解析文檔的其餘部分並找出需要從網絡加載的其他資源並加載它們。

> 推測解析器僅解析對外部資源（如外部腳本、樣式表和圖像）的引用。不會進行修改 DOM 的動作[主線程負責]

### 樣式表 ( **Style sheets** ) 載入順序

獲取 CSS 時不會阻止 HTML 解析或下載，且不會對 DOM 樹造成修改，但它會阻止 JavaScript 解析，並會造成錯誤。[因為 JavaScript 經常拿來查詢 CSS 屬性，並對元素造成影響]

> 當樣式表仍在加載和解析時，Firefox 會阻止所有腳本。僅當腳本嘗試訪問可能受卸載樣式表影響的某些樣式屬性時，WebKit 才會阻止腳本。

需注意

> HTML解析器和CSS解析器是並行執行的，它們在解析和構建文檔的過程中相互協調，以提高網頁的加載效率和性能。

## 🀙 **渲染樹 ( Render tree construction )**

瀏覽器在處理網頁內容時所建立的一種內部數據結構，用於描述網頁的可見部分。**DOM + CSSOM ⇒ Render Tree**

並且按顯示順序排列的視覺元素，Firefox 將渲染樹中的元素稱為“框架”。 WebKit 使用術語渲染器或渲染對象。

以下為渲染樹中元素的實例，渲染器:

```jsx
class RenderObject{ //每個渲染器代表一個矩形區域，通常對應於節點的 CSS 框 [node's CSS box]，如 CSS2 規範所述。它包括寬度、高度和位置等幾何信息。
  virtual void layout();
  virtual void paint(PaintInfo);
  virtual void rect repaintRect();
  Node* node;  //the DOM node
  RenderStyle* style;  // the computed style
  RenderLayer* containgLayer; //the containing z-index layer
}

RenderObject* RenderObject::createObject(Node* node, RenderStyle* style)
{
    Document* doc = node->document();
    RenderArena* arena = doc->renderArena();
    ...
    RenderObject* o = 0;

    switch (style->display()) {
        case NONE:
            break;
        case INLINE:
            o = new (arena) RenderInline(node);
            break;
        case BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case INLINE_BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case LIST_ITEM:
            o = new (arena) RenderListItem(node);
            break;
       ...
    }

    return o;
}
```

### 渲染樹與 DOM 樹的關係

渲染樹與 DOM 並非為對應關係，若有元素被屬性影響(非可視 DOM 元素不會插入渲染樹中)，也有些例外渲染是無法用單一表示的物件( mutiple line text or select )

> 某些渲染對像對應於 DOM 節點，但不在樹中的同一位置。浮動( float )和絕對定位元素( absolute ) 則會脫離，放置在樹的不同部分，並映射到真實框架。

⇒ 這也是為什麼我們開啟了某一個不可視的節點,會被插入在不同位置的理由。

![render-tree-1](/images/browser/render-tree-1.webp)

![render-tree-2](/images/browser/render-tree-2.png)

### 建構渲染樹的流程

在 WebKit 中，解析樣式和創建渲染器的過程稱為“ attachment ”。處理 HTML 和 BODY 標籤時，會構建渲染樹的根節點。

這個根渲染對象對應到 CSS 規範中所謂的包含塊（Containing Block）：它是包含所有其他塊的最上層塊。它的尺寸就是瀏覽器窗口的顯示區域尺寸（viewport）。

這個根渲染對象形成了瀏覽器的渲染範圍，並作為渲染樹的開始。然後遍歷`深度優先遍歷`(**註6**)整個 DOM 樹和 CSSOM 樹，將它們合併並建立一個描述網頁內容和外觀的渲染樹。

### 樣式計算

構建渲染樹需要計算每個渲染對象的視覺屬性。

難點:

1.樣式數據是一個非常大的構造，包含大量樣式屬性，這可能會導致內存問題。

2.查找每個元素的匹配規則可能會導致性能問題。例如:div div div div{ } 要如何找到此元素。

3.如何將涉及相當複雜的層疊規則，套用到各元素上。

解決:

1.共享風格數據: WebKit 節點引用樣式對象 ( RenderStyle )。[在某些情況下](https://web.dev/howbrowserswork/#sharing-style-data)，這些對象可以被節點共享。

2.規則樹圖: firefox 使用 rule tree and style context tree，以正確的順序應用所有匹配規則並執行將它們從邏輯值轉換為具體值來操作計算。

**存儲規則是惰性完成的**。樹不會在開始時計算每個節點，但每當需要計算節點樣式時，計算出的路徑就會添加到樹中。

雙樹結構在 react 中也有實作 應用於將 jsx 還原成 Dom node 節點時。

> 在 WebKit 中，沒有規則樹的情況下，匹配的聲明將被遍歷四次。多次出現的屬性將按照正確的層疊順序解析，最後出現的規則將覆蓋之前的規則。

![context-tree](/images/browser/context-tree.png)

3.緩存樣式信息結構體：**結構中的所有屬性都可以是繼承的或非繼承的。繼承的屬性是指，如果元素沒有定義這些屬性，則它們將從其父元素繼承。非繼承的屬性（稱為"重置"屬性）在未定義時使用默認值。**有助於加快訪問和查找。如果底層節點沒有為某個結構提供定義，則可以使用上層節點中的緩存結構，這樣可以節省計算時間。這種方式也確保了整個文檔中的樣式信息的一致性和有效性。(如 邊框 或 顏色 或 字型大小)

4.選擇器的哈希映射:根據選擇器將規則添加到多個 hash map (按 id、按類名稱、按標籤名稱的映射，以及針對不屬於這些類別的任何內容的通用映射)。

5.[樣式表級聯順序](https://web.dev/howbrowserswork/#style-sheet-cascade-order):定義應用規則的順序，也就是優先級。最後會對這些優先級進行排序，來解決難點2。

按照 CSS2 規範，選擇器的特殊性由以下方式定義：

1. 如果聲明來自'style'屬性而不是帶有選擇器的規則，則計為1，否則為0 (= a)。
2. 計算選擇器中 ID 屬性的數量 (= b)。
3. 計算選擇器中其他屬性和偽類的數量 (= c)。
4. 計算選擇器中元素名稱和偽元素的數量 (= d)。
5. 連接這四個數字 a-b-c-d（在一個大數字系統中）得到特殊性。

```jsx
*             {}  /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0 */
 li            {}  /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1 */
 li:first-line {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul li         {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul ol+li      {}  /* a=0 b=0 c=0 d=3 -> specificity = 0,0,0,3 */
 h1 + *[rel=up]{}  /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1 */
 ul ol li.red  {}  /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3 */
 li.red.level  {}  /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1 */
 #x34y         {}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0 */
 style=""          /* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0 */
```

## 🀡 佈局 ( **Layout )**

一旦渲染樹建立完成，佈局開始進行。渲染樹確定了哪些節點要顯示（即使是不可見的），以及它們的計算樣式，但還不包括每個節點的尺寸或位置。
⇒ 佈局為計算位置與大小，HTML 使用基於流的佈局模型，**是一個遞歸過程**。

所有渲染器都有一個“佈局”或“重新排列”方法，每個渲染器都會調用其需要佈局的子級的佈局方法。 ⇒ 第一次確定每個節點的尺寸和位置稱為佈局。對於後續的重新計算，則稱為重新排列。
::: info
根渲染器的位置是 0,0，其尺寸是視口 - 瀏覽器窗口的可見部分。
:::

### 髒位註記 (Dirty bit 頁面重寫標誌位)

為了不對每一個小變化都進行完整的佈局，瀏覽器使用“髒位”系統。有兩種標籤 "dirty", and "children are dirty” 區分本身及子級

### 全局佈局和增量佈局 (**Global and incremental layout**)

整個渲染樹上觸發全局計算:

- 影響所有渲染器的全局樣式更改，例如字體大小更改。
- 屏幕大小被調整

被標記為髒位渲染器的才會被佈局

增量佈局計算: (異步)

- 額外的內容從網絡並添加 DOM 樹

### 異步 和 同步佈局

在 Firefox 和 WebKit 中，增量布局 ( incremental layout)是異步進行的。它們都使用一個排程器來觸發批量執行"reflow commands"（重新排版命令）。增量布局將重新布局被標記為"dirty"(需要重新排版)的渲染器。這使得布局更新可以在一個獨立的時間片中完成，不會立即中斷網頁渲染的進程。

### 佈局最佳化

[在某些情況下](https://juejin.cn/post/6983190159646801927)，當觸發佈局（layout）時，例如"resize"（調整大小）或渲染器位置的更改（而不是大小），渲染器的大小會從緩存中取出，而不是重新計算。

有時只有子樹被修改，佈局不會從根節點開始。這種情況可能發生在只有局部更改且不影響周圍環境的情況下，例如向文本字段插入文本（否則每次按鍵都會從根節點觸發佈局）。

### 佈局過程模式

1. 父渲染器確定自己的寬度。
2. 父渲染器遍歷子渲染器，並進行以下操作：
   - 放置子渲染器（設置其x和y位置）。
   - 如果需要，調用子渲染器的佈局過程 - 這可能是因為子渲染器的內容發生了變化，或者在進行全局佈局時，或者其他一些原因。
   - 計算子渲染器的高度。
3. 父渲染器使用子渲染器的累積高度以及邊距和內邊距的高度，來設置自己的高度 - 這將被父渲染器的父渲染器使用。
4. 將父渲染器的"dirty"標誌設置為false，表示佈局已經完成。

另外有 寬度計算 與 佈局中斷 則不在此分享範圍內。

## 🀀 繪畫 ( Painting )

繪製（Painting）可以將佈局樹中的元素分割成不同的層。將內容提升為 GPU 上的層（而不是 CPU上 的主線程）可以改善繪製和重繪性能。有特定的屬性和元素會產生一個層，包括 video 和 canvas 元素，以及任何具有不透明度、3D 變形、will-change 等 CSS 屬性的元素，還有其他幾個原因。這些節點將被繪製到自己的層中，包括其後代，除非後代由於上述原因之一（或多個原因）需要自己的層。

在繪畫階段( FMP )，遍歷渲染樹並調用渲染器的“paint()”方法將內容顯示在屏幕上。

繪製可以是全局的，也可以是增量的。增量繪製只重繪發生變化的部分，而全局繪製則重繪整個渲染樹。

> 為了確保平滑的滾動和動畫，所有佔用主線程的事情，包括計算樣式、回流和繪製，都必須讓瀏覽器在 16.67 毫秒以內完成。

### 繪製順序 與 顯示列表

由 CSS2 定義，它影響了元素在堆疊上下文中的堆疊順序，並且影響著繪製的順序。Firefox 使用顯示列表來優化繪製過程，只遍歷一次渲染樹來繪製相關的元素。

Firefox 遍歷渲染樹並為繪製的矩形構建顯示列表。它包含與矩形相關的渲染器，按正確的繪製順序（渲染器的背景，然後是邊框等）。

1. background color
2. background image
3. border
4. children
5. outline

### 動態變化

渲染引擎嘗試在響應變更時進行最小可能的動作。例如，更改元素的顏色只會重新繪製該元素本身，而更改元素的位置則可能會觸發重新佈局和繪製該元素、其子元素和可能的兄弟元素。對 DOM 節點進行添加將導致節點的佈局和繪製。較大的變更，如增加"html"元素的字體大小，將導致緩存失效、重新佈局和繪製整個渲染樹

### 渲染引擎的線程

渲染引擎是單線程的，除了網絡操作外，幾乎所有操作都在單一線程中進行。主線程是一個事件循環，等待並處理事件（如佈局和繪製事件）。

繪製引擎的執行緒數量可能有限，而網絡操作可以由多個平行線程執行。

### 事件循環

這是一個無限循環，使進程保持活動狀態。它等待事件（如佈局和繪製事件）並處理它們。

## 🀁 合成(Compositing)

[Compositing](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work#compositing)

當文檔的不同部分被繪製在不同的層中，並且彼此重疊時，必須使用合成（compositing）來確保它們以正確的順序顯示在屏幕上，並且內容正確地呈現出來。

隨著頁面繼續加載資源，可能會發生回流（reflow）（回想我們的例子中那張晚到的圖片）。回流將觸發重繪（repaint）和重新合成（re-composite）。如果我們提前定義了圖片的尺寸，就不需要回流，只有需要重繪的層會進行更新，並且如果需要，會重新合成。但是，我們沒有包含圖片的尺寸！當從服務器獲取圖片時，渲染過程會返回佈局步驟，並從那裡重新開始。

## 🀂 視覺顯示 ( Display )

當前面的步驟都處理完成後，就是將頁面顯示的階段。此階段會按照以下[步驟](https://www.w3.org/TR/CSS21/intro.html#processing-model):

1. 解析 source code 並創建一個 DOM Tree。
2. 確定目前媒體類型
   ![media](/images/browser/media.png)
3. 取回與當前媒體類型關聯的所有樣式表
4. 透過適合目前媒體類型的機制，為 DOM Tree 的元素分配屬性（依照樣式計算的規則進行分配）
5. 各屬性的計算部分取決於適用於目標媒體類型的格式化算法。例如，如果目標媒體是屏幕，使用者代理將應用[視覺格式化模型](https://www.w3.org/TR/CSS21/visuren.html)
6. 將格式化結構轉移到目標媒體（例如打印結果、在屏幕上顯示、轉為語音等），於是我們可以看見頁面內容。

> DOM Tree 會生成 格式化結構[ formatting structure ]，格式化結構不一定為樹狀結構，且包含更多或更少的內容（因為之前提過的display屬性，可能會關閉某部分的結構生成），List 可以在格式化結構中生成更多資訊：列表元素的內容和列表樣式資訊 等等

接下來介紹一些常見的屬性描述:

### Canvas

"canvas"一詞描述了"格式化結構被渲染的空間"。每個空間維度的canvas是無限的，但渲染通常發生在canvas的有限區域內，該區域由使用者代理(**註1**)根據目標媒體來設置。

### CSS Box Model

[CSS Box Model](https://www.w3.org/TR/CSS2/box.html)

描述為 Dom 樹中的元素生成並根據視覺格式化模型進行佈局的矩形框。

[HTML 4 各屬性的 Default](https://www.w3.org/TR/CSS2/sample.html)

![box-model](/images/browser/box-model.webp)

> 每個盒子都有一個內容區域以及可選的周圍填充、邊框和邊距區域。所有元素都有一個“display”屬性，該屬性確定將生成的框的類型。

### **Positioning scheme**

1. 正常( normal )：對像根據其在文檔中的位置進行定位。這意味著它在渲染樹中的位置就像它在 DOM 樹中的位置一樣，並根據其盒子類型和尺寸進行佈局
2. 浮動( float )：對象首先像正常流一樣佈局，然後儘可能向左或向右移動
3. 絕對( absolute )：對象放置在渲染樹中與 DOM 樹中不同的位置

### **Box types Positioning  (以下略)**

### **分層表示 (Layered representation)**

**`z-index`** 是 CSS 屬性，用來指定元素在堆疊上下文中的顯示順序，即在堆疊的第三維度，也稱為"z軸"。這個屬性影響元素在疊加時的顯示順序。

元素被分成多個堆疊（稱為堆疊上下文）**註2**。

> 在每個堆疊中，位於後方的元素會先被繪製，而位於前方、靠近使用者的元素會繪製在頂部。如果元素之間有重疊，前面的元素會遮擋住後面的元素。

## 🀃 結論

瀏覽器是一個複雜的軟體系統，它負責將網頁上的 HTML、CSS 和 JavaScript 代碼轉換為可供使用者理解的內容。瀏覽器的工作原理可以總結為以下幾點：

1. 繪製順序：瀏覽器會按照 HTML 和 CSS 的規則進行網頁的繪製，從上到下、從左到右進行佈局和渲染。在繪製過程中，瀏覽器會考慮到元素的層級、大小、位置、邊框、填充等因素，以確保網頁的外觀和布局符合設計要求。
2. 動態變化：渲染引擎會在響應網頁變化時進行最小可能的動作，例如更改元素的顏色只會重新繪製該元素本身。這樣可以最大限度地減少繪製的開銷，提高網頁的性能和響應速度。
3. 渲染引擎的線程：渲染引擎是單線程的，除了網絡操作外，幾乎所有操作都在單一線程中進行。這意味著瀏覽器可以更好地控制繪製的過程，減少不必要的繪製和響應延遲。
4. 事件循環：事件循環是一個無限循環，使進程保持活動狀態。它等待事件並處理它們。事件循環是瀏覽器中一個非常重要的機制，它負責處理用戶交互、動畫、計時器等等各種事件，保證網頁的正常運作。
5. 合成：當文檔的不同部分被繪製在不同的層中，必須使用合成來確保它們以正確的順序顯示在屏幕上。合成是瀏覽器中一個非常複雜的過程，它涉及到多個層的合併、位移和透明度等計算，以確保網頁的呈現效果符合預期。
6. 視覺顯示：瀏覽器會解析 HTML，創建 DOM Tree，確定媒體類型，取回並分配樣式，最終將格式化結構轉移到目標媒體，呈現頁面內容。在這個過程中，瀏覽器會考慮到許多因素，例如屏幕大小、解析度、顯示模式、字體大小等等，以確保網頁的內容和佈局符合使用者的期望。

:::info
🔑 除此之外，本文還介紹了一些相關的名詞，包括使用者代理、堆疊上下文和上下文無關語法等。這些名詞對理解瀏覽器的工作原理和優化網頁性能都非常重要。

總而言之，瀏覽器是一個非常複雜的系統，它從不同的角度解析和繪製網頁上的HTML、CSS和JavaScript代碼，最終呈現給使用者的是一個具有良好外觀和性能的網頁。

了解瀏覽器的工作原理和相關名詞，可以幫助我們更好地開發和優化網頁，提高使用者體驗。
:::

## 🀅 名詞補充

`使用者代理(User Agent)`:是指在網際網路環境下，代表使用者與網站或網絡服務進行交互的軟體應用程式或程式碼。它是一種能夠向伺服器發出請求並解析響應的客戶端。瀏覽器是最常見的使用者代理，但其他應用程式或程式碼，如網絡爬蟲、機器人和自動化腳本等，也可以充當使用者代理。

使用者代理負責處理和呈現網站的內容，將網站的HTML、CSS和JavaScript等資源解析並呈現給使用者。它還在每次發出網頁請求時，向伺服器傳遞關於使用者代理自身的信息，例如使用的瀏覽器類型、版本、作業系統等，這些信息通常被用來優化網站的呈現和提供更好的使用者體驗。

使用者代理在網際網路中起著重要的角色，因為它使得使用者能夠以友好的方式與網站和網絡服務進行互動，同時也能夠提供有關使用者訊息的重要資料，幫助網站優化其內容和功能。

`堆疊上下文( stacking contexts )`:指一種處理元素疊加顯示的機制。當元素發生重疊時，它們的顯示順序是由堆疊上下文來決定的，而不僅僅是它們在 DOM 中的位置或文檔流的順序。

`上下文無關語法（Context-Free Grammar）`:是一種形式文法，用於描述自然語言或程式語言的結構。它是一種無記憶的文法，意味著每個規則的應用都獨立於其他規則的應用，不依賴於詞彙或句子的上下文。

`BNF`:（Backus-Naur Form）是一種用於描述程式語言語法的符號表示法。

`移位歸約解析器（Shift-Reduce Parser）`:是一種用於語法分析（Parsing）的技術，通常用於解析編程語言、標記語言等的語法結構。它是一種自頂向下的語法分析方法，用於將輸入的序列（如代碼或文本）轉換為語法樹（Parse Tree）或抽象語法樹（Abstract Syntax Tree）。

`深度優先遍歷（Depth-First Traversal）`：一種常見的遍歷方式，它從根節點開始，依次遍歷每個節點的子節點，直到達到樹的最深處，然後返回並繼續遍歷其他分支。

### 來源

[Populating the page: how browsers work - Web performance | MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)

[浏览器渲染引擎 - 掘金](https://juejin.cn/post/6844903587525427214)

[howbrowserswork](https://web.dev/howbrowserswork/)
