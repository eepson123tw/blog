---
title: Day 4 Rendering and Fiber
description: Learning the React Framework
icon: 'lucide:archive'
gitTalk: false
date: 2023-05-16 21:50:00
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Learning the React Framework - 004 Rendering Slicing and Underlying Fiber

## How Does React Render Components?

Whenever you change the state in a component, React can immediately display the changes in the UI. Through our learning these past few days, we understand that React renders components to the page through Render and re-renders the page by observing state updates.
But we don't clearly understand what optimizations React does for developers in rendering. Next, let's take a shallow dive into React's efforts in Render, and after Render is triggered, what methods does React use to compare differences between states and what is its underlying implementation based on?

### State Snapshots

React creates snapshots of components, capturing everything React needs to update the view at a specific moment: state, event handlers, and UI descriptions.

### Rendering Mode Before React 16

Before React 16, updates needed to go through the reconciler (determining which components need updates, interruptible) then be scheduled to the renderer. After execution, **synchronous rendering** would occur. When pages were complex with nested component structures, changing one value required waiting a relatively long time for updates. **Moreover, changing parent component state would cause all child components underneath to re-render together.**

### Rendering Mode After React 16

Through the fiber structure, the synchronous rendering approach was changed to **asynchronous rendering** and task slicing technology, converting each component from virtual dom tree => fiber tree, implementing a structure that can be updated asynchronously. This allows the rendering process to be interrupted, paused, and resumed, thereby better controlling rendering priority, improving application responsiveness, and avoiding waiting time for rendering and JavaScript thread occupation issues.

## Fiber

:read-more{to="https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js#L414" title="ReactFiber"}
:read-more{to="https://www.youtube.com/watch?v=0ympFIwQFJw&t=5s&ab_channel=PhilipFabianek" title="PhilipFabianek"}

![fiberInfo](/images/react/fiberInfo.webp)

::collapsible
#title
Properties contained in FiberNode
[Source](https://xiaochen1024.com/article_item/600aca0cecf02e002e6db56c)
#content
```typescript
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Save node information---
  this.tag = tag;// Corresponding component type
  this.key = key;// key attribute
  // (A unique identifier with a set of children to help React determine which items have changed, been added, or removed from the list. It relates to React's "lists and keys" functionality described here.)
  this.elementType = null;// Element type
  this.type = null;// func or class
  this.stateNode = null;// Real dom node

  // Connect to form fiber tree---
  this.return = null;// Points to parent node
  this.child = null;// Points to child
  this.sibling = null;// Points to sibling node
  this.index = 0;

  this.ref = null;

  // Used to calculate state---
  this.pendingProps = pendingProps;
  // Props that have been updated from new data in React elements and need to be applied to child components or DOM elements.
  this.memoizedProps = null;
  // Props of the fiber used to create output during the previous render.
  this.updateQueue = null;
  // Queue of state updates, callbacks, and DOM updates.
  this.memoizedState = null;
  // State of the fiber used to create output. When processing updates, it reflects the state currently rendered on the page.
  this.dependencies = null;
  this.mode = mode;
  // effect related---
  this.effectTag = NoEffect;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;

  // Priority related properties---
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // Pointers for current and workInProgress---
  this.alternate = null;
}
```

::

It can be viewed as a data structure that saves component node attributes, types, and DOM, and forms and connects the Fiber tree through pointers to child, sibling, and return. This data structure divides the rendering process into interruptible units to support incremental rendering and better user interaction, distinguishing different levels and rendering priorities of component trees.

::alert{type="warning" icon="lucide:eraser"}
Works with the [requestIdleCallback API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback) call during browser idle time to implement task splitting, interruption, and resumption.
::

```jsx
function ClickCounter (){
//... above omitted
 return (
  <button key="1" onClick={this.onClick}>Update counter</button>
<span key="2">{this.state.count}</span>
)

}

```

Will be converted to

![fiber](/images/react/fiber.webp)

::alert{type="warning" icon="lucide:eraser"}

Each React element has a corresponding fiber node. Unlike React elements, fibers are not recreated on every render. These are mutable data structures that hold component state and DOM.

::

After the first render, React gets a fiber tree that reflects the application's state used to render the UI. This tree is often called the current tree (Current Fiber tree).

When React starts processing updates, it builds a so-called workInProgress tree that reflects the future state to be flushed to the page.

Once updates are processed and all related work is completed, React will have the workInProgress tree ready to flush to the page. Once this workInProgress tree is rendered to the page, it becomes the current tree.

We can understand that React stores two tree-like reference tables that compare with each other to analyze which nodes and states need to change, triggering re-rendering. This is also called double buffering technique.

::alert{type="danger" icon="lucide:ambulance"}
React always updates the DOM all at once—it doesn't show partial results.
::

![fiberTree](/images/react/fiberTree.webp)

## Side-effects

Think of components in React as functions that use state and props to compute UI representation. Any function that triggers computation, such as changing the DOM or calling lifecycle methods, should be considered a side effect, or simply an effect.

Therefore, fiber nodes are a convenient mechanism for tracking side-effects in addition to updates. Each fiber node can have effects associated with it. They are indicated in the effectTag property.

## Effect List

When component state on the page updates, we need to record which components have changed in their lifecycle or functions, triggering side effects. The Effect List uses a traceable linear list to record these processes,
executed in order from child to parent (deep to shallow recording), marked with different tags (firstEffect, lastEffect, nextEffect) in fiberNode to mark Effect order, and finally passed to Root to construct the list.

## Render and Commit Phases

React executes Virtual Dom conversion to Fiber tree, compares node differences, executes side effects, and finally displays and loads onto the page in two phases:

- Render (can execute asynchronously, interruptible) => Mainly creates Fiber Tree and generates EffectList.

> Most fibers in React elements will be reused and updated rather than regenerated, to reduce memory consumption.

- Commit (executes synchronously, cannot be interrupted) => Traverses the effectList generated by Render, observes props changes and state saved in Fiber nodes on the effectList. Finally **performs Dom operations and lifecycle execution**, executes operations in hooks, or destroys unused functions.

> This phase will execute single-threaded, and users will see screen changes, so it cannot be paused.

## Work loop

All fiber node work searching is handled in the work loop. nextUnitOfWork holds a reference to the fiber node from the workInProgress tree.
In this while loop, nodes will be continuously recursed to find if there's unfinished work. **Only after all work starting from child nodes is completed will parent node and backtracking work be completed.**

::alert{type="example" icon="lucide:eraser"}
 completeUnitOfWork and completeUnitOfWork are mainly used for iteration purposes, while the main activity occurs in beginWork and completeWork functions.
::

Implementation:

```javascript
function workLoop(isYieldy) {
  if (!isYieldy) {
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // Flush asynchronous work until the deadline runs out of time.
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}

function performUnitOfWork(workInProgress) {
  let next = beginWork(workInProgress);
  if (next === null) {
    next = completeUnitOfWork(workInProgress);
  }
  return next;
}

function beginWork(workInProgress) {
  console.log(`work performed for ${workInProgress.name}`);
  return workInProgress.child;
}

function completeWork(workInProgress) {
  console.log(`work completed for ${workInProgress.name}`);
  return null;
}

function completeUnitOfWork(workInProgress) {
  while (true) {
    const returnFiber = workInProgress.return;
    const siblingFiber = workInProgress.sibling;

    nextUnitOfWork = completeWork(workInProgress);

    if (siblingFiber !== null) {
      // If there is a sibling, return it
      // to perform work for this sibling
      return siblingFiber;
    } else if (returnFiber !== null) {
      // If there's no more work in this returnFiber,
      // continue the loop to complete the parent.
      workInProgress = returnFiber;
      continue;
    } else {
      // We've reached the root.
      return null;
    }
  }
}
```

## References

- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [async rendering and synchronous rendering](https://twitter.com/acdlite/status/977291318324948992)
- [Fiber](https://xiaochen1024.com/article_item/600aca0cecf02e002e6db56c)
- [Inside Fiber: in-depth overview of the new reconciliation algorithm in React](https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react)
- [A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs&t=1040s&ab_channel=MetaDevelopers)
