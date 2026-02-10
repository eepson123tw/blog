---
title: Memory Layout
description: JavaScript, G/O, prototype chain
icon: 'lucide:lamp-desk'
gitTalk: false
date: 2022-05-06 23:23:00
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

In many interviews, fundamental JavaScript questions are frequently asked by interviewers, such as Hoisting, differences between var/let/const, closures, and so on. Today, I want to share another one of these fundamental topics with you - the prototype chain. To explain the prototype chain, we need to discuss the memory layout in JavaScript.

Before we execute any code, the JavaScript we write and the host environment's default APIs are stored in the "static area." During execution, V8 moves the code to corresponding other areas according to the execution order. But what is the host environment? Commonly mentioned examples include the client-side (browser) and server-side (node).

> In the ECMAScript specification, there is no clear definition of "host environment." It doesn't explicitly specify where standard input and output need to be implemented exactly, which leads to some confusion in JavaScript's built-in implementation. However, we can objectively consider that: the browser provides V8 with a basic message loop system, Global Object, and Web APIs, while V8's core implements some Native Objects and core functions defined by the ECMAScript standard. Additionally, V8 provides garbage collection and coroutine functionality.

--Quote from industry expert analysis

## Memory Layout

JavaScript values have two types: primitive values and reference values.

- Primitive values: Number, String, Boolean, Null, Undefined, Symbol
- Reference values: Object, function, Array, RegExp, Data, Date

We often search online for whether JavaScript passes by value, by address, or by reference. When I was researching this, I was often confused by these terms. Actually, we can draw simple diagrams to illustrate memory references, rather than memorizing these terms, which makes things much clearer.

Before drawing diagrams, let's think about how the following code is stored in memory:

```javascript
const a = 1;
const b = 2;
const c = 'aaron';
const d = true;
const e = [];
const f = {};
function fn() {}
```

### Memory Diagram

![Example 1](/images/memory_layout/ex1.webp)

In the simple diagram, we can see that when we declare variables assigned to primitive values, memory stores that value (**actually it's still an address, but for convenience we'll simplify it as the primitive value itself**), while reference values are remembered by memory as an address.

---

## Prototype Chain

Actually, after we execute code, a global Global Object is created, and this Global Object is related to the host environment. If we execute in a web environment, the browser provides us with DOM, BOM, setTimeout, setInterval, and a bunch of other web APIs, and they are all attached to the Global Object, then attached to the window for our use.

```javascript
Object.keys(window).length
>> 326; // That's quite a lot
```

---

Based on the simple diagram above, we understand that reference values in memory store an address. So what's inside this address?

### Two Important Properties in the Prototype Chain

```javascript
 __proto__ is a property, its value is an address
 prototype is an object that contains shared functions
```

```javascript
const e = [];
const f = {};
function fn() {}
```

![Example 2](/images/memory_layout/ex2.webp)

```javascript
const e = [];
e.__proto__ === Array.prototype;
true;
const f = {};
f.__proto__ === Object.prototype;
true;
function fn() {}
fn.__proto__ === Function.prototype;
true;
```

Each prototype object also has **__proto__**. The array prototype's __proto__ address points to the object prototype, while the object prototype's __proto__ address points to null. This probably just needs to be memorized.

```javascript
Array.prototype.__proto__ === Object.prototype;
true;
dir(Object.prototype__proto__);
undefined;
```

That's roughly the complete explanation. The prototype chain is simply how reference values' __proto__ addresses link together like a chain, sharing prototype methods with connected objects. This helps us understand why we can call those methods when we declare variables as reference values!

Additional note:
If you test the following code in a browser, something interesting happens:

```javascript
function person() {}
```

person.**__proto__** points to Function.prototype (as explained above).
If you call person.prototype, the browser returns an empty object {constructor: ƒ}.
This might make you think that person.prototype creates this object's memory location from the beginning, but that's not the case.
It's only created when called, for example, when you specifically write person.prototype or when you use new obj.
