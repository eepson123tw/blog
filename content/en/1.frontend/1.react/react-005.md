---
title: Day 5 Hooks and State Driving
description: Learning the React Framework
icon: i-lucide-aperture
gitTalk: false
date: 2023-06-10 17:35:00
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
navigation:
  icon: i-lucide-aperture
---

> Learning the React Framework - 005 Function Hooks and State Driving

## Why Did React Implement Hooks?

[Hooks](https://react.dev/reference/react)

React Hooks were introduced in version 16.8.0. They are completely different from class component lifecycle events.
Simply put, with increasingly complex development requirements being proposed, we need to observe changes in certain dependency values and display these changes in the browser at different time points - driving side effects, managing side effects, optimizing side effects, etc.

Hooks are the implementation of these methods.

Depending on the different functions of Hooks, the tasks they can accomplish vary greatly.
Next, I'll share and discuss basic and advanced Hooks~

## Basic Hooks

### useState

::u-button{to="https://react.dev/reference/react/useState" trailing-icon="lucide:arrow-up-right" variant="ghost" target="_blank"}
  useState
::

State allows components to **remember** information like user input. Components can use state to store input values, or any variables you want to save and change according to your set logic.

### useEffect

::u-button{to="https://react.dev/reference/react/useEffect" trailing-icon="lucide:arrow-up-right" variant="ghost" target="_blank"}
  useEffect
::

Hook triggered during rendering and re-rendering

- Lazy initialization *lazy state initial first frame evoked => computed extra expensive*
- Only when necessary (triggered when observed values change) *shallow comparison attention with what you consent*
- Can be extracted into a custom function

### hooks

[flow](https://github.com/donavon/hook-flow/blob/master/hook-flow.pdf)

This flowchart briefly describes the process of Hooks during mount, update, and unmount.

### codepen

[Simulating hooks mounting order](https://codepen.io/eepson123tw/pen/poxmxeQ?editors=1111)

Following the flowchart above, we can clearly distinguish

### When a component is mounted

render start ⇒ lazy initiallizers ⇒ render end ⇒ LayoutEffects ⇒  dom update(Painting/User  see change) ⇒ some state change ⇒ render start⇒ render end⇒ layoutEffects run again ⇒ cleanLayout ⇒ dom update ⇒  cleanEffect⇒Run Effect

### When a component is unmounted

render start ⇒ render end ⇒ child component cleanup ⇒ parent component cleanup ⇒ parent component  run effect

- When child components trigger updates, only the child component's flow is triggered

Note that for child components, you might think child components render first when parent components finish rendering, but this isn't the case. Because the underlying system directly calls react.createElement, React will only sequentially render and execute child component effects after the parent component mounting is complete.

Empty array ⇒ observes everything ⇒ which tells React it doesn't currently depend on application state ⇒ only triggers once during render

### Pay attention to lifting state

Lift component state to the top level, and pass down update functions from the top level to each component for management

React state should be encapsulated where it's truly needed - co-locate the state to where it needs to be.

## Pokemon

Attempting to use React basic hooks to implement an infinitely scrollable and responsive Pokémon card list (turns out there are so many Pokémon 🫠)

::u-button{to="https://pokemon.zeabur.app/" trailing-icon="lucide:arrow-up-right" variant="ghost" target="_blank"}
  Pokemon
::

## References

::callout{icon="lucide:bookmark" to="https://kentcdodds.com/blog/use-state-lazy-initialization-and-function-updates"}

useState lazy initialization and function updates

::