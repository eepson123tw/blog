---
title: Day 7 自定義鉤子
description: 學習 React 框架
icon: 'lucide:octagon-minus'
gitTalk: false
date: 2023-08-03 21:40:00
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> 學習 React 框架 - 007 自定義鉤子 useHooks

React 實作了許多可以以依賴驅動的 Hooks 函式，在不同的需求及邊界處理上，我們能搭配之前所學的 Hooks 做一些妥善的處理，
接下來就是最有趣的自己動手封裝了，React 所提供的 Hooks 就像工具箱，現在就由我們來動手封裝並日常開發好用的 useHooks 吧~

## 封裝自己的 Hooks 有何好處?

1. **重用性 ( Reusability )** ： 封裝 Hooks 讓邏輯和狀態切割開，在不同的組件中重用。可以大幅減少重複的程式碼，提高維護性。
2. **組織性 ( Organization)**： Hooks 可以更好地組織程式碼，將相關邏輯放在一起，使代碼更清晰、更易理解。
3. **邏輯解耦 ( Decoupling Logic)**： Hooks 可以將邏輯與組件的實現解耦。可以專注在開發邏輯的細節上與 UI 解藕。
4. **測試性 ( Testability )** ： 透過封裝 Hooks，更容易地進行單元測試，只需針對抽出的邏輯做測試，而不用擔心觸發頁面的 sideEffect。
5. **避免命名衝突 ( Avoiding Naming Conflicts )** ： Hooks 可避免在組件之間出現命名衝突，因為程式碼本身只存在各自的區塊之中。
6. **代碼重構 ( Code Refactoring)**: 有了 Hooks 針對某一部分的程式碼重構，相較之前容易許多，也不用擔層層相疊的邏輯本身。
7. **共享( Sharing )**: 當我們封裝出一個好用的自定義函式後，我們可以分享到社群，分享供其他人使用，相對地我們也能坐享齊人之福~

## 要注意甚麼?

1. 自定義 Hook 允許您共享狀態邏輯，但不能共享狀態本身。對 Hook 的每次調用完全獨立於對同一 Hook 的所有其他調用。
    - 也就是說要小心共用記憶體位址的問題，不要把原先的資料給改壞了。
2. 邏輯以及輸出的一致性，在 React Hooks 中，我們可以輕易地發現，絕大多數的 Hooks 的使用方式是相同的，有關測的依賴及固定的返回值，我們的自定義 Hooks 也應該是如此的，擁有一致性及清晰的命名，不會對使用者本身造成過多的記憶及使用負擔。
3. 不要甚麼邏輯都進行封裝，要知道封裝是有代價的，要知道必須做才做，而不是`手上拿著鐵鎚就看甚麼都是釘子`。
   - 任何操作都是有其代價的
4. 每次組件重新渲染時，所有 Hooks 都將重新執行。
5. 自定義 Hooks 的代碼應該是純粹的，一個封裝只專注在一個邏輯上，不要將 sideEffect 給搞混了。

::alert{type="danger" icon="lucide:lightbulb"}
永遠都要用 use 當開頭，這是一個約定俗成的方式，讓我們看到函式名稱就能馬上知道這個是封裝的 Hooks。
::

## 實際場景

::collapsible
#title
useDebounce 封裝節流閥

#content
```js
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```
::

::collapsible
#title
useFetch 封裝 get Api
#content

```js
export function useFetch(method = 'POST', url, propsData) {
  let [data, setData] = useState(null);
  useEffect(async () => {
    let res = await fetch(url, {
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      method // *GET, POST, PUT, DELETE, etc.
    });
    let resData = await res.json();
    setData(resData);
    return setData(null);
  }, [method, url]);
  return data;
}
```
::

## 參考資料

- [useHooks](https://usehooks.com/)
- [React-use](https://github.com/streamich/react-use)
- [forwardRef](https://react.dev/reference/react/forwardRef)
- [custom-hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
