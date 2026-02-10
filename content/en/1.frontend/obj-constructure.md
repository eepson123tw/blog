---
title: How to Handle Complex Object Structures
description: ArrayMethods, iterable Obj
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

> How to Handle Complex Object Structures

During development, frontend engineers often encounter many complex data structures. The complexity of structures is proportional to the abstraction and logic of pages. Simply put, more complex structures reflect more complex page logic. When we see these structures, what methods can we use to optimize and simplify them to increase our development efficiency and reduce mental burden? After all, seeing layers upon layers of objects and arrays would make any normal person's head ache XD

Let's introduce them in order:

> 1. Processing Methods (API Tools) 2. Logic Decomposition (Thinking about Data Structure Breakdown) 3. Combination and Optimization (Problem Solving)

## Processing Methods

Complex data structures inevitably involve nested objects and arrays. Let's first understand what methods can help us process them and use these methods to destructure our targets!

```javascript
// Conditional filtering
const ary = [1,2,3,4,5] ;
const aryMap=[{name:'aaron'},{name:'joy'}]

//1.filter Traverses the target array to filter objects that meet conditions, returns an array.

ary.filter((num)=>num>3) // => [4,5]

// 2.find Traverses the target array to filter objects that meet conditions, returns an object.

aryMap.find((d)=>d.name==='aaron') // => {name: 'aaron'}

// 3.findIndex Traverses the target array to filter objects that meet conditions, returns the target index.

ary.findIndex((num)=>num>3) => 3 (After finding the target, stops traversing.)

// 4.includes Traverses the target array to filter objects that meet conditions, returns a boolean value.

aryMap.includes((d)=> d.name === 'jack') => false

// 5.indexOf Returns the index of the first found element in the target array, returns -1 if not found.

ary.indexOf(3)  => 2

// Data restructuring
// 1.map Traverses array according to set format, returns an array.

ary.map((x)=>({num:x})) =>[{num:1},{num:2}...]

// 2.reduce Traverses array according to closure-set format, returns array or object. (Very important, can construct any element)
ary.reduce((acc,cur)=>{
  acc[cur] = 'id'+cur+'!'
  return acc
},{})

=>{1: 'id1!', 2: 'id2!', 3: 'id3!', 4: 'id4!', 5: 'id5!'}

```

Some of the above methods use closure mode for passing and return after internal recursion, which is quite interesting. I'll attach related implementation content at the end. If you're interested, you can try implementing them yourself! This will make you more familiar with these method operations!

Don't you have a question - the above are all array methods, what about objects? Array prototype methods can't be used on objects!?
Object prototype methods indeed have very few filtering methods XD, but we can convert objects to array mode for operations!

```javascript
const obj = { a: '123', b: '234', c: '345' };

Object.keys; // Returns an array of object keys

Object.keys(obj); // => ['a', 'b', 'c']

Object.values; // Returns an array of object values

Object.values(obj); // =>['123', '234', '345']
```

Seeing this pattern, does it ignite your small universe!! Let's try combining operations!

```javascript
const obj2 = { 1: { name: 'aaron' }, 2: { name: 'joke' }, 3: { name: 'mindy' } };

Object.values(obj2).filter(d => d.name === 'mindy'); // {name: 'mindy'}
```

## Logic Decomposition

An idea or concept for finding the key data we need - we can draw flows to try to conceptualize which data we need and is necessary when solving problems. Through this breakdown, we can decompose complex data into small atoms and continuously combine them.

## Problem Solving

After familiarizing ourselves with these combination operations, let's challenge a more difficult problem!

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

// Q: Sort by score from high to low, finally export users' desired groups, groups cannot be duplicated

// eslint-disable-next-line array-callback-return
memberList.sort((a, b) => { a.score - b.score; }); // First sort by high score order

// Group by groups
const groupBox = memberList.reduce((acc, cur, i) => {
  i === 0 && cur.order.forEach(d => (acc[d] = [])); // First put groups into object and set values as arrays
  cur.order.forEach((d, x) => {
    acc[d].push({ d, n: cur.member, s: cur.score, hopeIndex: x }); // Push into arrays according to order
  });
  return acc;
}, {});

const map = [];
let pointer = 0;
// Move pointer to push desired groups
while (pointer < memberList.length) {
  for (key in groupBox) {
    map.push(groupBox[key][pointer]); // At this point, the map array contains the order by score and user preference
    pointer++;
  }
}

// But this solution has a problem - for in doesn't guarantee key order. For important data arrays, it's recommended to separately save index values, which is more ideal!
```

If there are more interesting implementation methods, feel free to comment below~

[Array Implementation](https://github.com/eepson123tw/DeepLearnJs/blob/master/10%E8%B3%87%E6%96%99%E7%B5%90%E6%A7%8B%E6%93%8D%E4%BD%9C%E5%8F%8A%E5%AF%A6%E7%8F%BE/arrayApi.js)
[for in](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/for...in)
