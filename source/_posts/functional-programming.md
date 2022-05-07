---
title: 簡易函式封裝
date: 2022-05-07 13:15:06
tags: [javascript,function,program,Encapsulation]
categories: [javascript]
---
<!-- xtoc -->

![編成範式圖](/images/fn/fn1.png)

- 面向過程 關心執行流程與控制，通過順序執行一組語句來實現一個功能，這些語句的執行過程就是整個程式
- 物件導向 將數據與指令組織成模塊，模塊間通過繼承、多態、委託等方式實現複用
- 函數式 核心思想是將運算過程儘量寫成一系列嵌套的函數調用，關注的是做什麼而不是怎麼做
- 邏輯式 只關心規則、事實和問題的推導這樣的標準方式，不需要關心程序控制，也不需要關心具體的實現算法

---
若在網路上搜尋javascript的封裝常常會看到物件導向、函數式編成等關鍵字，其核心都是將抽象的細節邏輯去做包裝，優化、細節處理，降低開發複雜度後提供給使用者，我們並不需要了解深度的封裝細節，就能快速地使用這些邏輯，達到我們要的應用。
例如現代js的三大框架，也是經過許多深度的封裝後，提供開發者便利的api及框架環境~

例如:

- vue2、vue3 ->響應式物件代理(proxy,object.defineproperty)、觀察者、訂閱者、渲染器 。
- react  的 render、redux、hook函式

---

今天想介紹最簡單的幾種函數封裝的方式

```javascript
 基礎封裝的幾種返回模式
    ()=>() //返回 function
    ()=>{} //返回帶有方法的 {}
    ()=>[] //返回 陣列
    ()=>x?x:y //返回 condition
    (function(root){})(window)//基礎封裝  匿名函數
```

## 返回function

```javascript
  賦值表達式
  function add(m) {
      return function (n) {
          return m + n
      }
  }

  add(10)(20)
  >>30
  複雜表達式
  (x=>y=>x+y)(10)(20)
```

我們利用閉包的特性將m及n分別暫存住各自的值，等到return後記憶體便會釋放，我們也能得到30最為回傳值。
我們也可以利用複雜表達式的寫法去重寫上面的程式碼，兩種寫法是等價的。

有很多應用的情況，例如針對使用者input的值，我們需要使用正則的判斷，去檢測有無非預期的輸入，此時就可以使用這種封裝方式。

```javascript

  
  const vaild =(rex)=>{
    return (val)=>{
       return rex.test(val) 
    }
  } 

  const emailVaild = vaild(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
  emailVaild('aaa@.asdasd')
  false
  emailVaild('aaa@gmail.com')
  true
```

經過了這一層的封裝，我們就能依照不同的正則規則，去檢驗不同的輸入，非常的方便且複用性相當高。

## 返回帶有方法的{}

我們封裝一個會回傳物件的函式，讓他再回傳封裝在其中的邏輯，做出一個可以與之互動的錢包。

```javascript
function newWaller(x){
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
      log(x.name)  //傳入fn名稱當作key
      return money
    },
    printLog:()=>{
      console.log(log[name])
    },
  }
  
}
 const allenMoney = newWaller(100);
 const buyDrink = (x) => x - 10;
 const buylunch = (x) => x - 60;
allenMoney.use(buyDrink);
allenMoney.use(buylunch);
allenMoney.checkMoney();
>30
allenMoney.printLog();
>{buyDrink: '2022/5/7 下午2:24:34', buylunch: '2022/5/7 下午2:24:34'}
```

---

## 返回 array

我們可以透過一個封裝過的函式，return出我們想要的值，更可以透過之前分享的嵌套模式，複合這些邏輯，相當地有趣。

```javascript
  const arr = [1, 3, 'a', 'd', 5, 8, '9']
  // 封裝 過濾出數字
  function getNumbers(arr) {
      const newArr = []
      arr.forEach(item => {
          if (typeof item === 'number') {
              newArr.push(item)
          }
      })
      return newArr
  }
  getNumbers(arr) //取得數字
  
  function getEvenNumber(arr) {
      const newArr = []
      arr.forEach(item => {
          if (item%2===0) {
              newArr.push(item)
          }
      })
      return newArr
  }
  getEvenNumber(getNumbers(arr)) //取得偶數


```

## 返回 condition

```javascript
  function tellme(b) {
      return b === true ? '可' : '不可'
  }
  tellme(false)

  function isNumberEven(number) {
      return number > 0  ?  (number % 2 ===0 ? true : false) : false
  }
  isNumberEven(8)

  也可以結合之前的應用 

  const conditionOne = (a, b) => { return console.log(`${a.name} 比 ${b.name} 高${a.height-b.height}公分，他當兵`)}
  const conditionTwo = (a, b) => { return console.log(`${b.name} 比 ${a.name} 高 ${b.height-a.height}公分，他當兵`)}
  function beSoldier(a,b) {
      return a.height > b.height  ?  conditionOne(a,b) :  conditionTwo(a,b)
  }

  beSoldier({name:'Allen',height:180},{name:'Eric',height:170}) //allen 當兵去囉QQ

```

---

## 基礎封裝  匿名函數

這邊就是框架們使用的方式，把一些東西掛載至window，方便調用。

```javascript
  (function (root, undefined) {
      // 私有狀態
      const age = 20
      const name = 'allen'
      let money = 87

      function show(x) {
          return x === 'you'
              ? `Your name is  ${name} and ${age} years old.`
              : x === 'money'
                  ? `your money is ` + money
                  : 'what?'
      }
      function getMoney() {
          return `your money is ` + money
      }
      function setMoney(m) {
        return money += m
      }
      function codingTime(){
        return ((Math.abs(new Date(2022,05) -  new Date(2020, 10))) / (1000 * 60 * 60 * 24))+ '天'
  
      }

      // 將引用保存在外部，一種簡單的對外開放方法的方式
      root.Who = { show, getMoney, setMoney,codingTime }
  })(window)

  Who.show('you')
  Who.show('age')
  Who.codingTime()
```

以上介紹的這幾種方式，若經過良好的細節處理及互相應用，你也可以寫出有趣的lib供人們使用~
