---
layout: doc
date: 2023-05-16 21:50:00
description: 學習React框架
title: React框架第四天
---

# 學習 React 框架 - 004 渲染切片與底層fiber

## React怎麼render組件?

只要更改組件中的狀態，React都能立刻將變動顯示在UI上，在這幾天的學習下，我們理解React透過Render將組件渲染至頁面上，並透過觀測狀態更新重新渲染頁面。
但並不清楚React在渲染上為開發者做了那些優化，接下來，讓我們來淺嚐React在Render上付出的心力，以及Render被觸發後，React又透過哪些方法比對狀態間的差異以及其依據的底層實作為何?

### 狀態快照

React 會創建組件的快照，捕獲 React 在特定時刻更新視圖所需的一切。狀態、事件處理程序和 UI 的描述。

### React16 以前的渲染模式

React16前更新需透過reconciler(判斷哪先元件需要更新，可中斷)調度後送到renderer，執行後會進行**同步的渲染**，當頁面複雜時，巢狀的組件結構下，若改一個值，需要等待較為長久的時間更新。**而且更動父組件狀態，將會一起使得在其之下的子元件重新的渲染。**

### React16 之後的渲染模式

透過fiber的結構，將同步渲染的方式更改為**非同步渲染**與任務片段技術，將各組件依virtual dom tree => fiber tree，實做出一個可以非同步更新的結構。使得渲染過程可以被中斷、暫停和恢復，從而更好地控制渲染的優先級，提高應用程式的響應性能，並避免等待渲染的時間以及JavaScript線程占用等待的問題。


## [Fiber](https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js#L414)

[Reference](https://www.youtube.com/watch?v=0ympFIwQFJw&t=5s&ab_channel=PhilipFabianek)

![fiberInfo](/assets/images/react/fiberInfo.png)

<details>
<summary>FiberNode包含的屬性</summary>

[取自](https://xiaochen1024.com/article_item/600aca0cecf02e002e6db56c)
```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  //保存节点的信息---
  this.tag = tag;//对应组件的类型
  this.key = key;//key属性
  //(帶有一組孩子的唯一標識符，以幫助 React 確定哪些項目已更改，已添加或從列表中刪除。它與此處描述的 React 的“列表和鍵”功能有關。)
  this.elementType = null;//元素类型
  this.type = null;//func或者class
  this.stateNode = null;//真实dom节点

  //连接成fiber树---
  this.return = null;//指向父节点
  this.child = null;//指向child
  this.sibling = null;//指向兄弟节点
  this.index = 0;

  this.ref = null;

  //用来计算state---
  this.pendingProps = pendingProps;
  //已從 React 元素中的新數據更新並需要應用於子組件或 DOM 元素的道具。
  this.memoizedProps = null;
  //在上一次渲染期間用於創建輸出的fiber的道具。
  this.updateQueue = null; 
  // 狀態更新、回調和 DOM 更新隊列。
  this.memoizedState = null;
  // 用於創建輸出的fiber的狀態。在處理更新時，它會反映當前在頁面上呈現的狀態。
  this.dependencies = null;
  this.mode = mode;
  
	//effect相关---
  this.effectTag = NoEffect;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;

  //优先级相关的属性---
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  //current和workInProgress的指针---
  this.alternate = null;
}
```

</details>

可以視為一種數據結構，保存了組件節點的屬性、類型、dom，並透過指向 child、sibling、return来形成Fiber樹，此數據結構將渲染過程劃分為可中斷的單元，以支持增量渲染和更好的使用者互動，區分元件樹的不同層級和渲染優先級。



```js
function ClickCounter (){

//... 以上略
 return (
  <button key="1" onClick={this.onClick}>Update counter</button>
 <span key="2">{this.state.count}</span> 
)

}

```

會轉換成

![fiber](/assets/images/react/fiber.png)

::: warning

每個 React 元素都有一個對應的 fiber 節點。與 React 元素不同， fiber不會在每次渲染時重新創建。這些是可變數據結構，用於保存組件狀態和 DOM。

:::

第一次渲染後，React 得到一個 fiber 樹，它反映了用於渲染 UI 的應用程序的狀態。這棵樹通常被稱為當前樹(Current Fiber tree)。

當 React 開始處理更新時，它會構建一個所謂的 workInProgress 樹，它反映了要刷新到頁面的未來狀態。

一旦處理完更新並完成所有相關工作，React 將準備好的 workInProgress樹以刷新到頁面上。一旦這棵 workInProgress 樹被渲染到頁面上，它就變成了 current 樹。

我們可以理解成React存放了二顆樹形的對照表，互相對照，已分析出那些結點及狀態需要變動，觸發重新渲染。也被稱為雙緩衝技術 (double buffering)。

:::danger
React 總是一次性更新 DOM——它不會顯示部分結果。
:::

![fiberTree](/assets/images/react/fiberTree.png)

## Side-effects

將 React 中的組件視為使用狀態和 props 來計算 UI 表示的函數。任何會觸發計算的函數，如改變 DOM 或調用生命週期方法，都應被視為副作用，或者簡稱為效果。

因此fiber節點是一種除了更新之外還可以跟踪side-effects的便捷機制。每個fiber節點都可以有與之關聯的effect。它們在 effectTag 屬性中被表明。

## Effect List


## Render and Commit Phases

## work loop


<!-- ### nextUnitOfWork 
### performUnitOfWork
## workLoop 
## Reconciliation -->

## 參考資料

- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [async rendering and synchronous rendering](https://twitter.com/acdlite/status/977291318324948992)
- [Fiber](https://xiaochen1024.com/article_item/600aca0cecf02e002e6db56c)
- [Inside Fiber: in-depth overview of the new reconciliation algorithm in React](https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react)
- [A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs&t=1040s&ab_channel=MetaDevelopers)

<GitTalk/>
