---
title: Day 1 探索
description: Python、Base learning、Discover
icon: 'lucide:cable-car'
gitTalk: false
date: 2024-11-03 15:04:30
read: '15'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---


> Python-001 探索

基於專案的因素，開始學習 Python 的語法以及框架知識，
此篇紀錄觀察有趣的學習點及差異點。

::alert{type="info"}
保持滾動式的更新😵‍💫
::

## 環境架設

在開始學習 Python 之前，需要先設置開發環境。以下是一些基本步驟：

1. **安裝 Python**:

- 前往 [Python 官方網站](https://www.python.org/downloads/) 下載並安裝最新版本的 Python。
- 安裝完成後，打開終端機（Terminal）並輸入 `python --version` 確認安裝成功。

2. **設置虛擬環境**:

- 使用 `venv` 模組來創建虛擬環境，避免不同專案之間的依賴衝突。
- 創建虛擬環境：`python -m venv myenv`
- 啟動虛擬環境：
- Windows: `myenv\Scripts\activate`
- macOS/Linux: `source myenv/bin/activate`

3. **安裝必要的套件**:

- 使用 `pip` 來安裝所需的套件，例如 `requests`、`flask` 等。
- 安裝套件：`pip install requests flask`

4. **設置 IDE**:

- 推薦使用 VSCode 或 PyCharm 作為開發工具，我是用 VSCode。
- 安裝 Python 插件以獲得語法 highlight、code autocomplete 功能。

## 基礎語法

::alert{type="warning"}
Python 和 JavaScript 都是直譯語言（interpreted languages），但它們的執行方式略有不同：

- Python: 通過 Python 直譯器（如 CPython）直接執行
- JavaScript: 主要在瀏覽器的 JS 引擎（如 V8）中執行，也可通過 Node.js 在伺服器端執行

兩者都是動態型別語言，在執行時才進行型別檢查，需要小心🥲。

主要差異：

- Python 使用縮排來定義程式區塊
- JavaScript 使用大括號來定義程式區塊
- Python 的命名習慣用 snake_case
- JavaScript 的命名習慣用 camelCase

::

Python 是一個動態型別的直譯語言，雖然在某些方面與 JavaScript 類似，但它們在語法結構和類型處理上有很大的差異。
以下是一些基本的 Python 語法特點：

### String

字串在 Python 中可以用單引號或雙引號表示，多行字串則使用三個引號：

```python
# 基本字串
name = "Python"
description = 'Programming Language'

# 多行字串
multi_line = """
This is a
multi-line string
"""

# 字串格式化
name = "Allen"
age = 30
print(f"My name is {name} and I'm {age} years old")  # f-string
print("My name is {} and I'm {} years old".format(name, age))  # format()

# 字串操作
text = "Hello Python"
print(text.upper())  # 轉大寫
print(text.lower())  # 轉小寫
print(text.split())  # 分割字串
```

一些常見的字串方法：

- `len()`: 取得字串長度
- `strip()`: 移除頭尾空白
- `replace()`: 替換字串
- `startswith()/endswith()`: 檢查字串開頭/結尾

::alert{type="info"}
需要注意的是，Python 中的字串是不可變的（immutable），這點與 JavaScript 相同。
::

### Number

在 Python 中，數字的處理有許多有趣的特性和方法：

```python
import math

# 基本型別
print(type(1450))      # 整數型別
print(type(1450.0))    # 浮點數型別

# 除法運算
print(1450//1000)      # 整數除法
print(1450/100)        # 浮點數除法

print(3**2)            # 次方運算

# 四捨五入
print(round(3.1415926, 2))    # 取小數點後兩位

# 銀行家捨入法（Python 3 採用）
print(round(3.5))      # 結果為 4
print(round(-4.5))     # 結果為 -4
print(round(0.5))      # 結果為 0

# 數學函式
print(math.pi)         # 圓周率
print(math.ceil(3.14)) # 無條件進位
print(math.floor(3.14))# 無條件捨去
print(math.sqrt(9))    # 開根號

# 型別轉換
age = 20
print(float(age))      # 轉換為浮點數
print(type(str(age)))  # 轉換為字串
print(bool(age))       # 轉換為布林值

# 科學記號
print(type(1e3))       # 1000.0 的科學記號
print(int(1e3))        # 轉換為整數

# 特殊數值
nan1 = float('nan')    # Not a Number
print(nan1)
print(type(nan1))

# 無限大（最大值為 1.7976931348623157e+308）
p_inf1 = float('inf')
print(type(p_inf1))

# 字串格式化
my_money = 1000000
print(f"我有 {my_money} 元")
print(f"{my_money:,}")       # 千分位格式
print(f"{my_money:.2f}")     # 小數點後兩位

ratio = 0.315
print(f"{ratio:.1%}")        # 百分比格式

# 對齊方式
pi = 3.1415926
print(f"|{pi:<20}|")        # 靠左對齊
print(f"|{pi:>20}|")        # 靠右對齊
print(f"|{pi:^20}|")        # 置中對齊
print(f"|{pi:x<20.2f}|")    # 自訂填充字元

# 補零
score1, score2 = 123, 1450
print(f"{score1:08}")       # 00000123
print(f"{score2:08}")       # 00001450

# 時間格式
hour, minute, second = 3, 12, 7
print(f"{hour:02}:{minute:02}:{second:02}")  # 03:12:07

# 字串切片
message = "hellokitty"
print(f"{message[:5]}")     # 取前五個字元

# 切片物件
reverse = slice(None, None, -1)    # 反轉
all = slice(None, None, None)      # 全部
last_5 = slice(-5, None, None)     # 最後五個

print(f"{message[reverse]}")
print(f"{message[all]}")
print(f"{message[last_5]}")

# 位元組
data = b"hello"
print(list(data))
```

::alert{type="info"}

1. Python 的數值運算非常直觀，但要注意整數除法（//）和一般除法（/）的區別
2. 銀行家捨入法（Banker's Rounding）是為了減少累積誤差
3. 使用 f-string 進行格式化時，可以使用多種對齊和格式化選項
4. Python 的數值範圍相當大，但仍有上限

::

### Bool

在 Python 中，布林值和控制流程的操作有一些獨特之處：

```python
# 布林值轉換
print(float(True))     # 1.0
print(float(False))    # 0.0
print(1 == True)       # True
print(0 == False)      # True
print(1.0 == True)     # True
message = "Hello, World!"
print(message[True])   # 'e' (True 被當作索引 1)

# 邏輯運算子
print(True and True)   # True
print(True and False)  # False
print(False and True)  # False
print(False or False)  # False
print(True or False)   # True
print(not True)        # False

# 短路求值
False and print('不會執行')
True or print('不會執行')
True and print('會執行')

# 流程控制
x = 10
if x > 5:
	print('x 大於 5')
elif x < 5:
	print('x 小於 5')
else:
	print('x 等於 5')

# 三元運算子
x, y = 10, 20
max_num = x if x > y else y

# match 陳述句（Python 3.10+）
value = 10
match value:
	case 1:
		print('值為 1')
	case 2:
		print('值為 2')
	case _:
		print('其他值')

# match 與型別匹配
data = 100
match data:
	case int() | float():
		print('數字型別')
	case str():
		print('字串型別')
	case _:
		print('其他型別')

# match 與結構匹配
user = ['John', 30]
match user:
	case ['John', age]:
		print(f'John 今年 {age} 歲')
	case [name, age]:
		print(f'{name} 今年 {age} 歲')

# 字典匹配
person = {'name': 'John', 'age': 30}
match person:
	case {'name': 'John', 'age': age}:
		print(f'John 今年 {age} 歲')

# 條件匹配
nums = [2, 3]
match nums:
	case x, y if x % 2 == 0:
		print(f'{x} 是偶數')
	case _:
		print('奇數')
```

::alert{type="info"}

1. Python 的 Bool 是 `True` 和 `False`（首字母大寫）
2. 支持短路求值（short-circuit evaluation）
3. match 陳述句（Python 3.10+）提供強大的模式匹配功能
4. 三元運算子的語法比較直觀，但不要寫太巢狀

::

::alert{type="warning"}

- Python 中 `0`、`空字串`、`空列表`、`None` 都會被視為 `False`
- match 陳述句需要 Python 3.10 或更新版本

::

### Loop

Python 提供了多種迴圈操作方式，以下是一些常見的用法：

```python
# 基本迴圈
numbers = [1, 2, 3, 4, 5]

# 遍歷列表
for num in numbers:
	print(num)

# 使用 range
for num in range(1, 6):
	print(num)

# 遍歷字串
for char in 'hello':
	print(char)

# 變數作用域示例
for num in range(1, 6):
	hey = "123123"
	print(num)

print(num)    # 迴圈結束後仍可存取
print(hey)    # 迴圈內定義的變數也可存取

# 列表操作
heroes = ['batman', 'superman', 'wonder woman']

# enumerate 用法
print(list(enumerate(heroes)))

heroes = ["悟空", "達爾", "蜘蛛人", "蝙蝠俠"]
# 從 1 開始計數
for i, hero in enumerate(heroes, 1):
	print(f"{i} {hero}")

# break 與 else 子句
for num in range(1, 6):
	if num == 3:
		break
	print(num)
else:  # break 時不執行
	print('Loop completed')

# 替代方案
for num in range(1, 6):
	if num == 3:
		break
	print(num)
if not num != 3:
	print('Loop completed')

```

::alert{type="tip"}

1. `enumerate()` 函數可以同時獲取索引和值
2. Python 迴圈的 `else` 子句在迴圈正常完成時執行
3. `break` 會跳過 `else` 子句
4. 迴圈變數在迴圈結束後仍然可用

::

::alert{type="warning"}

- 注意變數作用域，Python 不像 JavaScript 有 block scope
- `else` 子句在迴圈中的行為可能不直觀

::

### List

Python 的列表（List）是最常用的資料結構之一，具有動態大小和靈活的操作方式：

```python
# 基本操作
hershey = ['chocolate', 'caramel', 'nougat', 'almonds', 'toffee']

# 成員檢查
if "caramel" in hershey:
	print("找到 caramel")

# 索引和計數
print(hershey.index('caramel'))  # 取得位置
print(hershey.count('caramel'))  # 計算出現次數

# 添加和擴展
hershey.append('peanuts')        # 添加單一元素
hershey.extend(['raisins', 'coconut'])  # 添加多個元素

# 排序
sorted_hershey = sorted(hershey, key=len)  # 按長度排序

# 清空列表
hershey.clear()

# 列表解析（List Comprehension）
numbers = [num for num in range(5)]
zeros = [0 for _ in range(5)]

# 切片操作
print(sorted_hershey[1:3])       # 取得部分元素
sorted_hershey[1:3] = ['new1', 'new2']  # 替換部分元素

# 列表組合
comics = ['Spider', 'Bat', 'Super']
marvel = ['Iron', 'Thor', 'Hulk']
all_comics = [*comics, *marvel]  # 解包組合

# 深淺拷貝
import copy
copy_list = copy.deepcopy(sorted_hershey)
```

::alert{type="tip"}

1. 列表是可變的（mutable）
2. 支援多種操作方法：`append`、`extend`、`remove`、`pop`等
3. 列表解析提供簡潔的創建方式
4. 使用星號（\*）運算符可以解包列表

::

::alert{type="warning"}

- 深拷貝和淺拷貝的區別要注意
- 列表修改會影響所有引用
- 大型列表操作要考慮性能影響

::

### Set & Tuple

在 Python 中，Set 和 Tuple 是兩種不同的數據結構，各有特色：

```python

# Tuple（元組）
# 不可變序列，建立後不能修改
location = (13.4125, 103.866667)
print(type(location))  # <class 'tuple'>

# 可以省略括號
numbers = 1, 2, 3, 4, 5
print(type(numbers))   # <class 'tuple'>

# 支持索引訪問
print(numbers[0])      # 1

# 元組合併
combined = location + numbers
print(combined)        # 創建新元組

# 元組的拷貝
hero = ('Superman', 30, 'Flying', 100)
hero_copy = hero[:]    # 淺拷貝
deep_copy = copy.deepcopy(hero)  # 深拷貝

# Set（集合）
# 無序且不重複
unique_nums = {11, 1, 1, 2}  # 重複元素會被移除
print(unique_nums)     # {1, 2, 11}

# 支持數學集合運算
set1 = {1, 2, 3}
set2 = {3, 4, 5}
print(set1 - set2)     # 差集
print(set1 | set2)     # 聯集
print(set1 & set2)     # 交集

# 解構賦值
s = {9, 5, 2, 7}
a, *b, c = s          # 解構集合
```

::alert{type="tip"}

1. Tuple 適合存儲不變的數據序列
2. Set 適合需要去重和集合運算的場景
3. Tuple 比 List 佔用更少記憶體且創建更快
4. Set 的元素必須是可雜湊的（hashable）

::

::alert{type="warning"}

- Set 是無序的，不支持索引訪問
- Tuple 一旦創建就不能修改
- Set 不能包含可變物件（如列表）

::

### Dict（字典）

Python 的字典（Dict）是一種鍵值對的資料結構，提供高效的資料存取：

```python
# 基本操作
hero = dict.fromkeys(['name', 'age', 'power', 'health'], None)
hero['name'] = 'Superman'
hero['age'] = 30
hero['power'] = 'Flying'
hero['health'] = 100

# 訪問和修改
print(hero.get('name'))     # 安全地獲取值
del hero['age']             # 刪除鍵值對
pop = hero.pop('power')     # 彈出並返回值
popitem = hero.popitem()    # 彈出最後一項

# 字典合併
info = {**hero}            # 解包複製
infotwo = info | hero      # 合併運算符（Python 3.9+）

# 字典視圖
print(hero.items())        # 獲取鍵值對

# 記憶體使用示例
from sys import getsizeof

# 大型字典示例
big_dict = {i: i for i in range(1000000)}

# 比較視圖和列表的記憶體使用
keys1 = big_dict.keys()    # 字典視圖
keys2 = list(keys1)        # 轉換為列表
print(getsizeof(keys1))    # 40 bytes
print(getsizeof(keys2))    # ~8MB
```

::alert{type="tip"}

1. 字典的鍵必須是不可變（hashable）的
2. 字典視圖比列表更節省記憶體
3. 使用 `.get()` 可以避免鍵不存在時的錯誤
4. Python 3.9+ 支援 `|` 運算符合併字典

::

::alert{type="warning"}

- 字典是無序的（Python 3.7+ 保留插入順序）
- 大型字典操作要注意記憶體使用
- 避免直接訪問不存在的鍵

::

### 存址還是存引用

在 Python 中，變數的存儲機制與其他語言有些不同：

1. **不可變物件（Immutable）**:

- 數字、字串、元組（tuple）
- 當值改變時，會建立新的物件
- 變數指向新的記憶體位置

2. **可變物件（Mutable）**:

- 列表（list）、字典（dict）、集合（set）
- 修改值時，物件本身被修改
- 變數仍指向同一個記憶體位置

```python
# 不可變物件示例
x = 1
y = x
x = 2
print(y)  # 輸出 1

# 可變物件示例
list_a = [1, 2]
list_b = list_a
list_a.append(3)
print(list_b)  # 輸出 [1, 2, 3]

# 使用 id() 觀察物件身份
x = [1, 2]
y = x
print(id(x))  # 例如：4378130624
print(id(y))  # 相同的數字：4378130624

# 創建新列表
z = [1, 2]
print(id(z))  # 4377954304

# 字串示例
str1 = "hello"
str2 = str1
print(id(str1))  # 例如：4379444496
print(id(str2))  # 相同的數字：4379444496
str1 = "world"   # 創建新字串
print(id(str1))  # 不同的數字：4379445072
print(id(str2))  # 原始數字：4379444496


```

## 重要注意事項

在使用 Python 時，還有一些重要的概念需要注意：

1. **型別提示（Type Hints）**:

- Python 3.5+ 支援型別提示
- 幫助提高程式碼可讀性和維護性

```python
def greet(name: str) -> str:
	return f"Hello {name}"
```

2. **垃圾回收機制**:

- Python 使用引用計數和循環垃圾回收
- 巨大的存儲操作要注意適時釋放記憶體

3. **上下文管理器**:

- 使用 `with` 語句自動管理資源
- 常用於檔案操作和資料庫連接

```python
with open('file.txt') as f:
	content = f.read()
```

4. **標準函式庫**:

- `collections`: 提供額外的資料結構
- `itertools`: 提供高效迭代工具
- `functools`: 提供函式工具

5. **命名規範**:

- 變數和函式使用 snake_case
- 類別使用 PascalCase
- 常數使用大寫 SNAKE_CASE

## Reference

- [為你自己學py](https://pythonbook.cc/chapters/basic/introduction)
- [Fastapi Best Pratice](https://github.com/zhanymkanov/fastapi-best-practices)
- [python notes](https://github.com/twtrubiks/python-notes)
