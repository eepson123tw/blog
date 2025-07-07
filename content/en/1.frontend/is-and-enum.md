---
title: Applications of Type Guards and Enums
Description: Type Guard and Enum  
icon: 'lucide:radar'  
date: 2024-06-29 21:28:30  
read: '10' 
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---
> Applications of Type Guards and Enums

## Type Guard

Literally translated, Type Guard means "type guardian." We often need to create complex types based on backend API responses or programmatic logic operations. Sometimes VS Code throws errors, prompting us to exclude certain uncertain type definitions. While we can use officially defined [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) for some operations, more often we need to design these complex type definitions ourselves to narrow types to our desired scope. This is where type guards come in handy.

::alert{type='info' icon='lucide:info'}
Type Guard is a runtime check used to narrow the type range of variables.
::

### Basic Usage

A Type Guard is a special function that determines whether a variable belongs to a specific type based on certain conditions.

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

Enums are compiled types used to define a set of named constants. They help us express specific value collections more clearly, improving code semantics and readability. Enums can use numbers or strings as enumerated values, and by default, Enum values start from number 0 and auto-increment.

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

## Combined Use Case

I encountered a case where I wanted to add enum type guards to implementation logic. Through this approach, we can use fluent semantics to describe our logic.

[Example](https://www.typescriptlang.org/play/?#code/PTAEFMGcBsEsDsAuBaAJrSBDARtcz5wAPFOQ0AAUQE8AHKAYwCdZaUozFh4B7ZAV3j9I4VMgBumJpABQ4IQFtQAYR7QeTUAG8ZoPaABKo0AF5QAcgMBRACLmANLv0BxJuHmmLz61YByDpz0AIWh+cE9zIIAZAFUrcxkAXxkZADNBBkRYHnhQDFV1JgAKSVDwAC5QTHhqAEpK0rC8yBU1DW1A0DdEfiZcgHlsACtwTIA6Rqgigo1asYQGUNQpydqAbiSUhhzIRFBtwoA1TDKI6zsN2FTQIvy24oONY7La2o79fZ21cDH1AHMigADAAkWkeTGeYUSzSqoFKsFQrUKgPWSQg0BE73023gkG+vx4AJBYPukPA0IwoF4e0wcJOCKRGhRG2SQA)

## Advanced Usage Example

Suppose we need to handle complex API response data from the backend that may contain multiple types of information. We can combine Enums and Type Guards for type checking to ensure data correctness and consistency.

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

## Summary

We have deeply discussed Type Guards and Enums in TypeScript, and explored combining these two powerful tools to improve code safety and maintainability. Type Guards allow us to perform precise type checking at runtime, while enums provide a clear and semantic way to define a set of named constants.

Through practical examples, we demonstrated how to use these techniques when handling complex API response data. Give it a try!

## Reference Materials

- [Get Enum value](https://stackoverflow.com/questions/76807943/typescript-how-to-get-the-value-of-enum-type-in-type-definition)
- [Generic Type Guard with Enum](https://stackoverflow.com/questions/71973722/how-to-write-a-generic-type-guard-in-typescript)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
