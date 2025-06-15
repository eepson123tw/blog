---
title: Type 與 Interface 的差異
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

> Type 與 Interface 的差異

最近在學習TypeScript時，覺得Type跟Interface這兩種定義型別的方式，有種若即若離的關係，
定義型別何時要用type、何時要用Interface呢?自己也無法解釋的很清楚，於是想把在網路上找到的知識，
以及自己的實作做些統整，加深自己的記憶點。

## Type

定義型別的一種方法，可採用顯式的定義，也可使用隱式的類型推斷，常用來定義較為簡易的型別類型(較為推薦)，
對定義之型別，有較多的操作空間，TypeScript提供了許多工具類型的type供我們使用。可以表示原始類型、聯合類型、元組類型和物件類型。

```typescript
// 簡易地定義屬性
type Apple = string;
// 以物件類型定義屬性

interface Aaron { // eslint 覺得我應該用 interface 🤣
  year: number;
  kind: string;
  IQ?: number; // =>?代表選填
  (): string; // => 可以被執行
  [key: string]: any; // =>可以接受任何 index
  new (aaron: string): string; // => 可以被實例化
  readonly weight: number; // =>只讀屬性
}

function test(Fn: aaron) {
  console.log(s.IQ, s.year, s());
  return new Fn('aaron');
}

// 工具類型操作 getType
 type GetType<T, K extends keyof T> = { [S in K]: T[S] };
 type c = GetType<aaron, 'year'>;
 // type c = {
 //   year: number;
 // }

// 工具類型操作 exclude
// 利用簡單型別的分配律，去除限制型別，可以把 extends視為限制的關鍵，T 必須符合 K 的條件。
type ExcludeType<T, K extends T> = T extends K ? never : T;
type a = ExcludeType<'year' | 'age' | 'now', 'year'>; // age,now

// 去除readOnly屬性 -號可以去除modified修飾詞，預設是+readonly，不用+是因為ts編譯時幫我們加上去了。
interface Book {
  readonly buyYear: number;
  readonly kind: string;
  readonly cost: number;
}

type ReadonlyRemove<T> = { -readonly[S in keyof T ]: T[S] };
type x = ReadonlyRemove<Book>;
```

## Interface

用來形容或描述物件的結構或屬性的型別，也因為Js有許多物件結構的描述，較能用來描述這些預設的js行為~

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
// 定義class時 可以使用 interface規範 所需的屬性
// eslint-disable-next-line ts/no-unsafe-declaration-merging
class Myclass implements myInterFace {

}

// 繼承(擴充)
// eslint-disable-next-line ts/no-unsafe-declaration-merging
interface Myclass extends myInterFace {

}

// 當然也可以這樣使用
interface cake<T, K> {
  cost: T;
  size: K;
}

const a: cake<number, string> = {
  cost: 18,
  size: 'big'
};
```

**補充 [key:string|number|symbol] 若建立key必須符合以下型別，不然會ERROR。**

## Type vs Interface

**與interface的差異在於無法重複覆值，沒有overload特性及merging特性，並且不能繼承實作物件與其屬性。**
而且語意上也有些需差異，需要多方評估後挑適合的使用。

```typescript
interface Aaron { year: number;height: number } // <-顯式定義
interface Aaron { kind: string } // <- Duplicate identifier 'Aaron' 無法合併

interface Hellen { year: number;height: number }
interface Hellen { kind: string }// <- Hellen屬性中有year,height,kind => merging 合併了

interface cake {
  cost: string;
  size: number;
  match: ((s: string) => void) & ((s: number) => number); // overload
}

function testOne(a: cake): number {
//  return a.match('s') // string
  return a.match(18); // number
}

// 例如 哪一個更符合座標物件的型別描述呢?
type Point = [number, number];

interface Point {
  x: number;
  y: number;
}
```

簡單下個結論，就是使用前先思考要定義的是原始的型別，亦或是物件型別，若是物件型別是否需要操作其中的屬性，
還是單純的表示構造屬性，若需要操作就可以考慮type，反之則可以使用interface做為表示~

若有不同的看法，歡迎在下方留言~

[TypeScript官網描述](https://www.typescriptlang.org/cheatsheets)
[TypeScript DeepDive](https://basarat.gitbook.io/typescript)
