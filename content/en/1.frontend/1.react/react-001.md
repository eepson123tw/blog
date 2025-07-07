---
title: Day 1 Setting Sail
description: Learning the React Framework
icon: 'lucide:anchor'
gitTalk: false
date: 2023-04-17 22:54:13
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Learning the React Framework - Day 001 Setting Sail

::alert{type="example" icon="lucide:lightbulb"}

Most of the information is extracted from the internet and notes from some current meetups I've attended. I'll understand the React framework through some common framework concepts from Vue. If there are any misunderstandings, please feel free to point them out XD

::

## Why React Was Born

The historical progression of frontend development has led to continuously expanding web services and complex business logic. If we use jQuery and native JavaScript for development, it would overwhelm engineers, and maintenance would often end up creating architectural wonders. We need a simpler way to reduce mental burden and programming complexity, and React was born in this environment.

## React's Core Philosophy

Describe states through data, making views a function of application state. (React's core premise is that UI is just data projected into different forms of data. **Same input gives same output**. A simple pure function.)

```js
v = f(s);
```

Developers only need to focus on state changes, while leaving everything else to React.

## Separation of Concerns

In traditional development, developers combine HTML+CSS+JS to develop web services, but each part is individually independent. Some people might say, "HTML imports CSS and JS, how can they be independent?"
>But you wouldn't write JS syntax inside CSS, right? @@

In React, anything related to rendering views - whether it's state, UI, and in some cases, even styles - is part of its concern. So in React components, you often see a single document combining HTML+JS, because the concerns are different. But how do we implement this diverse type combination?

## Building Components with JSX

React uses an interesting implementation, using a compiler to combine HTML+JS in a single document, integrating business logic (JS) and page structure (HTML).

```jsx
import ReactDOM from 'https://esm.sh/react-dom@18';
import React from 'https://esm.sh/react@18';

function App() {
  return (
    <div className="box">
      <h1>The React 001</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
```

[React 001 Example](https://codepen.io/eepson123tw/pen/VwEjMrR)

From the example, we can simply understand that we only provide an entry point in HTML, yet React can generate all the other parts we need through functions.

::alert{type="success" icon="lucide:lightbulb"}
JSX is a syntax extension for JavaScript that allows you to write HTML-like markup inside a JavaScript file. Although there are other ways to write components, most React developers prefer JSX's conciseness, and most codebases use it.
--- Excerpted from the official website

Such components are the basic building blocks of React applications, which can be seen as independent code units with specific functionality and presentation. Small components can be nested within each other to form complex UI structures.
::

## Babel (React's Behind-the-Scenes Partner)

Why can React generate the page format we want through a single JSX file? Babel is the hero behind the scenes~

Babel, as a JavaScript compiler, can transform and backward-compatible newer versions of JavaScript code to older syntax versions, ensuring that code can run smoothly in different environments (different browser implementation processes, you might encounter magical errors XD).

> <span style="color:red"> React's JSX syntax is precisely transformed from JSX to ordinary JavaScript through Babel. Through Babel's plugins, React can use the latest JavaScript syntax while ensuring these codes work normally in different environments.</span>

You can see that through Babel, our [React JSX](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=MYewdgzgLgBAggBwTAvDAFASlQPhgbwCgYYAnAUygFdSwNiSYAeAEwEsA3GYAGwEMIEAHJ8AtuRQAiAEYgAHpJwNGzABYBGHABVV5GACVyfYLAAMp9UwD0GpSuvsOdmJgDchAL6ugA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-0%2Cstage-2&prettier=false&targets=&version=7.21.4&externalPlugins=&assumptions=%7B%7D) is compiled into a JS file.

## Conclusion

On the first day, after understanding React framework's background, core philosophy, JSX syntax, and the collaborative relationship with Babel compiler, we will delve deeper into some key concepts of the React framework. React is a component-based framework, where components are the basic building blocks of applications. In React, we need to understand how components pass parameters to each other and how to instantiate components. Parameter passing typically uses props (properties), and instantiation can use the React.createElement() function or JSX syntax. Mastering these basic concepts allows us to better develop high-quality, efficient React applications.

## References

- [Visual Understanding of React](https://react.gg/visualized#history-of-the-web)
- [React Official Documentation](https://react.dev/)
- [React Basic](https://github.com/reactjs/react-basic)
- [Build your own React](https://pomb.us/build-your-own-react/)
