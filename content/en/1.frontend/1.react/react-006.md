---
title: Day 6 Advanced and Rendering
description: Learning the React Framework
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

> Learning the React Framework - 006 Advanced Hooks and Render Control

With just useState and useEffect, you can actually build simple applications. However, development requirements are often more complex and conditional - we can't just render components immediately whenever dependencies change. We need temporal, operational, and holistic planning. React has also introduced more advanced control functions to allow developers to create richer and more refined operations.

## Advanced Hooks

### useReducer

Compared to useState, it's easier to operate complex object structures and can update state based on conditions.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

- reducer: The reducer function that specifies how state should be updated. It must be pure, should take state and action as parameters, and should return the next state. State and action can be of any type.

- initialArg: The value used to calculate the initial state. It can be a value of any type. How the initial state is calculated from it depends on the next init parameter.

- optional init: The initialization function that should return the initial state. If not specified, the initial state is set to initialArg. Otherwise, the initial state will be set to the result of calling init(initialArg). This can avoid recreating the initial state, i.e., lazy initialization.

- state: The current state

- dispatch: Function that can update state to a different value **and trigger re-rendering**.

::alert{type="info" icon="lucide:lightbulb"}
In strict mode, React will call the reducer and initializer twice to help you find accidental impurities. This is development-only behavior and does not affect production.
::

::collapsible
#title
`useReducer` used in pokemon example
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
      throw new Error(`Unsupported type: ${action.type}`); // If your state unexpectedly becomes undefined, you might have forgotten to return state in one of the cases
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

By separating it into actionType and reducer encapsulation, we can perform more complex object operations, and through IDE hints, we can quickly find corresponding operation methods.
Note that the official documentation repeatedly mentions the need to provide [pure operations](https://react.dev/learn/keeping-components-pure) to avoid side effects causing unexpected component changes and rendering.

### useCallback

> Optimizes function callbacks, but whether it's necessary in usage still requires self-judgment, as it might not optimize and even become slower QQ

```js
const cachedFn = useCallback(fn, dependencies);
```

The first parameter is the cached function value, and the second parameter is a dependency array, similar to `useEffect`.
When a dependency changes between renders, the callback passed in the first parameter will be the callback returned from `useCallback`. If they haven't changed, you'll get the previously returned callback (so the callback remains the same between renders).
Through useCallback, you can remember the memory location of a function, which can avoid React.memo re-rendering when comparing props values due to **different memory locations but same values for object types**.

However, since this Hook uses a caching pattern, unless specifically necessary, it will increase memory burden.

::collapsible
#title

Optimization case mentioned on the official website

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

Through this combination of calls, we can make more subtle dependency operations, avoiding every re-render.

::

### useContext

> This Hook is very interesting. Through function encapsulation of your own context environment, more simply put, React provides a global state passing method. When application-level complexity and nesting occur, it can effectively pass state.

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
  const theme = useContext(ThemeContext); // Can get dark
  const className = `button-${theme}`;
  return (
    <button className={className}>
      Hello
    </button>
  );
}
```

- SomeContext: Context created using createContext. The context itself doesn't hold information, it just represents the type of information you can provide or read from components
- value: useContext returns the context value for the calling component. It's determined as the value passed to the nearest SomeContext.Provider above the calling component in the tree.

::alert{type="warning" icon="lucide:lightbulb"}
React will automatically re-render all children using a particular context, starting from the provider that receives a different value. Previous and next values are compared with Object.is. Skipping re-renders with memo doesn't prevent children from receiving fresh context values.
::

::collapsible

#title

Optimization case mentioned on the official website

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

useContext can be combined with useReducer as a state management method registered in nested components

#content
```js
const PokemonContext = React.createContext(null);
PokemonContext.displayName = 'PokemonContext'; // Can see clear naming in devtools
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
      //All components below this can conveniently access the reducer in context
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

> useLayoutEffect is a version of useEffect that **fires before the browser repaints the screen**. When development requirements need to get certain data or state at the beginning, this can be used.

- before any other effects are called.
- if the side effect that you are performing makes an observable change to the dom, that will require the browser to paint the update that you made.

::alert{type="danger" icon="lucide:umbrella"}
Only runs on the client. They don't run during server rendering. Code in useLayoutEffect and all state updates scheduled from it block the browser from repainting the screen. When overused, this makes your app slow QQ
::

### useMemo

> Can cache calculation results between re-renders.

```js
const cachedValue = useMemo(calculateValue, dependencies);

// Example=>
const allItems = React.useMemo(() => getItems(inputValue), [inputValue]);
```

- calculateValue: Function to calculate the value to cache. Should be pure, **should have no arguments, and should return a value (of any type)**. React will call this function during initial render. On next renders, if dependencies haven't changed since the last render, React will return the same value again. Otherwise, it will call calculateValue, return its result, and store it so it can be reused later.
- dependencies: List of all reactive values referenced inside calculateValue code. Reactive values include props, state, and all variables and functions declared directly inside your component body.

::alert{type="warning" icon="lucide:lightbulb"}
Only rely on useMemo as a performance optimization. Don't use it extensively.<br>Although it's similar to useCallback, there are still some [contextual differences](https://react.dev/reference/react/useMemo#memoizing-a-function) in usage.
::

## References

- [useReducer](https://react.dev/reference/react/useReducer)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useContext](https://react.dev/reference/react/useContext)
- [useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)
- [should-i-usestate-or-usereducer](https://kentcdodds.com/blog/should-i-usestate-or-usereducer)
- [usememo-and-usecallback](https://kentcdodds.com/blog/usememo-and-usecallback)
