---
title: Day 2 函式
description: Python、Function、OOP
icon: 'lucide:coffee'
gitTalk: false
date: 2024-12-30 22:05:00
read: '15'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---



> Python-002 函式

今天繼續探索 Python 中很重要的一環：函式。學習函式可以增強程式重用性與維護性。
通過以下範例和解釋，將會學習如何寫出清晰又有效的函式。

## 1. 基本函式使用

跟 JavaScript 相同函式可以多次的調用，並有自己的作用域存在(我是這樣理解的 😇)。
但 Python 有一個有趣的點，就是與 JavaScript 相比，引用的方式是相反的。不知道其他語言是否也是這樣呢？
在 Python 中，使用 `def` 關鍵字來宣告函式。

### 定義與執行函式

```python
from random import random -> 從 random 模組引入 random 函式

def functionCall():
    pass # 不執行任何操作

def numToString(num: int) -> str: # 類似 ts 的型別定義
    return str(num)

print(type(numToString(123)))  # str
```

```javascript
import { random, shuffle } from 'lodash'; -> 從某個模組載入一組功能

```

## 2. 函式參數

Python 的函式參數有個很有趣的地方，就是可以具名引入，
我們可以在呼叫函式時，直接傳入位置參數，也可以使用具名參數來指定對應的值。

### 典型參數使用

```python
def greet(name, msg):
    print(f'Hello {name}, {msg}')

greet('World', 'Good morning')
greet(name='World', msg='Good morning')
greet(msg='Good morning', name='World')
```

### 專用參數 (\*)

在 Python 中，可以使用 `*` 來指定專用參數（keyword-only arguments）。這些參數必須以具名方式傳入，而不能使用位置參數。

```python
def greet(name, *, msg):
    print(f'Hello {name}, {msg}')

# 正確的呼叫方式
greet('World', msg='Good morning')
# 錯誤的呼叫方式，會引發 TypeError
# greet('World', 'Good morning')
```

## 3. 可變參數 (\*args, \*\*kwargs)

這個部分是筆者覺得 Python 最好玩的地方，可以快速的解構參數，不論是物件參數還是非物件參數，都有對應的解構方式，
讓函式呼叫時簡單且省了很多心力QQ

- `*args`:允許函式接受任意數量的位置參數，並將它們打包成一個元組（tuple）。
- `**kwargs`: 允許函式接受任意數量的具名參數，並將它們打包成一個字典（dictionary）。
- `*`: 可以將 list 結構解構成單一參數，可以與 JavaScript 一樣收集剩餘未使用參數並使之成為 list，合併多項參數

```python
def print_args(*args):
    print(args)

print_args(1, 2, 3, 4, 5) # (1, 2, 3, 4, 5)
print_args()  # ()

def print_kwargs(*a, **kwargs):
    print(kwargs, a)

print_kwargs(1, 2, name='World', msg='Good morning') # {'name': 'World', 'msg': 'Good morning'} (1, 2)
```

```python
def print_all(a, b, c, *args, **kwargs):
    """
    Combine all
    a, b, c: positional arguments
    args: tuple of positional arguments
    kwargs: dictionary of keyword arguments
    """
    print(a, b, c, args, kwargs)

heroes = ['batman', 'superman', 'wonder woman']
# * 可以解構
print_all(*heroes, name='World', msg='Good morning') # batman superman wonder woman () {'name': 'World', 'msg': 'Good morning'}
print(print_all.__doc__)
```

```python

heroes = ['batman', 'superman', 'wonder woman']
a, b, c = heroes

def greet(hero1, hero2, hero3):
    print(f"Hello {hero1}, {hero2}, and {hero3}")

greet(*heroes)  # Hello batman, superman, and wonder woman

first, *rest = heroes
print(first)  # 'batman'
print(rest)   # ['superman', 'wonder woman']

villains = ['joker', 'lex']
all_characters = [*heroes, *villains]
print(all_characters)  # ['batman', 'superman', 'wonder woman', 'joker', 'lex']
```

## 4. 記憶區規則 (LEGB)

Python 的變數查找遵循 LEGB 規則，這是一個由內而外的查找順序：

- **Local (區域)**: 最內層，包含當前函式內的名稱空間
- **Enclosing (封閉)**: 包含外層函式的名稱空間
- **Global (全域)**: 當前模組的全域名稱空間
- **Built-in (內建)**: Python 內建的名稱空間

感覺跟 JavaScript 真的很像，改天來看看為何要這樣設計🫠

### LEGB 模型

```python
x = 'global'  # 全域變數

def outer():
    x = 'enclosing'  # 封閉作用域變數

    def inner():
        x = 'local'  # 區域變數
        print(x)  # 會輸出 'local'

    inner()
    print(x)  # 會輸出 'enclosing'

outer()
print(x)  # 會輸出 'global'
```

::alert{type="info"}
當 Python 尋找一個變數時，會依序從最內層開始查找：

1. 先在當前函式的區域空間尋找
2. 若找不到，則往上一層封閉函式查找
3. 再找不到，就查找全域空間
4. 最後才會查找 Python 的內建空間
::

## 5. Lambda 函式

Lambda 函式是 Python 中的一種匿名函式，用於創建簡單的單行函式。主要用於需要函式物件但不需要完整函式定義的場合。
我是不太習慣這樣的寫法，要多適應一下。

```python
# 基本 Lambda 函式
add = lambda *args: sum(args)
print(add(1, 2, 3, 4, 5))  # 輸出: 15

# 用於排序 - 將奇數排在偶數前面
print(sorted([1, 2, 3, 4, 5], key=lambda x: x % 2 != 0))
# 輸出: [2, 4, 1, 3, 5]

# 用於過濾 - 只保留偶數
print(list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5])))
# 輸出: [2, 4]
```

## 6. Closure (閉包) 與裝飾器

閉包是一個函式物件，它可以記住建立時的環境變數。
簡單來說就是跟 JavaScript 一樣，能夠記住不存在於此函式空間內的參數~

```python
def outer_function(msg):
    def inner_function():
        print(msg)  # 內部函式可以存取外部函式的變數
    return inner_function

# 創建兩個閉包
hi_func = outer_function('Hi')
hello_func = outer_function('Hello')

# 呼叫閉包
hi_func()        # 輸出: Hi
hello_func()     # 輸出: Hello

# 檢查閉包內部結構
print(hi_func.__closure__[0].cell_contents)  # 輸出: Hi
print(hi_func.__code__.co_freevars)         # 輸出: ('msg',)
```

### Decorator (裝飾器)

裝飾器是一種設計模式，允許我們在不修改原始函式的情況下，擴充其功能。

::alert{type="info"}
這樣可以在不改變原始函式的情況下，加入額外的功能，如記錄日誌、性能測量等
::

```python
def decorator_function(original_function):
    def wrapper_function(*args, **kwargs):
        print(f'wrapper executed this before {original_function.__name__}')
        return original_function(*args, **kwargs)
    return wrapper_function

@decorator_function
def display_info(name, age):
    print(f'display_info ran with arguments {name} and {age}')

display_info('John', 25)

# 輸出:
# wrapper executed this before display_info
# display_info ran with arguments John and 25

```

## 7. 組合應用

### 遞迴 (Recursion)

遞迴是一種函式在內部呼叫自己的技術，適用於處理像是分治法、階乘或樹結構遍歷等問題。

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(10))  # 輸出: 3628800
```

遞迴的優勢在於其結構簡潔，但需要注意可能導致的遞迴深度限制或效能問題。

### 生成器 (Generator)

生成器是一種延遲計算的技術，可用於處理需要大量資料但不希望一次性載入的情境。

#### 範例：產生一個數列

```python
def generator_function(num):
    for i in range(num):
        yield i

g = generator_function(10)
print([i for i in g])  # 輸出: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

生成器適合處理需要大量迭代或流式數據的場景，例如讀取大檔案或產生無窮數列。

## Key point

今天介紹了 Python 函式的使用方式，包括基礎定義、參數使用方法、\*args 與 \*\*kwargs 的特性，以及 LEGB 變數查找規則。也提到了 Lambda 函式、閉包、裝飾器，以及遞迴和生成器的使用方式。
透過這些範例可以發現 Python 與其他語言相似的地方，同時也有自己的特色(?，像是關鍵字專用參數、更加靈活的解構用法等，學廢了學廢了😇
希望這些範例能幫助大家更加理解並靈活運用 Python 函式。


