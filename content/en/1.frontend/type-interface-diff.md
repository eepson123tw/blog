---
title: Differences Between Type and Interface
description: TypeScript
icon: 'lucide:orbit'
gitTalk: false
date: 2022-12-15 21:18:08
read: '12'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Differences Between Type and Interface

Recently, while learning TypeScript, I felt that Type and Interface, these two ways of defining types, have an ambiguous relationship. When should we use type and when should we use Interface for defining types? I couldn't explain it clearly myself, so I wanted to consolidate the knowledge I found online and my own implementation to deepen my memory.

## Type

A method for defining types that can use explicit definition or implicit type inference. Commonly used to define simpler type categories (more recommended). It provides more operational space for defined types, and TypeScript offers many utility types for our use. It can represent primitive types, union types, tuple types, and object types.

```typescript
// Simple property definition
type Apple = string;
// Define properties as object type

interface Aaron { // eslint thinks I should use interface 🤣
  year: number;
  kind: string;
  IQ?: number; // =>? represents optional
  (): string; // => can be executed
  [key: string]: any; // =>can accept any index
  new (aaron: string): string; // => can be instantiated
  readonly weight: number; // =>readonly property
}

function test(Fn: aaron) {
  console.log(s.IQ, s.year, s());
  return new Fn('aaron');
}

// Utility type operations getType
 type GetType<T, K extends keyof T> = { [S in K]: T[S] };
 type c = GetType<aaron, 'year'>;
 // type c = {
 //   year: number;
 // }

// Utility type operations exclude
// Using distributive law of simple types to remove restricted types, you can view extends as a restriction keyword, T must meet K's conditions.
type ExcludeType<T, K extends T> = T extends K ? never : T;
type a = ExcludeType<'year' | 'age' | 'now', 'year'>; // age,now

// Remove readOnly property - the minus sign can remove modified modifiers, default is +readonly, we don't need + because ts compiler adds it for us during compilation.
interface Book {
  readonly buyYear: number;
  readonly kind: string;
  readonly cost: number;
}

type ReadonlyRemove<T> = { -readonly[S in keyof T ]: T[S] };
type x = ReadonlyRemove<Book>;
```

## Interface

Used to describe or define the structure or properties of objects. Since JavaScript has many object structure descriptions, it's more suitable for describing these default JavaScript behaviors~

```typescript
interface myInterFace {
  [propname: string]: any;
  name: string;
  age?: number;
  say: () => void;
}

interface myInterFace {
  gender: string;
}

const obj: myInterFace = {
  name: '123',
  age: 12,
  gender: '12312313123'
};
// When defining class, you can use interface to specify required properties
// eslint-disable-next-line ts/no-unsafe-declaration-merging
class Myclass implements myInterFace {

}

// Inheritance (extension)
// eslint-disable-next-line ts/no-unsafe-declaration-merging
interface Myclass extends myInterFace {

}

// Of course you can also use it like this
interface cake<T, K> {
  cost: T;
  size: K;
}

const a: cake<number, string> = {
  cost: 18,
  size: 'big'
};
```

**Note: [key:string|number|symbol] If creating keys, they must conform to the following types, otherwise there will be an ERROR.**

## Type vs Interface

**The difference from interface is that it cannot be repeatedly assigned, has no overload characteristics and merging features, and cannot inherit and implement objects and their properties.**
There are also some semantic differences that need to be evaluated from multiple perspectives before choosing the appropriate one to use.

```typescript
interface Aaron { year: number;height: number } // <-explicit definition
interface Aaron { kind: string } // <- Duplicate identifier 'Aaron' cannot merge

interface Hellen { year: number;height: number }
interface Hellen { kind: string }// <- Hellen properties include year,height,kind => merging combined

interface cake {
  cost: string;
  size: number;
  match: ((s: string) => void) & ((s: number) => number); // overload
}

function testOne(a: cake): number {
//  return a.match('s') // string
  return a.match(18); // number
}

// For example, which one better describes the type of a coordinate object?
type Point = [number, number];

interface Point {
  x: number;
  y: number;
}
```

To draw a simple conclusion, before using, first think about whether you're defining primitive types or object types. If it's an object type, do you need to manipulate its properties, or are you simply representing structural properties? If you need manipulation, consider using type; otherwise, you can use interface for representation~

If you have different views, feel free to comment below~

[TypeScript Official Documentation](https://www.typescriptlang.org/cheatsheets)
[TypeScript DeepDive](https://basarat.gitbook.io/typescript)
