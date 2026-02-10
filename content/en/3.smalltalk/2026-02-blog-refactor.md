---
title: Blog Cleanup - Finally Paying Off This Tech Debt
description: That project cleanup I've been putting off forever finally happened one weekend
icon: 'lucide:wrench'
gitTalk: true
date: 2026-02-10 20:00:00
read: '5'
navBadges:
  - value: New
    type: primary
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

![refactor](/images/smalltalk/blog-refactor.jpg)
> [image link](https://unsplash.com/photos/laptop-computer-showing-codes-zE007SNgcdE)

Alright, I finally got around to cleaning up this blog. Honestly, this tech debt has been piling up forever. Every time I saw it, I told myself "I'll deal with it next time"... and here we are, months later. I'm really good at procrastinating 😅

## The Trigger: Those Annoying Warnings

One day I randomly ran `pnpm audit`, and boom - **43 security vulnerabilities** popped up on my screen, 18 of them marked as High severity. I was not having a good time QQ

I know most of them are from indirect dependencies, but seeing all that red text still felt pretty bad.

There were also some things I should've fixed ages ago:

- **Sensitive info exposed** - PostHog Key, Gitalk Secret just sitting there in the config file, yikes
- **nuxt.config.ts was massive** - 235 lines! Finding anything was a pain
- **Typo in filename** - `error-handler.ts.ts`, yes two `.ts`, don't ask me what I was thinking 🤦

::alert{type="warning" icon="lucide:alert-triangle"}
Tech debt is like credit card debt - the longer you wait, the more interest you pay...
::

## Alright, Time to Pay Up

This refactor had three main parts:

### 1. Upgrade Those Packages

First, dealing with the outdated dependencies:

| Package | Before | After |
|---------|--------|-------|
| Vue | 3.5.16 | 3.5.28 |
| @nuxt/image | 1.10.0 | 2.0.0 |
| @antfu/eslint-config | 4.14.1 | 7.4.2 |
| posthog-js | 1.210.2 | 1.345.2 |

Hit a snag during upgrades: `shadcn-docs-nuxt` 1.1.9 caused the build to explode. Turns out it has compatibility issues with the current Nuxt 3. Had to roll back to 1.0.2 for now.

After the upgrades, vulnerabilities dropped from 43 to 35. Not perfect, but definitely better.

### 2. Move Sensitive Info to Environment Variables

Moved all the API keys (GA, PostHog, Gitalk) to `.env` and read them via Nuxt's `runtimeConfig`. This way sensitive stuff doesn't get committed, and different environments can have different configs. Pretty basic stuff, but I just never got around to it 🙈

### 3. Split Up That Bloated Config

235 lines of `nuxt.config.ts` was just annoying to deal with, so I split it up:

```
config/
├── index.ts    # exports
├── image.ts    # image settings
├── nitro.ts    # server settings
└── vite.ts     # build settings
```

After splitting, the main file is around 100 lines. Much cleaner.

## Other Stuff I Fixed Along the Way

Since I was already cleaning up, might as well handle the small stuff too:

- **Added lint and typecheck scripts** - Can't believe I didn't have these before, no wonder the code was a mess
- **ESLint ignores Markdown** - Otherwise there'd be tons of false warnings
- **Auto-fixed 522 lint errors** - One `--fix` command and done, should've done this sooner

## Thoughts After Cleanup

Spent about half a day, but totally worth it:

::alert{type="success" icon="lucide:check-circle"}
**Results:**
- Security vulnerabilities down 19%
- Code structure much cleaner
- Finally have automated checks

**Mood:**
- No more staring at those red warnings
- More confident about this project now
::

Honestly, should've done this way earlier. But that's just how it is - we always prioritize "urgent" stuff and keep pushing back the "important but not urgent" things. This experience really drove home the point: **tech debt needs regular payments**.

## Notes for Future Me

Quick reminders for myself (and you):

1. **Run `pnpm audit` monthly** - Don't let problems pile up
2. **Always use env vars for sensitive info** - Non-negotiable
3. **Split configs when they hit 150+ lines** - Otherwise maintenance is painful
4. **Use `--fix` liberally** - Many issues are one command away

::alert{type="info" icon="lucide:lightbulb"}
Tech debt isn't scary. Pretending it doesn't exist is.
::

---

That's it for this cleanup. If your project has similar issues, find a weekend and tackle them. That feeling of freshness after cleaning up? Totally worth it ✨

Feel free to leave comments if you have questions~
