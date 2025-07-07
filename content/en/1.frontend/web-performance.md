---
title: Web Performance Metrics and Optimization
description: Performance, Metrics
icon: 'lucide:power-off'
gitTalk: false
date: 2022-12-15 21:18:08
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Do you know what performance metrics exist for web pages?

We often hear terms like considering performance and optimizing web efficiency when developing web features, but do we really know how to improve these metrics? More specifically, do we know what these metrics actually are?
What do these metrics represent, and how should we tune them? Let's introduce and analyze these metrics one by one~

## What Does Performance Mean to Users?

For users, it's not difficult to distinguish between good and bad websites. It's simply about the website's loading speed, whether the user flow experience is smooth, whether all page functions work properly, and whether there are no layout shifts. That's enough. However, these simple evaluation methods also encompass many performance metrics~

## First Contentful Paint (FCP)

First Contentful Paint (FCP) measures the time from when the page starts loading to when any part of the page content (including text, images, canvas, etc.) finishes rendering in the viewport, **but not all content.**
A good web page should have FCP rendered within 1.8 seconds, meaning any content should be painted on the webpage within 1.8 seconds for users to see.

FCP can be observed using F12's Lighthouse or measured using third-party packages. JavaScript also provides related performance APIs for detection, but some special circumstances may cause differences that need special attention.

> Methods to optimize FCP:
>
> 1. Eliminate render-blocking resources (be careful with reflow and repaint)
> 2. Compress CSS size (loading speed)
> 3. Remove unused CSS (tree shaking)
> 4. Preconnect to required origins
> 5. Avoid enormous network payloads
> 6. Control DOM size
> 7. Control critical request counts (browsers have limits, exceeding them requires waiting for responses)

## Largest Contentful Paint (LCP)

Reports the relative time when the largest image or text content visible in the viewport completes rendering, based on when the page first started loading.
The most important metric for SEO~! The largest content should be painted within 2.5 seconds, allowing users to see the webpage's key images or text as quickly as possible.
The faster the loading time, the more likely users are to stay. **Note that if the current element is removed during loading, the loading time will be recalculated**

> Methods to optimize LCP:
>
> 1. Optimize [critical rendering path](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Critical_rendering_path) (CSSOM+DOM+layout, etc.)
> 2. Optimize CSS (don't use properties that require recalculation)
> 3. Optimize images (image size control, caching, etc.)
> 4. Optimize JavaScript (control JS lines so layout can be computed faster)

## First Input Delay (FID)

Measures the delay time when users first interact with the webpage (clicking links, opening dropdown menus, filling forms, etc.). This is the time needed to produce a response after user interaction.
Good input delay should be controlled within 100 milliseconds. Any processing on the main thread can affect this value and needs to be well managed, as it represents the first impression of the website.

> Methods to optimize FID:
>
> 1. Reduce third-party code impact
> 2. Reduce JavaScript execution time
> 3. Minimize main thread work
> 4. Keep low HTTP request counts and small transfer sizes

## Time to Interactive (TTI)

The time needed from start loading until main sub-resources complete rendering and can respond quickly and reliably to user input.
Good TTI should be controlled within five seconds. In SSR frameworks, because page injection time is faster, it often leads to the awkward situation where pages appear but functions cannot execute, which is one of the reasons for declining user patience.
To solve this problem, new technologies have emerged, such as [Islands Architecture](https://juejin.cn/post/7155300194773860382), allowing core page components to have faster TTI while maintaining SEO~

> Methods to optimize TTI:
>
> 1. Reduce critical request count and size
> 2. Reduce third-party code impact
> 3. Reduce JavaScript execution time
> 4. Preload resources

## Total Blocking Time (TBT)

Refers to the total time the main thread is "blocked" between FCP and TTI. This is the duration that blocks the main thread and affects page usability.
If the main thread is blocked for more than 50 milliseconds, it may cause user experience degradation. Good TBT should be controlled within 300 milliseconds.

> Methods to optimize TBT:
>
> 1. Reduce critical request count and size
> 2. Reduce third-party code impact
> 3. Reduce JavaScript execution time

## Cumulative Layout Shift (CLS)

Measures the impact on the page when clicking certain content causes position shifts. **CLS is the largest layout shift score among all unexpected layout shifts that occur during the entire page lifecycle.**
Good CLS should be controlled below 0.1. Elements whose starting position in the visible area changes between two frames are considered unstable elements. To change starting positions, use the transform property instead.

> Methods to optimize CLS:
>
> 1. **Always include size attributes on your image and video elements, or reserve the required space by using methods like CSS aspect ratio containers.** This approach ensures browsers can allocate the correct space size in the document during image loading.
> 2. **Never insert content above existing content unless absolutely necessary.** Ensure any layout shifts that occur are expected.
> 3. Use transform properties more often rather than properties that trigger [layout shifts](https://web.dev/debug-layout-shifts/).

## Conclusion

Among these metrics, there are several common key points, such as: request count and size, third-party package impact, layout reflow and repaint time, etc. These are all things we developers must pay attention to!
We can utilize the advantages of bundling tools and framework packages to optimize these metrics and incorporate these key points into our daily development, making websites more reliable~

Reference:
[Google Dev](https://web.dev/user-centric-performance-metrics/)
