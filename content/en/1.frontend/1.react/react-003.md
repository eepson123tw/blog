---
title: Day 3 State and Side Effects
description: Learning the React Framework
icon: 'lucide:air-vent'
gitTalk: false
date: 2023-05-06 19:00:20
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---
> Learning the React Framework - 003 Component State and Side Effect Updates

## State Abstraction

In actual development scenarios, frontend receives a lot of data, whether it's initial default data for the page or API data passed from the backend. We need a method to save this data, and state is a function implemented by React.

According to the description in React's basic concept theory, UI is influenced by State to change into different forms. We hope each UI can preserve its own state and **unidirectionally update state** through functions we design.

::code-group

```javascript [From Basic Concepts]
/* Combining state management with UI logic abstraction, just like components, we define parameters coming in through props,
  and update the passed down state according to side effect functions.
  Notice that the abstract component doesn't have other functions that trigger side effects,
  this is to maintain data state immutability - data can only change unidirectionally according to our design.
*/
function FancyNameBox(user, likes, onClick) {
  return FancyBox([
    'Name: ',
    NameBox(`${user.firstName} ${user.lastName}`),
    'Likes: ',
    LikeBox(likes),
    LikeButton(onClick),
  ]);
}

// Implementation Details (Set initial state value and side effect function to update state)

let likes = 0;
function addOneMoreLike() {
  likes++;
  rerender(); // Very important - when state updates, we need to trigger page update
}

// Init - Data state initialization

FancyNameBox(
  { firstName: 'Sebastian', lastName: 'Markbåge' },
  likes,
  addOneMoreLike
);
```

::

## useState

Components in React are just function encapsulations. When a function is executed, its memory reference gets cleared. We want state to persist in our components according to page logic usage. React implemented a hook (which can be viewed as an official utility function) called useState that allows state to persist.

[Example](https://codepen.io/eepson123tw/pen/NWOyNYP?editors=1010)

::alert{type="warning" icon="lucide:eraser"}
From the example, we can observe that we call useState in the component and set an initial value, change state according to our defined method, and after state changes, the page rerenders and we find the state has been updated.
::

## How useState Works Internally

Simply put, useState does two things for us:

1. Allows state values that would otherwise not persist after rerender to continue existing.
2. Triggers rerender again after state updates.

::alert{type="warning" icon="lucide:eraser"}
useState is an encapsulated closure space, which is the implementation of state abstraction.
::

```javascript
// Simple abstraction
function useState(state) {
  const setState = (action) => {
    action(state);
    React.root.reRender(<App />); // rerender
  };
  return [state, setState];
}
```

Each time we call useState, we receive the state and the side effect function that triggers it from the function, then update the page.
This abstraction is just a very simple description. The actual implementation is much more complex, involving initial value observation, node slicing, etc... **Really quite interesting 😇😇**

## State Management for Arrays and Objects

::alert{type="danger" icon="lucide:ambulance"}
In React state management, any type of data must be treated as immutable. You should not directly change objects under React state. Instead, when you want to update an object (or array), you need to **create a new object (or copy an existing object)**, then set state to use that copy.
::

When managing object data with state, we can use destructuring to modify state, [Example](https://codepen.io/eepson123tw/pen/NWOyNYP?editors=1011)

For array data state management, just like objects, we shouldn't directly change values in the array, but need to create or return new objects.

```javascript
setAry(
  // Replace the state
  [
    // with a new array
    ...ary,
    { id: nextId++, name },
  ]
);
```

Additionally, when changing complex object types, be careful about whether you're changing **shared memory references**, otherwise unexpected errors can easily occur.

## Resetting State with Key

Key is an attribute that identifies nodes, commonly used when rendering lists, allowing React to identify the uniqueness of nodes.
But when managing state, you can also use Key to reset state. This mainly utilizes the characteristic that when key values change, rerendering occurs.

[Example](https://codepen.io/eepson123tw/pen/NWOyNYP?editors=0011)

## References

If you want to understand why state is immutable, [you can go here](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react)

- [Visual Understanding of React](https://react.gg/visualized#history-of-the-web)
- [React Official Documentation](https://react.dev/)
- [React Basic](https://github.com/reactjs/react-basic)
- [Build your own React](https://pomb.us/build-your-own-react/)
