---
title: 如何操作複雜的物件結構
description: ArrayMethods、iterable Obj
icon: 'lucide:orbit'
gitTalk: false
date: 2022-11-26 00:45:20
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> 如何操作複雜的物件結構

在開發過程中，前端工程師們常常會遇到許多複雜的資料結構，結構與頁面的抽象及邏輯成正比，簡單來說，越複雜的結構就反應越複雜的頁面邏輯，當我們看到這些結構可以做哪些方法，去優化、簡化這些結構，來增加我們的開發效率並降低心智負擔呢?畢竟看到層層疊疊的物件及陣列，相信正常人的頭都會隱隱作痛XD
下面我們就來依序介紹:

> 1.處理方法(Api工具) 2.邏輯拆解(思考資料結構拆分) 3.組合及優化(解題)

## 處理方法

通常複雜的資料結構不免俗的就是物件及陣列的巢狀嵌套，要先來了解有哪些方法可以幫助我們處理，並用方法把目標解構出來吧!!

```javascript
// 條件篩選
const ary = [1,2,3,4,5] ;
const aryMap=[{name:'aaron'},{name:'joy'}]

//1.filter 遍歷目標陣列篩選出符合條件的物件，並回傳陣列。

ary.filter((num)=>num>3) // => [4,5]

// 2.find  遍歷目標陣列篩選出符合條件的物件，並回傳物件。

aryMap.find((d)=>d.name==='aaron') // => {name: 'aaron'}

// 3.findIndex 遍歷目標陣列篩選出符合條件的物件，並回傳目標索引。

ary.findIndex((num)=>num>3) => 3 (找到目標後,就停止遍歷。)

// 4.includes 遍歷目標陣列篩選出符合條件的物件，並回傳布林值。

aryMap.includes((d)=> d.name === 'jack') => false

// 5.indexOf  回傳目標陣列中第一個被找到的索引值，若不存在則會回傳-1。

ary.indexOf(3)  => 2

// 資料重組
// 1.map 遍歷陣列依照設定格式，回傳陣列。

ary.map((x)=>({num:x})) =>[{num:1},{num:2}...]

// 2.reduce 遍歷陣列依照閉包設定格式，回傳陣列、或物件。(非常重要,可以組出任意元素)
ary.reduce((acc,cur)=>{
  acc[cur] = 'id'+cur+'!'
  return acc
},{})

=>{1: 'id1!', 2: 'id2!', 3: 'id3!', 4: 'id4!', 5: 'id5!'}

```

以上的方法，有些是以閉包模式傳遞，並在內部遞迴後回傳出來，相當地有趣，筆者會在最後附上相關的實現內容，有興趣的話可以自己實做看看!會對這些方法的操作更加的熟悉!

不知道有沒有一個疑問，那就是上方都是陣列的方法，那物件呢?陣列的原型方法沒法使用阿!?
物件原型方法上的篩選methods的確很少XD，但我們可以把物件轉成陣列模式操作啊!

```javascript
const obj = { a: '123', b: '234', c: '345' };

Object.keys; // 回傳物件key值陣列

Object.keys(obj); // => ['a', 'b', 'c']

Object.values; // 回傳物件value值陣列

Object.values(obj); // =>['123', '234', '345']
```

看到這個模式是否燃燒起你的小宇宙了呢!!我們來合體操作看看吧!

```javascript
const obj2 = { 1: { name: 'aaron' }, 2: { name: 'joke' }, 3: { name: 'mindy' } };

Object.values(obj2).filter(d => d.name === 'mindy'); // {name: 'mindy'}
```

## 邏輯拆解

找出我們所需的關鍵資料的一個想法或概念,我們可以透過畫出flow，去嘗試構思哪些資料是我們所需的，且在解題時為必要，
透過這些拆分，我們可以把複雜的資料給拆解出細小原子，在不斷的組合起來。

## 解題

在熟悉這些組合操作後，我們來挑戰一題較為困難的題目吧!

```javascript
const memberList = [
  {
    member: 'Alex',
    id: 1,
    score: 85,
    order: ['A', 'C', 'D', 'B', 'E']
  },
  {
    member: 'jabo',
    id: 2,
    score: 83,
    order: ['C', 'A', 'D', 'E', 'B']
  },
  {
    member: 'aaron',
    id: 3,
    score: 80,
    order: ['A', 'D', 'E', 'B', 'C']
  },
  {
    member: 'phobe',
    id: 4,
    score: 90,
    order: ['D', 'A', 'C', 'E', 'B']
  },
  {
    member: 'celia',
    id: 5,
    score: 60,
    order: ['C', 'A', 'B', 'D', 'E']
  }
];

// Ｑ：按照分數高低，最後導出使用者的希望組別，組別不可以重複

// eslint-disable-next-line array-callback-return
memberList.sort((a, b) => { a.score - b.score; }); // 先照高分順序排序

// 按照 組別分組
let groupBox = memberList.reduce((acc, cur, i) => {
  i === 0 && cur.order.forEach(d => (acc[d] = [])); // 先將組別放入物件中，並將值設為陣列
  cur.order.forEach((d, x) => {
    acc[d].push({ d, n: cur.member, s: cur.score, hopeIndex: x }); // 依照順序送入陣列中
  });
  return acc;
}, {});

const map = [];
let pointer = 0;
// 指針移動推入希望組別
while (pointer < memberList.length) {
  for (key in groupBox) {
    map.push(groupBox[key][pointer]); // 此時的map陣列中就是按照分數高低及使用者意願的順序
    pointer++;
  }
}

// 但這解法有一個問題，就是for in 並保證key順序，若為重要資料陣列，建議還是另外保存索引值，較為理想喔!
```

若有更有趣的實現方式，歡迎在下方留言~

[陣列實現](https://github.com/eepson123tw/DeepLearnJs/blob/master/10%E8%B3%87%E6%96%99%E7%B5%90%E6%A7%8B%E6%93%8D%E4%BD%9C%E5%8F%8A%E5%AF%A6%E7%8F%BE/arrayApi.js)
[for in](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/for...in)
