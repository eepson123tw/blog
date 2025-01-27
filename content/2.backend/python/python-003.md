---
title: Day 3 Class
description: Python、Function、OOP
icon: 'lucide:expand'
gitTalk: false
date: 2024-12-30 23:30:00
read: '15'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
navBadges:
  - value: ⛑️
    type: primary
---

> Python-003 Class

Python 物件導向程式設計（OOP）的進階特性與語法。除了基本的類別、建構子外，我們將來試著使用 **slots** 限制屬性、並透過描述器（Descriptor）來攔截屬性的讀取與寫入，還有使用 **call**、**new**、**init** 以及其他常見的魔術方法（例如 **contains**, **str**, **iter**）來自訂物件行為。廢話不多說，範例開始，一步步看 Python OOP 的強大之處吧！

## Class 是什麼

在 Python 中，`Class（類別`就像是一個「自訂的資料型態」或「範本」，可以用來描述某個特定物件可能包含的屬性（變數）與行為（方法）。如果把實例（object）比喻成一棟已落成的房子，那麼類別（Class）就像是建築藍圖，定義了該房子的格局、結構與功能，並由此來實際產生一棟又一棟「遵循相同設計」的房子。

### 1. `Human` 與類別基礎

```python
class Human:
    cry = "A human is crying"  # class variable
    happiness = "A human is happy"  # class variable
    __slots__ = ('name', 'age')  # restrict the attributes that can be added to the class

    def __init__(self, name, age):  # initializer
        self.name = name
        self.age = age

    def show(self):
        print(self.name)
        print(self.age)

    @classmethod
    def show_class(cls):
        print(cls.cry)

    @staticmethod
    def show_static():
        print("A human is static")
```

1. **類別變數**：`cry` 和 `happiness` 是屬於整個類別共用的變數。所有 `Human` 實例都可以存取它，並且共享相同的值。

2. **\_\_slots\_\_**：

   - `__slots__ = ('name', 'age')` 限制此類別實例只能擁有 `name`、`age` 這兩個屬性，不允許動態新增其他屬性。
   - 使用 `__slots__` 可以幫助節省記憶體並提高存取速度，在需要大量建立實例或對效能要求較高的場景中很常見。

3. **\_\_init\_\_ (建構子)**：

   - 在 Python 中，`__init__` 是實例初始化方法，負責把參數綁定到實例上，例如 `self.name = name`。

4. **實例方法**：
   - `show()`：簡單印出當前實例的屬性。
5. **類別方法（@classmethod）**：

   - `show_class(cls)`：可以透過類別或實例呼叫，但本質接收的是類別物件本身 (`cls`)，適合用來存取類別變數或執行與整個類別相關的操作。

6. **靜態方法（@staticmethod）**：
   - `show_static()`：跟類別方法一樣可以用「類別」或「實例」呼叫，但靜態方法完全不會接收任何隱含參數 (`self` 或 `cls`)。通常用於不需要存取任何類別或實例屬性的工具方法。

ex：

```python
allen = Human("Allen", 25)
print(allen.happiness)    # A human is happy
allen.show()              # 印出 Allen, 25
allen.show_class()        # A human is crying
allen.show_static()       # A human is static

# 型別判斷
print(isinstance(allen, Human))   # True
print(isinstance(allen, object))  # True
print(isinstance(allen, int))     # False
```

---

### 2. 繼承：`Student` 繼承 `Human`

```python
class Student(Human):
    def __init__(self, name, age, grade):
        super().__init__(name, age)  # super() 呼叫父類別的 __init__
        self.grade = grade

    def show(self):
        super().show()  # 呼叫父類別的 show()
        print(self.grade)
```

1. **繼承**：

   - `class Student(Human)` 表示 `Student` 類別繼承自 `Human`，因此擁有 `Human` 的所有屬性與方法。
   - 繼承可以讓你在父類別基礎上擴充功能，而不用重複撰寫相同程式碼。

2. **`super()`**：

   - 呼叫 `super().__init__(name, age)` 表示呼叫父類別 (`Human`) 的 `__init__`，確保父類別初始化完成。

3. **方法覆寫（Override）**：
   - `show()` 在子類別中覆寫了父類別同名方法，但也透過 `super().show()` 呼叫父類別的 `show()`, 然後再印出自己的屬性 `self.grade`。

ex：

```python
student = Student("Allen", 25, 10)
student.show()
# 輸出：
# Allen
# 25
# 10
```

---

### 3. Descriptor（描述器）與 `__call__` 範例

#### 3.1 Descriptor `NameValue`

```python
class NameValue:
    def __init__(self):
        self._name = 'Aaron'

    def __get__(self, instance, owner):
        return self._name

    def __set__(self, instance, value):
        if value == 'Aaron':
            self._name = value
            print("Aaron is a cat")
        else:
            print("Aaron is not a cat")

    def __delete__(self, obj):
        print("我被刪掉囉！")
        del self._name
```

- **Descriptor Protocol**：在 Python 裏，只要類別同時實作 `__get__`、`__set__` 或 `__delete__`，就是一個描述器。
- **屬性攔截/控制**：
  - 當 `NameValue` 被定義成某個類別的類別屬性時（例：`name = NameValue()`），那個類別每次存取 `name` 時，底層都會呼叫 `NameValue` 裏面的 `__get__` / `__set__` / `__delete__` 方法。
  - 這可以用來實作額外的屬性驗證、轉換、或讀寫控制，比如說設定時先做檢查，刪除時做清理等等。

#### 3.2 使用描述器的類別 `Cat`

```python
class Cat:
    name = NameValue()

    def __call__(self, *args, **kwds):
        print("I am called")
```

1. **`name = NameValue()`**：

   - 這裡 `name` 屬性就被接管到 `NameValue` 描述器中。存取或設定 `Cat` 實例的 `name`，底層都會呼叫描述器方法。

2. **\_\_call\_\_ 魔術方法**：
   - 讓物件實例可以「像函式一樣被呼叫」。當 `aaron()` 呼叫時，實際上會執行 `Cat.__call__()`。

ex：

```python
aaron = Cat()
print(aaron.name)  # 讀取 -> __get__ -> 'Aaron'
aaron.name = 'Aaron 1'  # 寫入 -> __set__
print(aaron.__dict__)   # 查看實例屬性 (描述器通常不在實例字典中，會在類別層級)
aaron()                 # I am called
del aaron.name          # 刪除 -> __delete__ -> "我被刪掉囉！"
```

---

### 4. `__new__` 與 metaclass 基礎

```python
class Apple:
    def __new__(cls, *args, **kwds):
        print("I am new")
        return super().__new__(cls)

    def __init__(self):
        print("I am init")

    def __contains__(self, item):
        return True

    def __str__(self):
        return "I am a apple"

    def __iter__(self):
        return iter([1, 2, 3])
```

1. **\_\_new\_\_**：

   - 在 Python 中，`__new__` 會在物件建立（記憶體配置）時最先被呼叫，並回傳該物件本身。
   - 之後才會進行 `__init__` 做初始化。
   - 在高度客製化物件行為或使用 metaclass 時，常需要重寫 `__new__`。

2. **魔術方法**：
   - `__contains__(self, item)` 讓物件支援 `in` 運算，例如 `'apple' in apple_obj`。
   - `__str__` 自訂物件被 `print()` 或 `str()` 呼叫時的字串表示。
   - `__iter__` 讓物件支援迭代，可用 `for item in apple_obj:` 來迭代。

測試：

```python
apple = Apple()       # 觸發 __new__ -> "I am new"
                      # 再執行 __init__ -> "I am init"
print('apple' in apple)  # 觸發 __contains__ -> True
print(apple)             # 觸發 __str__ -> "I am a apple"

for i in apple:         # 觸發 __iter__ -> 回傳 [1, 2, 3] 的迭代器
    print(i)
```

---

## 結語

若想深入了解 Python 進階 OOP 機制及各種奇妙寫法，可以參考官方文件或閱讀更多關於 metaclass、描述器的教學。這些語法特性或許不一定用得到，但在大型系統或框架層級往往能看到有前輩這樣使用，相信多多了解不吃虧。祝我們在 Python 裡玩得開心！
