---
title: Day 6 進階與渲染
description: 學習 React 框架
icon: 'lucide:alarm-clock-check'
gitTalk: false
date: 2023-07-01 21:00:00
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> 學習 React 框架 - 006 進階鉤子與渲染控制

單靠 useState 及 useEffect ，其實就能做出簡易的應用，但開發需求往往更為複雜且有條件性，不能只單單因依賴變動就馬上渲染組件，我們需有時間性、操作性、整體性的規劃，而 React 也提出了更進階的控制函式，讓開發者做出更豐富及細膩的操作。

## Advanced Hooks

### useReducer

相較於 useState 更易於操作複雜的物件結構，且可依照條件更新狀態。

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

- reducer ：reducer 函數，指定狀態如何更新。它必須是純粹的，應該以狀態和操作作為參數，並且應返回下一個狀態。狀態和動作可以是任何類型。

- initialArg ：計算初始狀態的值。它可以是任何類型的值。如何根據它計算初始狀態取決於下一個 init 參數。

- optional init : 應返回初始狀態的初始化函數。如果未指定，則初始狀態設置為 initialArg 。否則，初始狀態將設置為調用 init(initialArg) 的結果。可避免重新創建初始狀態，即 lazy initialization 惰性初始化。

- state : 目前的狀態

- dispatch : 函數可將狀態更新為不同的值**並觸發重新渲染**。

::alert{type="info" icon="lucide:lightbulb"}
在嚴格模式下，React 將調用reducer和初始化兩次，以幫助您發現意外的雜質。這只是開發行為，不會影響生產。
::

::collapsible
#title
在pokemon範例中使用的 `useReducer`
#content
```js
const actionTypes = {
  init: 'init',
  pending: 'pending',
  resolved: 'resolved',
  reset: 'reset'
};

function usePokemonReducer(state, action) {
  switch (action.type) {
    case actionTypes.init: {
      return {
        pokemonList: [],
        allPokemonNumber: action.allPokemonNumber,
        maxPageNum: action.maxPageNum,
        status: ''
      };
    }
    case actionTypes.pending: {
      return {
        ...state,
        status: action.status
      };
    }
    case actionTypes.resolved: {
      return {
        ...state,
        status: action.status,
        pokemonList:
          action.pageNum === 1
            ? action.pokemonList
            : [...state.pokemonList, ...action.pokemonList]
      };
    }
    case actionTypes.reset: {
      return { pokemonList: [], allPokemonNumber: 0, maxPageNum: 0, status: '' };
    }
    default: {
      throw new Error(`Unsupported type: ${action.type}`); // 如果您的狀態意外變為 undefined ，則您可能在其中一種情況下忘記了 return 狀態
    }
  }
}

const [state, dispatch] = React.useReducer(usePokemonReducer, {
  pokemonList: [],
  allPokemonNumber: 0,
  maxPageNum: 0,
  status: ''
});
```

::

將其分為 actionType 、 reducer 封裝，讓我們可以去執行更複雜的物件操作，且透過 IDE 的提示能夠快速地找到相對應的操作方法。
須注意官網中多次提到需提供[純粹的操作](https://react.dev/learn/keeping-components-pure)，以避免副作用造成非預期的組件變更及渲染。

### useCallback

> 優化函式回調，但使用上是否有必要仍需自我判斷，可能會沒優化到反而變更慢QQ

```js
const cachedFn = useCallback(fn, dependencies);
```

第一個參數是緩存的函數值，第二個參數為一個依賴數組，類似於`useEffect`。
當一個依賴項在渲染之間發生變化時，在第一個參數中傳遞的回調將是從`useCallback`返回的回調。如果它們沒有改變，將獲得上一次返回的回調（因此回調在渲染之間保持相同）。
透過 useCallback 可以記住 function 的記憶體位置，就可以避免 React.memo 在比較 props 值時因為**物件型別記憶體位置不同但值相同**而重新渲染的狀況。

但因此Hook使用了緩存的模式，若非有特定必要，否則會增加記憶體的負擔。

::collapsible
#title

在官網中提到的優化案例

#content

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes

```

透過這樣的組合調用，我們可以做出更細微的依賴操作，避免每次的re-render。

::

### useContext

> 這個Hook十分有趣，透過函式封裝自己的上下文環境，更簡單的說，React提供了一個全域的狀態傳遞方式。在應用層級複雜且巢狀時，能有效的傳遞狀態。

```js
import { useContext } from 'react';
const value = useContext(SomeContext);

function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Button />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext); // 可以取到dark
  const className = `button-${theme}`;
  return (
    <button className={className}>
      Hello
    </button>
  );
}
```

- SomeContext：使用 createContext 創建的上下文。上下文本身不保存信息，它僅表示您可以提供或從組件中讀取的信息類型
- value: useContext 返回調用組件的上下文值。它被確定為傳遞給樹中調用組件上方最近的 SomeContext.Provider 的值。

::alert{type="warning" icon="lucide:lightbulb"}
React 會自動重新渲染所有使用特定上下文的子級，從接收不同 value 的提供者開始。前一個值和後一個值通過 Object.is 進行比較。使用 memo 跳過重新渲染不會阻止子級接收新的上下文值。
::

::collapsible

#title

在官網中提到的優化案例

#content

```js
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

::

::collapsible

#title

 useContext 可與 useReducer 搭配成一個註冊在巢狀組件中的狀態管理方式

#content
```js
const PokemonContext = React.createContext(null);
PokemonContext.displayName = 'PokemonContext'; // 在devtools上可以看到明確命名
// app inject the provider
function PokemonProvider({ children }) {
  const [state, dispatch] = React.useReducer(usePokemonReducer, {
    pokemonList: [],
    allPokemonNumber: 0,
    maxPageNum: 0,
    status: ''
  });
  const value = [state, dispatch];
  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
}

function usePokemonContext() {
  const context = React.useContext(PokemonContext);
  if (context === undefined) {
    throw new Error(` usePokemon must be used within a PokemonProvider`);
  }
  return context;
}

function App() {
  return (
    <PokemonProvider>
      {' '}
      //在此之下的所有組件都可以方便的拿到 context 中的 reducer
      <div>
        <Pokemon></Pokemon>
        <ScrollDirection></ScrollDirection>
      </div>
    </PokemonProvider>
  );
}

export default App;
```

::

### useLayoutEffect

> useLayoutEffect 是 useEffect 的一個版本，**在瀏覽器重新繪製屏幕之前觸發**。當開發需求中有需要一開始時拿到某些資料或狀態，就可以使用。

- before any other effects are called.
- if the side effect that you are performing makes an observable change to the dom, that will require the browser to paint the update that you made.

::alert{type="danger" icon="lucide:umbrella"}
僅在客戶端上運行。它們在服務器渲染期間不會運行。useLayoutEffect中的代碼以及從中安排的所有狀態更新都會阻止瀏覽器重新繪製屏幕。當過度使用時，這會讓應用程序變慢QQ
::

### usememo

> 可在重新渲染之間緩存計算結果。

```js
const cachedValue = useMemo(calculateValue, dependencies);

// 範例=>
const allItems = React.useMemo(() => getItems(inputValue), [inputValue]);
```

- calculateValue ：計算要緩存的值的函數。應該是純粹的，**不應有任何入參，並且應有返回值(任意類型)**。 React 將在初始渲染期間調用此函數。在下一次渲染時，如果 dependencies 自上次渲染以來沒有更改，React 將再次返回相同的值。否則，它將調用 calculateValue ，返回其結果並存儲它以便以後可以重用。
- dependencies ： calculateValue 代碼內部引用的所有反應值的列表。反應性值包括 props、state 以及直接在組件體內聲明的所有變量和函數。

::alert{type="warning" icon="lucide:lightbulb"}
僅依賴 useMemo 作為性能優化。不要廣泛地使用他。<br>雖然與 useCallback 很像，但使用上仍有些[情境上的差別](https://react.dev/reference/react/useMemo#memoizing-a-function)。
::

## 參考資料

- [useReducer](https://react.dev/reference/react/useReducer)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useContext](https://react.dev/reference/react/useContext)
- [useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)
- [should-i-usestate-or-usereducer](https://kentcdodds.com/blog/should-i-usestate-or-usereducer)
- [usememo-and-usecallback](https://kentcdodds.com/blog/usememo-and-usecallback)
