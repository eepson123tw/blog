---
title: Simple Function Encapsulation
description: JavaScript, function, program, Encapsulation
icon: 'lucide:dice-4'
gitTalk: false
date: 2022-05-07 13:15:06
read: '20'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Simple Function Encapsulation

![Programming Paradigms Diagram](/images/fn/fn1.webp)

- Procedural Programming: Focuses on execution flow and control, implementing functionality through sequential execution of statements. The execution process of these statements is the entire program.
- Object-Oriented Programming: Organizes data and instructions into modules, achieving reuse through inheritance, polymorphism, delegation, and other methods.
- Functional Programming: Core idea is to write computational processes as a series of nested function calls, focusing on what to do rather than how to do it.
- Logic Programming: Only concerns itself with rules, facts, and problem derivation in a standardized way, without needing to worry about program control or specific implementation algorithms.

---

When searching for JavaScript encapsulation online, you'll often see keywords like object-oriented and functional programming. The core of all these approaches is to wrap abstract detailed logic, optimize and handle details, reduce development complexity, and provide it to users. We don't need to understand the deep encapsulation details to quickly use this logic and achieve our desired applications.
For example, the three major modern JS frameworks are also deeply encapsulated, providing developers with convenient APIs and framework environments~

Examples:

- Vue2, Vue3 -> Reactive object proxies (proxy, Object.defineProperty), observers, subscribers, renderers
- React's render, Redux, Hook functions

---

Today I want to introduce the simplest types of function encapsulation methods:

```javascript
Basic encapsulation return patterns:
    ()=>() //returns function
    ()=>{} //returns object with methods
    ()=>[] //returns array
    ()=>x?x:y //returns condition
    (function(root){})(window)//basic encapsulation anonymous function
```

## Returning Functions

```javascript
Assignment expression;
function add(m) {
  return function (n) {
    return m + n;
  };
}

add(10)(20) >> 30;
Complex expression: (x => y => x + y)(10)(20);
```

We use closure characteristics to temporarily store the values of m and n respectively. After returning, memory will be released, and we can get 30 as the return value.
We can also use complex expression syntax to rewrite the above code. Both writing methods are equivalent.

There are many application scenarios, for example, when we need to use regex to validate user input values and check for unexpected inputs. This encapsulation method can be used in such cases.

```javascript
function valid(rex) {
  return (val) => {
    return rex.test(val);
  };
}

const emailValid = valid(/^([\w\-.])+@([\w\-.])+\.([A-Z]{2,4})$/i);
emailValid('aaa@.asdasd');
false;
emailValid('aaa@gmail.com');
true;
```

After this layer of encapsulation, we can validate different inputs according to different regex rules, which is very convenient and highly reusable.

## Returning Objects with Methods

We encapsulate a function that returns an object, letting it return the logic encapsulated within, creating an interactive wallet.

```javascript
function newWallet(x){
  let money = x
  let log = (key)=>{
    if(!log[name]) log[name]={}
    if(log[name][key]!==undefined) return true
    log[name][key] = new Date().toLocaleString()
  }
  return{
    checkMoney:()=>{console.log(money)},
    use:(x)=>{
      money= x(money)
      log(x.name)  //pass function name as key
      return money
    },
    printLog:()=>{
      console.log(log[name])
    },
  }

}
 const aaronMoney = newWallet(100);
 const buyDrink = (x) => x - 10;
 const buyLunch = (x) => x - 60;
aaronMoney.use(buyDrink);
aaronMoney.use(buyLunch);
aaronMoney.checkMoney();
>30
aaronMoney.printLog();
>{buyDrink: '2022/5/7 PM 2:24:34', buyLunch: '2022/5/7 PM 2:24:34'}
```

---

## Returning Arrays

We can return the values we want through an encapsulated function, and we can even combine these logics through the nesting patterns shared before, which is quite interesting.

```javascript
const arr = [1, 3, 'a', 'd', 5, 8, '9'];
// Encapsulation to filter out numbers
function getNumbers(arr) {
  const newArr = [];
  arr.forEach((item) => {
    if (typeof item === 'number') {
      newArr.push(item);
    }
  });
  return newArr;
}
getNumbers(arr); // Get numbers

function getEvenNumbers(arr) {
  const newArr = [];
  arr.forEach((item) => {
    if (item % 2 === 0) {
      newArr.push(item);
    }
  });
  return newArr;
}
getEvenNumbers(getNumbers(arr)); // Get even numbers
```

## Returning Conditions

```javascript
function tellMe(b) {
  return b === true ? 'can' : 'cannot';
}
tellMe(false);

function isNumberEven(number) {
  return number > 0 ? (number % 2 === 0) : false;
}
isNumberEven(8);

Can also combine with previous applications;

function conditionOne(a, b) {
  return console.log(`${a.name} is ${a.height - b.height}cm taller than ${b.name}, he goes to military service`);
}
function conditionTwo(a, b) {
  return console.log(`${b.name} is ${b.height - a.height}cm taller than ${a.name}, he goes to military service`);
}
function beSoldier(a, b) {
  return a.height > b.height ? conditionOne(a, b) : conditionTwo(a, b);
}

beSoldier({ name: 'Aaron', height: 180 }, { name: 'Eric', height: 170 }); // Aaron goes to military service QQ
```

---

## Basic Encapsulation with Anonymous Functions

This is the method used by frameworks, mounting things to the window for convenient access.

```javascript
// eslint-disable-next-line no-shadow-restricted-names
(function (root, undefined) {
  // Private state
  const age = 20;
  const name = 'aaron';
  let money = 87;

  function show(x) {
    return x === 'you'
      ? `Your name is ${name} and ${age} years old.`
      : x === 'money'
        ? `your money is ${money}`
        : 'what?';
  }
  function getMoney() {
    return `your money is ${money}`;
  }
  function setMoney(m) {
    return (money += m);
  }
  function codingTime() {
    return (
      `${Math.abs(new Date(2022, 11) - new Date(2020, 10)) / (1000 * 60 * 60 * 24)} days`
    );
  }

  // Save reference externally, a simple way to expose methods
  root.Who = { show, getMoney, setMoney, codingTime };
})(window);

Who.show('you');
Who.show('age');
Who.codingTime();
```

With these methods introduced above, if you apply good detail handling and mutual application, you can also write interesting libraries for people to use~
