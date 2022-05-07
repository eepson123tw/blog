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


# 簡易函式封裝
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