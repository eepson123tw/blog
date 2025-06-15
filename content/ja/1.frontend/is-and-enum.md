---
title: Type Guard 與 Enum 的應用
description: Type Guard and Enum
icon: 'lucide:radar'
gitTalk: false
date: 2024-06-29 21:28:30
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Type Guard 與 Enum 的應用

## Type Guard

文字上翻譯的 Type Guard 就是類型守衛。我們經常需要根據後端的 API 響應或是程式碼邏輯操作來建立複雜的類型。有時候 VS Code 會報錯，提示我們需要排除一些不確定的類型定義。我們可以透過官方定義的 [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) 來做一些操作，但更多時候我們需要自行設計這些複雜的類型定義，以將型別限縮在我們希望的範圍中，這時類型守衛就派上了用場。

::alert{type='info' icon='lucide:info'}
Type Guard 是一種 Run time 檢查，用來細化變量的類型範圍。
::

### 基本用法

Type Guard 是一種特殊的函數，它根據某些條件來判斷變量是否屬於特定類型。

```typescript
function isNumber(value: any): value is number {
  return typeof value === 'number';
}

const someValue: number = 42;

if (isNumber(someValue)) {
  console.log(`${someValue} is a number`);
} else {
  console.log(`${someValue} is not a number`);
}
```

## Enum

枚舉是一種會被編譯的類型，用於定義一組命名的常量。它可以幫助我們更清晰地表達特定的數值集合，提高程式碼的語義和可讀性。
Enum 可以用數字或字符串作為枚舉值，且默認情況下，Enum 的值會從數字 0 開始自動遞增。

```typescript
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2,
}

enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
```

## 結合案例

這時我遇到了一個案例希望能在實作邏輯中添加枚舉的型別守衛，透過這種方式，我們能夠用通順地語義，描述我們的邏輯。

[example](https://www.typescriptlang.org/play/?#code/PTAEFMGcBsEsDsAuBaAJrSBDARtcz5wAPFOQ0AAUQE8AHKAYwCdZaUozFh4B7ZAV3j9I4VMgBumJpABQ4IQFtQAYR7QeTUAG8ZoPaABKo0AF5QAcgMBRACLmANLv0BxJuHmmLz61YByDpz0AIWh+cE9zIIAZAFUrcxkAXxkZADNBBkRYHnhQDFV1JgAKSVDwAC5QTHhqAEpK0rC8yBU1DW1A0DdEfiZcgHlsACtwTIA6Rqgigo1asYQGUNQpydqAbiSUhhzIRFBtwoA1TDKI6zsN2FTQIvy24oONY7La2o79fZ21cDH1AHMigADAAkWkeTGeYUSzSqoFKsFQrUKgPWSQg0BE73023gkG+vx4AJBYPukPA0IwoF4e0wcJOCKRGhRG2SQA)

## 進階使用範例

假設我們需要處理來自後端的複雜 API 響應數據，這些數據可能包含多種類型的信息。我們可以結合 Enum 和 Type Guard 來進行類型檢查，確保數據的正確性和一致性。

```typescript
enum ApiResponseStatus {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Loading = 'LOADING',
}

interface ApiResponseBase {
  status: ApiResponseStatus;
}

interface ApiResponseSuccess<T> extends ApiResponseBase {
  status: ApiResponseStatus.Success;
  data: T;
}

interface ApiResponseError extends ApiResponseBase {
  status: ApiResponseStatus.Error;
  message: string;
}

interface ApiResponseLoading extends ApiResponseBase {
  status: ApiResponseStatus.Loading;
}

type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError | ApiResponseLoading;

function isApiResponseSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponseSuccess<T> {
  return response.status === ApiResponseStatus.Success;
}

function isApiResponseError<T>(response: ApiResponse<T>): response is ApiResponseError {
  return response.status === ApiResponseStatus.Error;
}

function isApiResponseLoading<T>(
  response: ApiResponse<T>
): response is ApiResponseLoading {
  return response.status === ApiResponseStatus.Loading;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = await response.json();

  if (response.ok) {
    return {
      status: ApiResponseStatus.Success,
      data: data as T,
    };
  } else {
    return {
      status: ApiResponseStatus.Error,
      message: 'Failed to fetch data',
    };
  }
}

async function handleApiResponse<T>(url: string) {
  const response = await fetchData<T>(url);

  if (isApiResponseSuccess(response)) {
    console.log('Data:', response.data);
  } else if (isApiResponseError(response)) {
    console.error('Error:', response.message);
  } else if (isApiResponseLoading(response)) {
    console.log('Loading...');
  } else {
    console.error('Unknown response status');
  }
}

handleApiResponse<{ id: number; name: string }>('https://api.example.com/getData');
```

## 總結

我們深入討論了 TypeScript 中的類型守衛（Type Guard）和枚舉（Enum），並嘗試結合這兩種強大的工具來提高代碼的安全性和可維護性。
Type Guard 允許我們在運行時進行精確的類型檢查，而枚舉提供了一種清晰且有語義的方式來定義一組命名常量。

通過實際範例，我們展示了如何在處理複雜的 API 響應數據時使用這些技術。
嘗試使用看看吧～

## 參考資料

- [Get Enum value](https://stackoverflow.com/questions/76807943/typescript-how-to-get-the-value-of-enum-type-in-type-definition)
- [Generic Type Guard with Enum](https://stackoverflow.com/questions/71973722/how-to-write-a-generic-type-guard-in-typescript)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
