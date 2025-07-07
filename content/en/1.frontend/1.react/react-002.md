---
title: Day 2 Component Parameter Passing
description: Learning the React Framework
icon: 'lucide:angry'
gitTalk: false
date: 2023-04-18 23:31:13
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Learning the React Framework - Day 002 Component Generation and Parameter Passing

## Components

The term "component" in traditional frontend development history was usually distinguished by pages. But when different pages have the same functionality or display blocks, we might repeatedly write the same code or directly copy & paste.
> As framework thinking has matured, the idea of "components" emerged. In the React Basic article, it's hoped that React has mutability, abstraction, composability, and state preservation to help developers share increasingly complex requirements and logic.

There was a desire for a mental model that could contain these concepts. Historically, JavaScript code migration transitioned from traditional OOP development models to functional programming architecture. React components also went through these processes - before Version 16, it was mainly OOP-based, and after Version 18, it was baptized by functional programming, so components were also simplified into functional forms. This is like yesterday's example where we declared a function and let React generate the page blocks we wanted through the Babel compiler.

So how do React and Babel inject these components into pages?

## Component Composition and Generation

```js [app.jsx] icon=lucide:code-xml line-numbers
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

::alert{type="warning" icon="lucide:eraser"}
Component names must start with a capital letter
::

We can see that we defined two function components, where Gallery calls Profile to form the page structure.
React components are [compiled](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABABQE52DANgUwBQCUiA3gFCKKo5QipJ7kWIA8MAtgOaNOIDOqEALwAiABZQoAB14AuAPRyYAOnYdaSiHDZyAsgGkAzDgDqBgIK8lAK0kdh3JgEMsUEXsdRROVDDA5EAFJwomC8CPY8cgB8jAQA3KQAvqSkOAAeknCoUIgAJjjAjiAuiKCQsAiIAOLOuKgAnoQkjFQ0dIgMPMy8ONDwYDE8FMyiAIxRZmyOAF6-HHwQMDhgsLxQvMxyY4NDzGgY2P7RDsP7mLiIx0MsZ4eXO8NyPX0IO_FJQA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Creact%2Cstage-0%2Cflow&prettier=true&targets=&version=7.21.4&externalPlugins=&assumptions=%7B%7D), and finally converted to the code below injected into the page.

```javascript
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>;
```

### React.createElement

JSX components create [**Virtual DOM abstractions**](https://codepen.io/eepson123tw/pen/XWxjXGj?editors=1111) through createElement methods during compilation.
Simply put, each component function is a layer of encapsulation, but underneath it's still JavaScript. We convert it to real DOM through Render and inject it into the [DOM tree](/view/frontend/dom.md).

### React.Render

Used to render Virtual DOM to actual DOM.

The ReactDOM.render() method has two parameters:

The first parameter is the Virtual DOM element that needs to be rendered.
The second parameter is a DOM element, indicating which container the Virtual DOM should be rendered into.
For example, the following code renders an h1 element containing the text "Hello, world!" into a DOM element with id attribute "root":

```javascript
// element is just an abstract structure
const element = {
  type: 'h1',
  props: {
    title: 'foo',
    children: 'Hello',
  },
};
ReactDOM.render(element, document.getElementById('root'));
```

When the code executes ReactDOM.render() method, React converts the Virtual DOM to actual DOM and inserts it into the root element.
Reference [hello2](https://codepen.io/eepson123tw/pen/XWxjXGj?editors=1111)

> **Simplified version of render below**

```javascript
function render(element, container) {
  // We pass down the virtual dom object structure from createElement, if it's not a text structure, create a node
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type);

  // Recreate virtual dom properties
  const isProperty = key => key !== 'children';
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  // Create node at entry point (root)
  container.appendChild(dom);

  // If there are child structures on the virtual DOM, recursively call Render itself to achieve hierarchical DOM rendering
  if (element.props.children) {
    element.props.children.forEach((child) => {
      render(child, dom);
    });
  }
}
// Wrap another layer of abstraction, implicitly encapsulating root in render
function ReactDOMRender(element, container) {
  const root = {
    dom: container,
    children: []
  };
  render(element, container);
}

ReactDOM.render = ReactDOMRender;
```

### Virtual DOM

Virtual DOM is a programming concept that represents the entire webpage as a tree-structured object, where each node corresponds to a DOM element on the webpage. React extensively uses Virtual DOM, which can quickly calculate the parts that need updating, only updating those parts without re-rendering the entire page, thus improving performance and efficiency.

## Parameter Passing Props

Just as we can pass parameters into functions, components also accept parameters passed internally, but must be passed in a rigorous manner. Each parent component can pass some information to its child components through props. Props can pass any JavaScript values, including objects, arrays, and functions.

[Example](https://codepen.io/eepson123tw/pen/JjmNPvR)

In the example, we can destructure all properties from the passed props object through destructuring. But be careful with this usage, as it will pass all values.

::alert{type="warning" icon="lucide:accessibility"}

- Props.children is a special property, not an attribute we defined that's passed down from the parent layer. It can be viewed as a placeholder that can be filled by its parent component.
- When a component needs to change its props, new values must be passed because immutability must be maintained! Don't change props in components to avoid unpredictable errors!!
::

## Conclusion

We understand how components are generated and through which methods they are implemented and rendered on pages, how to pass parameters to the next layer of components. **We must maintain parameter immutability** to avoid errors.
We discovered there's also a children property that can more conveniently construct pages, and we can use destructuring to pass complex object structures to lower components, but we must clearly understand why we're using it, rather than just being lazy...

## References

- [Visual Understanding of React](https://react.gg/visualized#history-of-the-web)
- [React Official Documentation](https://react.dev/)
- [React Basic](https://github.com/reactjs/react-basic)
- [Build your own React](https://pomb.us/build-your-own-react/)
