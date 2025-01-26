---
title: 部署與 gitlab runner
description: Nuxt、Gitlab Runner、Docker、Kaniko、Dockerfile、Node.js、musl-libc、glibc
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

> Nuxt 部署與 Gitlab Runner

因工作需求，需要將 Nuxt 應用程式部署到 Gitlab Runner 上，本文將記錄部署過程、遇到的問題以及解決方案，希望可以幫助到同樣遇到這些問題的人，避免像我一樣踩坑踩到半夜🥲。

## Nuxt

Nuxt.js 是一個基於 Vue.js 的開源框架，旨在簡化 Vue.js 應用程式的開發，並增強伺服器端的建構。它提供了結構化的方式來組織程式碼、處理路由、伺服器端渲染 (SSR) 和資料獲取，使開發者能更輕鬆地構建高性能、SEO 友好的 Web 應用程式。Nuxt 抽象化了管理非同步資料、中介層 (middleware) 和路由的複雜配置，它還提供了一些內建功能，例如自動程式碼分割、自動匯入和伺服器上的自動非同步資料載入，以提升應用程式的效能。

Nuxt.js 支援三種渲染模式：

- **SPA (單頁應用程式)**：透過 JavaScript 控制頁面切換，並透過 API 獲取資料。適合打造互動性強的單頁應用程式，例如管理後台或社交網站。
- **SSG (靜態網站生成)**：使用 `nuxt generate` 生成靜態網站，並透過 API 獲取資料。具有快速的載入速度和 SEO 優勢，適合建立像部落格或官網這類需要快速載入的靜態網站。未來我計畫將此部落格升級至 `Nuxt SSG` 架構。
- **SSR (伺服器端渲染)**：在伺服器端渲染頁面，並透過 API 獲取資料。 SSR 可以提升 SEO 效果和首屏載入速度，因為伺服器會發送完整的 HTML 頁面到瀏覽器，瀏覽器可以立即顯示。適合需要兼顧 SEO 和使用者體驗的網站。

Nuxt.js 提供了許多功能來簡化開發流程，例如:

- **檔案系統路由**：根據 `pages` 資料夾的檔案結構自動生成路由。
- **自動匯入**：自動匯入元件、Composable 和模組，減少程式碼冗餘。
- **伺服器端 API**：例如 `asyncData`、`fetch`、`useFetch` 和 `useAsyncData`，方便開發者在伺服器端獲取資料。
- **其他功能**：例如伺服器端中介層 (middleware)、插件、模組和 store 等。
- **Nitro 引擎**：Nuxt.js 的伺服器引擎，具備以下優勢：
  - 跨平台支援：可在 Node.js、瀏覽器、Service Workers 等平台上運行。
  - 伺服器 API：支援 API 路由和中介軟體。
  - 自動程式碼分割：提升應用程式效能。
  - 混合渲染模式：支援靜態渲染和伺服器渲染的混合模式。
  - 開發伺服器：提供熱模組重載(HMR)功能，提升開發效率。
  - 部署：簡化部署流程，支援伺服器部署、靜態部署等多種部署方式。
  - 效能優化：透過預渲染和快取策略提升應用程式效能。
  - 除錯工具：提供效能分析和除錯工具，方便開發者找出效能瓶頸。

::alert{type="danger" icon="lucide:lightbulb" title="多麼痛的領悟"}
我們這次的目標是將 Nuxt 的 SSR 模式應用程式部署到 Gitlab Runner 上，並透過 Gitlab Runner 進行自動化部署。
沒想到，這就是踩雷的開始 🥲。
::

## Gitlab Runner

GitLab Runner 是一個開源專案，用於執行作業系統上的作業 (jobs)，可將其視為一個持續整合/持續部署(CI/CD) 的代理程式或工作執行器。它與 GitLab CI/CD 結合使用，可以在 GitLab CI/CD 流程中運行指定的作業。GitLab Runner 可以運行在 Windows、Linux 和 macOS 上，並且可以運行在容器中。GitLab Runner 支援 Docker、Kubernetes 和 Podman 等容器平台。

這也是我們選擇使用它的原因，透過 Docker 封裝 Nuxt 應用程式，將其部署到指定的環境上。

### Gitlab Runner 安裝

這裡我們使用 Docker 安裝 Gitlab Runner，以便於管理 Runner 的版本和環境。

```bash
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
```

這樣就完成了 Gitlab Runner 的安裝，接下來我們需要註冊 Runner。

### Gitlab Runner 註冊

[Gitlab Runner](https://docs.gitlab.com/runner/)

```bash
docker exec -it gitlab-runner gitlab-runner register
```

然後根據提示進行註冊，這裡需要填寫 Gitlab 的 URL、Token、Runner 名稱、描述、標籤等資訊。

### Runner 配置 (config.toml)

[TOML](https://zh.wikipedia.org/zh-tw/TOML)

TOML 配置文件是 Gitlab Runner 的設定檔，我們可以在這裡配置 Runner 的運行環境、運行方式等。[範例](https://gitlab.com/gitlab-org/gitlab-runner/-/blob/main/config.toml.example)

`若 Runner 需要使用 Docker 執行作業，則需要配置 Docker 的相關設定。`

```toml
[[runners]]
name = "docker-runner"
url = "[https://gitlab.com/](https://gitlab.com/)" # 填寫實際的 GitLab 連線 URL，例如 [https://gitlab.com/](https://gitlab.com/) 或自建 GitLab 伺服器位址。
token = "xxxxxxxxxxxxxxxxxxxx" # 這裡填寫 Gitlab 的 Runner Token
executor = "docker"

# 執行器類型為 docker
[runners.docker]
network_mode = "host" # 使用主機網路模式，讓容器可以直接存取主機網路
privileged = true # 啟用特權模式，讓容器可以存取主機資源，例如 Docker Socket
disable_entrypoint_overwrite = false
oom_kill_disable = false
disable_cache = false
volumes = [ "/cache" ] # 掛載主機的 /cache 目錄到容器的 /cache 目錄
shm_size = 0
```

Runner 的概念有點像是一個 CI/CD 的代理程式或工作執行器，它會根據配置的環境，運行指定的任務。這裡我們配置了一個 `docker-runner`，原本預計使用 `node:lts` 的 Docker 映像來運行任務，`node:lts` 是 Node.js 的長期維護版本，能提供較佳的穩定性。但由於我們實際上需要部署的是 Nuxt 的 SSR 模式應用程式，所以需要自行定義一個 Docker 映像。

## 第一個雷坑：Kaniko 與 `docker build` 的誤解

為了解決這個問題，我們首先需要釐清本地開發環境與 CI/CD 環境的差異。在本地開發時，我習慣使用 `docker build` 指令來建構映像。然而，我們的 CI/CD 環境選擇使用了 Kaniko。

Kaniko 是 Google 開源的 Docker 映像建構工具，它可以在沒有 Docker Daemon 的情況下建構 Docker 映像，避免了 Docker Daemon 可能帶來的安全風險，因此常被用於 CI/CD 環境中。

由於我們希望 CI 環境不依賴 Docker Daemon，同事選擇使用了 Kaniko。結果我嘗試在本地用 `docker build` 來建置映像時，但 gitlab-ci.yml 上卻是使用了 Kaniko，所以一直失敗，但我卡了半天都不知道問題出在哪裡。

::alert{type="danger" icon="lucide:lightbulb" title="多麼痛的領悟"}
多麼痛的領悟
事實上，Kaniko 不依賴 Docker Daemon，因此無法使用 `docker build` 指令。
但它仍然是透過 Dockerfile 來定義並建置映像，只是指令要改用 Kaniko 的 `executor`。例如，原本的 `docker build -t my-image .` 需要改為 `/kaniko/executor --dockerfile Dockerfile --context . --destination my-image:latest`。
我一開始卻使用 `docker build` 來建構 Nuxt 映像，結果就這樣卡了半天🥲。
::

### Docker Daemon 安全問題

Docker Daemon 是 Docker 的核心組件，負責管理 Docker 映像、容器、網路、儲存空間等資源。Docker Daemon 預設是以 root 權限運行的，這可能會導致安全問題，例如容器逃逸、容器內部攻擊等。因此，為了提高安全性，我們可以使用 Kaniko 來避免 Docker Daemon 的安全問題。

## 第二個雷坑：Dockerfile 建構失敗

解決了 Kaniko 的問題後，以為可以順利部署了，沒想到又遇到了新的雷。我發現本地建構的 Nuxt Image 可以成功運作，但在 Gitlab Runner 上建構卻一直失敗。

### 1. 多階段建構 (Multi-stage Builds) 失敗

Dockerfile 中，使用了多階段建構來減少最終映像的大小，但是在 Gitlab Runner 上建構卻一直失敗。

::alert{type="note" icon="lucide:pencil" title="解方"}
在多階段建構中，先在第一個階段安裝所有開發相依套件 (devDependencies) 並執行建構 (build)，然後在第二階段只安裝生產環境相依套件 (dependencies)，並複製第一階段的建構產物。這可以大幅降低最終映像的大小，並減少潛在的相依套件衝突問題。
具體做法是：「在 build 階段安裝所有 devDeps + build，然後移除 devDeps，再安裝 prodDeps」。
::

### 2. Node.js 版本差異 (node:20 vs node:alpine/node:lts)

一開始使用 `node:alpine` 作為基礎映像，但是在 Gitlab Runner 上建構卻一直失敗，無法正確顯示頁面。

不同 Node.js 版本可能內含不同的 npm / corepack / Python / g++ / make 等基底套件版本。Node 20、19、18 之間對一些原生模組 (native addons) 或套件安裝行為會略有差異。例如：Node 20 可能需要更高版本的某些編譯工具，或者與 pnpm 的行為略有不同。有時候在 `node:alpine` 的環境中，因為使用 musl-libc 而非 glibc，有些套件 (尤其是需要原生編譯的套件) 會安裝失敗。

#### musl-libc 與 glibc 的差異

Alpine Linux 使用 musl-libc 作為 C 標準函式庫，而大多數 Linux 發行版使用 glibc。這兩者之間有一些差異，尤其是在編譯原生模組時可能會出現問題。

::alert{type="note" icon="lucide:pencil" title="解方"}
在 Dockerfile 中使用 `node:lts` 或明確指定 Node.js 版本 (例如 `node:18`) 作為基礎映像，可以避免一些套件安裝問題。
::

## 總結

這次的部署過程中，踩了不少坑，但也學到了不少東西：

- 若要使用 `docker build`，請使用 Docker Daemon；若不想依賴 Docker Daemon，則使用 Kaniko 來建置映像，指令為 `/kaniko/executor --dockerfile <Dockerfile 路徑> --context <建構上下文路徑> --destination <目標映像名稱>`。
- 多階段建構中，透過先安裝所有相依套件、執行建構，再移除開發相依套件、僅安裝生產環境相依套件的方式，可以大幅降低最終映像的大小並減少相依套件衝突。
- Node.js 版本差異可能導致套件安裝問題，建議使用 `node:lts` 或明確指定 Node.js 版本作為基礎映像，以確保環境的一致性。

雖然只是短短的文字描述，卻是我熬夜踩坑的血淚經驗，希望這篇文章能幫助到有需要的人，避免重蹈覆轍。嗚嗚嗚🥲

## 參考文獻

- [Nuxt.js](https://nuxtjs.org/)
- [Gitlab Runner](https://docs.gitlab.com/runner/)
- [Dockerfile](https://docs.docker.com/engine/reference/builder/)
- [Kaniko](https://github.com/GoogleContainerTools/kaniko)
- [Alpine Linux](https://alpinelinux.org/)
- [musl-libc](https://musl.libc.org/)
- [glibc](https://www.gnu.org/software/libc/)
