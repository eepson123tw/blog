---
title: Day 7 Custom Hooks
description: Learning the React Framework
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

> Learning the React Framework - 007 Custom Hooks useHooks

React has implemented many dependency-driven Hooks functions. For different requirements and edge case handling, we can combine the previously learned Hooks to handle them properly.
Next comes the most interesting part - creating our own encapsulations. The Hooks provided by React are like a toolbox, and now we'll create and encapsulate useful useHooks for daily development~

## What Are the Benefits of Encapsulating Your Own Hooks?

1. **Reusability**: Encapsulating Hooks separates logic and state, allowing reuse across different components. This can significantly reduce duplicate code and improve maintainability.
2. **Organization**: Hooks can better organize code by grouping related logic together, making code clearer and easier to understand.
3. **Decoupling Logic**: Hooks can decouple logic from component implementation. You can focus on developing logic details while decoupling from UI.
4. **Testability**: By encapsulating Hooks, it's easier to perform unit testing - you only need to test the extracted logic without worrying about triggering page side effects.
5. **Avoiding Naming Conflicts**: Hooks can avoid naming conflicts between components since the code only exists within their respective blocks.
6. **Code Refactoring**: With Hooks, refactoring specific parts of code is much easier than before, without worrying about layered logic.
7. **Sharing**: After encapsulating a useful custom function, we can share it with the community for others to use, and we can also benefit from others' work~

## What Should You Pay Attention To?

1. Custom Hooks allow you to share stateful logic, but not state itself. Each call to a Hook is completely independent from all other calls to the same Hook.
    - Be careful about shared memory address issues - don't corrupt the original data.
2. Consistency in logic and output. In React Hooks, we can easily see that most Hooks are used in the same way, with measured dependencies and fixed return values. Our custom Hooks should be the same - having consistency and clear naming that doesn't burden users with excessive memory and usage overhead.
3. Don't encapsulate every piece of logic. Know that encapsulation has costs - only do it when necessary, not because `when you have a hammer, everything looks like a nail`.
   - Every operation has its cost
4. All Hooks will re-execute every time a component re-renders.
5. Custom Hook code should be pure, with one encapsulation focusing on one logic, without mixing up side effects.

::alert{type="danger" icon="lucide:lightbulb"}
Always start with "use" - this is a conventional way that lets us immediately know a function is an encapsulated Hook just by seeing its name.
::

## Real-world Scenarios

::collapsible
#title
useDebounce - Encapsulating Throttle

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
useFetch - Encapsulating GET API
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

## References

- [useHooks](https://usehooks.com/)
- [React-use](https://github.com/streamich/react-use)
- [forwardRef](https://react.dev/reference/react/forwardRef)
- [custom-hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
