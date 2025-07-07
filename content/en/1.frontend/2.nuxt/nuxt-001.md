---
title: Deployment with GitLab Runner
description: Nuxt, GitLab Runner, Docker, Kaniko, Dockerfile, Node.js, musl-libc, glibc
icon: 'lucide:alarm-clock-check'
gitTalk: false
date: 2025-01-19 15:32:20
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Nuxt Deployment with GitLab Runner

Due to work requirements, I needed to deploy a Nuxt application to GitLab Runner. This article documents the deployment process, problems encountered, and their solutions. I hope this can help others facing similar issues and prevent them from stepping into the same pitfalls that kept me up until midnight 🥲.

## Nuxt

Nuxt.js is an open-source framework based on Vue.js that aims to simplify Vue.js application development and enhance server-side construction. It provides a structured way to organize code, handle routing, server-side rendering (SSR), and data fetching, enabling developers to more easily build high-performance, SEO-friendly web applications. Nuxt abstracts the complex configuration of managing asynchronous data, middleware, and routing. It also provides built-in features such as automatic code splitting, auto-imports, and automatic asynchronous data loading on the server to improve application performance.

Nuxt.js supports three rendering modes:

- **SPA (Single Page Application)**: Controls page switching through JavaScript and fetches data via APIs. Suitable for building highly interactive single-page applications, such as admin dashboards or social networks.
- **SSG (Static Site Generation)**: Uses `nuxt generate` to generate static websites and fetches data via APIs. Offers fast loading speeds and SEO advantages, suitable for building static sites like blogs or corporate websites that need quick loading. I plan to upgrade this blog to `Nuxt SSG` architecture in the future.
- **SSR (Server-Side Rendering)**: Renders pages on the server and fetches data via APIs. SSR can improve SEO effectiveness and first-screen loading speed because the server sends complete HTML pages to the browser, which can display immediately. Suitable for websites that need to balance both SEO and user experience.

Nuxt.js provides many features to simplify the development process, such as:

- **File-system Routing**: Automatically generates routes based on the file structure of the `pages` folder.
- **Auto-imports**: Automatically imports components, Composables, and modules, reducing code redundancy.
- **Server-side APIs**: Such as `asyncData`, `fetch`, `useFetch`, and `useAsyncData`, making it convenient for developers to fetch data on the server side.
- **Other Features**: Such as server-side middleware, plugins, modules, and store.
- **Nitro Engine**: Nuxt.js's server engine with the following advantages:
  - Cross-platform support: Can run on Node.js, browsers, Service Workers, and other platforms.
  - Server API: Supports API routes and middleware.
  - Automatic code splitting: Improves application performance.
  - Hybrid rendering modes: Supports mixed modes of static rendering and server rendering.
  - Development server: Provides Hot Module Replacement (HMR) functionality to improve development efficiency.
  - Deployment: Simplifies deployment processes, supporting various deployment methods including server deployment and static deployment.
  - Performance optimization: Improves application performance through pre-rendering and caching strategies.
  - Debugging tools: Provides performance analysis and debugging tools to help developers identify performance bottlenecks.

::alert{type="danger" icon="lucide:lightbulb" title="What a Painful Realization"}
Our goal this time was to deploy a Nuxt SSR mode application to GitLab Runner and achieve automated deployment through GitLab Runner.
Little did I know, this was the beginning of stepping on landmines 🥲.
::

## GitLab Runner

GitLab Runner is an open-source project used to execute jobs on operating systems. It can be viewed as a continuous integration/continuous deployment (CI/CD) agent or job executor. It works with GitLab CI/CD to run specified jobs in GitLab CI/CD pipelines. GitLab Runner can run on Windows, Linux, and macOS, and can run in containers. GitLab Runner supports container platforms such as Docker, Kubernetes, and Podman.

This is why we chose to use it - to package Nuxt applications through Docker and deploy them to specified environments.

### GitLab Runner Installation

Here we use Docker to install GitLab Runner for easier management of Runner versions and environments.

```bash
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
```

This completes the GitLab Runner installation. Next, we need to register the Runner.

### GitLab Runner Registration

[GitLab Runner](https://docs.gitlab.com/runner/)

```bash
docker exec -it gitlab-runner gitlab-runner register
```

Then follow the prompts for registration. You'll need to fill in GitLab URL, Token, Runner name, description, tags, and other information.

### Runner Configuration (config.toml)

[TOML](https://en.wikipedia.org/wiki/TOML)

The TOML configuration file is the GitLab Runner configuration file where we can configure the Runner's runtime environment, execution methods, etc. [Example](https://gitlab.com/gitlab-org/gitlab-runner/-/blob/main/config.toml.example)

`If the Runner needs to use Docker to execute jobs, you need to configure Docker-related settings.`

```toml
[[runners]]
name = "docker-runner"
url = "https://gitlab.com/" # Fill in the actual GitLab connection URL, such as https://gitlab.com/ or self-hosted GitLab server address
token = "xxxxxxxxxxxxxxxxxxxx" # Fill in GitLab's Runner Token here
executor = "docker"

# Executor type is docker
[runners.docker]
network_mode = "host" # Use host network mode, allowing containers to directly access host network
privileged = true # Enable privileged mode, allowing containers to access host resources, such as Docker Socket
disable_entrypoint_overwrite = false
oom_kill_disable = false
disable_cache = false
volumes = [ "/cache" ] # Mount host's /cache directory to container's /cache directory
shm_size = 0
```

The Runner concept is somewhat like a CI/CD agent or job executor that runs specified tasks according to the configured environment. Here we configured a `docker-runner`, originally planning to use the `node:lts` Docker image to run tasks. `node:lts` is the Node.js long-term support version, providing better stability. However, since we actually need to deploy a Nuxt SSR mode application, we need to define a custom Docker image.

## First Pitfall: Misunderstanding Kaniko vs `docker build`

To solve this problem, we first need to clarify the differences between local development environments and CI/CD environments. During local development, I was accustomed to using the `docker build` command to build images. However, our CI/CD environment chose to use Kaniko.

Kaniko is Google's open-source Docker image building tool that can build Docker images without a Docker Daemon, avoiding potential security risks that Docker Daemon might bring. Therefore, it's commonly used in CI/CD environments.

Since we wanted the CI environment to not depend on Docker Daemon, my colleague chose to use Kaniko. As a result, I tried to build images locally with `docker build`, but the gitlab-ci.yml used Kaniko, so it kept failing. I was stuck for half the day not knowing what the problem was.

::alert{type="danger" icon="lucide:lightbulb" title="What a Painful Realization"}
What a painful realization!
In fact, Kaniko doesn't rely on Docker Daemon, so it cannot use the `docker build` command.
However, it still defines and builds images through Dockerfiles, but the command needs to be changed to Kaniko's `executor`. For example, the original `docker build -t my-image .` needs to be changed to `/kaniko/executor --dockerfile Dockerfile --context . --destination my-image:latest`.
I initially used `docker build` to build the Nuxt image, and ended up stuck like this for half the day 🥲.
::

### Docker Daemon Security Issues

Docker Daemon is Docker's core component, responsible for managing Docker images, containers, networks, storage spaces, and other resources. Docker Daemon runs with root privileges by default, which can lead to security issues such as container escapes and internal container attacks. Therefore, to improve security, we can use Kaniko to avoid Docker Daemon security issues.

## Second Pitfall: Dockerfile Build Failures

After solving the Kaniko issue, I thought deployment would go smoothly, but unexpectedly encountered new pitfalls. I found that locally built Nuxt images could run successfully, but building on GitLab Runner kept failing.

### 1. Multi-stage Builds Failure

In the Dockerfile, multi-stage builds were used to reduce the final image size, but building on GitLab Runner kept failing.

::alert{type="note" icon="lucide:pencil" title="Solution"}
In multi-stage builds, first install all development dependencies (devDependencies) and execute the build in the first stage, then install only production dependencies in the second stage and copy the build artifacts from the first stage. This can significantly reduce the final image size and reduce potential dependency conflicts.
The specific approach is: "Install all devDeps + build in the build stage, then remove devDeps and install prodDeps."
::

### 2. Node.js Version Differences (node:20 vs node:alpine/node:lts)

Initially used `node:alpine` as the base image, but building on GitLab Runner kept failing and couldn't display pages correctly.

Different Node.js versions may contain different versions of base packages like npm/corepack/Python/g++/make. Between Node 20, 19, and 18, there are slight differences in behavior for some native addons or package installation. For example: Node 20 might require higher versions of certain compilation tools, or behave slightly differently with pnpm. Sometimes in `node:alpine` environments, because it uses musl-libc instead of glibc, some packages (especially those requiring native compilation) may fail to install.

#### Differences Between musl-libc and glibc

Alpine Linux uses musl-libc as its C standard library, while most Linux distributions use glibc. There are some differences between these two, especially when compiling native modules, which can cause problems.

::alert{type="note" icon="lucide:pencil" title="Solution"}
Using `node:lts` or explicitly specifying a Node.js version (e.g., `node:18`) as the base image in the Dockerfile can avoid some package installation issues.
::

## Summary

During this deployment process, I stepped on quite a few pitfalls, but also learned a lot:

- If you want to use `docker build`, use Docker Daemon; if you don't want to depend on Docker Daemon, use Kaniko to build images with the command `/kaniko/executor --dockerfile <Dockerfile path> --context <build context path> --destination <target image name>`.
- In multi-stage builds, by first installing all dependencies, executing the build, then removing development dependencies and installing only production dependencies, you can significantly reduce the final image size and reduce dependency conflicts.
- Node.js version differences can cause package installation issues. It's recommended to use `node:lts` or explicitly specify a Node.js version as the base image to ensure environment consistency.

Although this is just a brief text description, it represents my blood, sweat, and tears from staying up late stepping on pitfalls. I hope this article can help those in need and prevent them from repeating the same mistakes. Sob sob sob 🥲

## References

- [Nuxt.js](https://nuxtjs.org/)
- [GitLab Runner](https://docs.gitlab.com/runner/)
- [Dockerfile](https://docs.docker.com/engine/reference/builder/)
- [Kaniko](https://github.com/GoogleContainerTools/kaniko)
- [Alpine Linux](https://alpinelinux.org/)
- [musl-libc](https://musl.libc.org/)
- [glibc](https://www.gnu.org/software/libc/)
