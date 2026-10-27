---
title: 利用AI學習Docker並應證
description: Docker、AI Learning、VM
icon: i-lucide-dock
gitTalk: false
date: 2024-08-24 16:25:30
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
navigation:
  icon: i-lucide-dock
---

換到新公司後需要負責一些部署方面的工作，因為是用 local 端起模型的模式，而且客戶的運行環境需要斷網，所以產品的更新需要使用到 docker，透過隔層分離，我們可以快速地遞交更新版本。也不會有環境不符的問題，雖然之前也學過 docker 並部署過東西，但大量使用卻是這份工作開始，為了加深印象，開始探索之旅吧。

## 什麼是 Docker?

Docker 是一個輕量化的部署平台，可以方便的部署程式、環境、及系統工具。底層機制為建立一個隔離的環境，可以把它理解成 docker 用了些特技把當前系統騙住了，讓他相信這其實是另一個環境。透過`容器化`的方式，將環境隔離後，並在此環境運行我們定義的程式碼架構，但其實還是在調用當前系統的內核，所以我們還能在 docker 中寫一些 linux 指令。

### 核心功能

- Namespaces: 命名空間確保每個容器都有自己的系統視圖，包括自己的進程樹、網路介面和檔案系統。單一容器中的進程無法與另外的進程交互。
- Control Groups (cgroups): Cgroups（控制群組的縮寫）是一項 Linux 核心功能，允許將進程組織成分層群組並對這些群組應用資源限制，docker 利用此特性，限制每個容器的使用資源上限，避免資源競態。
- Union File System (UnionFS):聯合文件系統，允許覆蓋多個目錄，從而建立單一一致的檔案系統，而無需修改底層檔案。

```text
Namespaces => PID | Network | Namespace | Mount Namespace | User Namespace

Control Group => docker run --memory="128m" --cpus="1.0" my_image

Union File System ⬇️

FROM ubuntu:20.04
COPY . /app
RUN make /app
CMD ["./app"]

```

### image

為一種只讀的可執行且輕量的印象檔，內部為獨立的環境，由 Dockerfile 建立（下方介紹），可理解為一個掛載檔案，將檔案掛載至當前系統中！我們也可以透過 docker hub(一種類似 github 的東西，但是拿來存放 docker image)，所以你可以自己寫，也可以下載別人寫好的服務～

### container

最重要的部分，`容器`將應用程式與其環境隔離，並確保應用程式在不同的運算環境中一致運行，輕量級的並且`共享主機系統的內核`。且容器是基於 image 的，所以當我們透過 Dockerfile 設定 image 時，也可以理解為在設定未來要起的容器內容。這樣是不是很方便呢，過往我們必須要在不同的 host 部署程式的話，還要擔心 host 的各種版本問題，不論是前端還是後端，都需要統一這些環境版本，但有了 docker 後，我們幾乎可以達到一件部署的樣式。

### Dockerfile

Dockerfile 是一個文字文件，其中包含一系列有關如何建立 Docker 映像的設定。我個人感覺是寫起來蠻像 yml 的。

```docker [dockerfile] icon=lucide:code-xml line-numbers
# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set environment variables to prevent Python from writing .pyc files and to ensure output is logged immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python", "app.py"]

```

實際上這個 markdown 網站也是用 docker 並使用 nginx 代理～

```docker [dockerfile] icon=lucide:code-xml line-numbers
# 第一階段：構建 Vue.js 靜態資源使用 node:20 作為鏡像基底
FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN yarn install && yarn run docs:build

# # 第二階段：將靜態資源部署到 Nginx 上
FROM nginx
# # 複製 nginx.conf 到容器中的 /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf
# # 複製生成的靜態資源到 Nginx 的 HTML 目錄
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

```

::callout{color="warning" icon="lucide:lightbulb"}
  最好是在有 autoformat 的環境撰寫，不然容易多空白之類的...（被雷過🤪
::

### Docker Daemon | Docker Client

Docker Daemon:（ dockerd ）是 Docker 的核心元件，在背景執行並管理所有 Docker 對象，例如映像、容器、網路和磁碟區。監聽 Docker API 請求並執行它們。
可以使用 JSON 或命令列來設定

Docker Client:（ docker ）是者與 Docker 互動的主要方式。執行docker run 之類的指令時，將這些指令傳送到 Docker Daemon 進程中執行～

![Docker](/images/docker/docker.webp)

## 常用指令

```bash [bash] icon=lucide:code

docker run --name <container_name> <image_name>

# -d 背景執行 container

docker run -d <image_name>

docker ps -a # 印出所有 container

docker logs -f <container_name> #針對某一容器印出內部訊息，常常因為後端改 code 時需要印出～

docker build -t <image_name> . #使用當前目錄下的 Dockerfile 建立 image

docker info

# docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

# -p 印射出 container 內部的 port 80 到 host 的 8080 port

docker run --name my-nginx -p 8080:80 -d nginx

# -f -f or --force 強制刪除無需確認

docker system prune # 將刪除所有未使用的數據，包括已停止的容器、未使用的網路、懸空映像以及可選的磁碟區。

```

## Network | Volume

Network: 允許容器相互通訊以及與外部服務通訊。每個容器都分配有自己的網路命名空間，為網路操作提供隔離的環境。

- host:共享主機的網路堆疊，允許容器直接存取主機的網絡，無需隔離。
- bridge:預設網路驅動程式。它創建了一個隔離的網絡，供容器之間相互通信，同時與外部網路隔離。
- overlay:允許跨多個 Docker 主機的容器進行通信

```bash
docker network create -d bridge my-network

```

Volume: 用於持久性資料儲存。與容器檔案系統不同，容器檔案系統是短暫的，並且在容器被刪除時可能會遺失，Volume 提供了一種在容器生命週期之外儲存資料的方法。

```bash
# -v <volume_name>:<container_path> ：此指令將磁碟區或主機目錄安裝到容器內的指定路徑中。
docker run -d -v my-volume:/data my-image
```

::callout{color="warning" icon="lucide:lightbulb"}
即使容器停止或刪除，磁碟區也允許資料保留。它們對於需要資料儲存的應用程式（例如資料庫）至關重要。
::

::collapsible{variant="card" title="Docker Commands Cheat Sheet"}

```bash

# Docker Commands Cheat Sheet

This cheat sheet provides a comprehensive list of Docker commands along with their commonly used options and shortcuts.

## Docker CLI Commands

### General Commands

- `docker --version`
  - Show the Docker version information.

- `docker info`
  - Display system-wide information.

### Docker Images

- `docker images`
  - List all images on your local system.

- `docker pull <image_name>`
  - Pull an image from a registry (e.g., Docker Hub).

- `docker build -t <image_name> .`
  - Build an image from a Dockerfile in the current directory.
  - `-t` or `--tag` : Name and optionally a tag in the `name:tag` format.

- `docker rmi <image_name>`
  - Remove one or more images.
  - `-f` or `--force` : Force removal of the image.

### Docker Containers

- `docker ps`
  - List running containers.
  - `-a` or `--all` : Show all containers (both running and stopped).

- `docker run -it <image_name>`
  - Run a command in a new container.
  - `-i` or `--interactive` : Keep STDIN open even if not attached.
  - `-t` or `--tty` : Allocate a pseudo-TTY.
  - `-d` or `--detach` : Run container in background and print container ID.
  - `-p` or `--publish` : Publish a container's port(s) to the host.
  - `-v` or `--volume` : Bind mount a volume.

- `docker exec -it <container_name> <command>`
  - Run a command in a running container.

- `docker stop <container_name>`
  - Stop a running container.

- `docker start <container_name>`
  - Start a stopped container.

- `docker restart <container_name>`
  - Restart a running container.

- `docker rm <container_name>`
  - Remove one or more containers.
  - `-f` or `--force` : Force the removal of a running container.

### Docker Volumes

- `docker volume ls`
  - List all volumes.

- `docker volume create <volume_name>`
  - Create a new volume.

- `docker volume rm <volume_name>`
  - Remove one or more volumes.

- `docker run -v <volume_name>:<container_path> <image_name>`
  - Create a container with a volume attached.
  - `-v` or `--volume` : Bind mount a volume.

### Docker Networks

- `docker network ls`
  - List all networks.

- `docker network create <network_name>`
  - Create a new network.

- `docker network rm <network_name>`
  - Remove one or more networks.

- `docker network inspect <network_name>`
  - Display detailed information on one or more networks.

- `docker run --network <network_name> <image_name>`
  - Run a container attached to a specific network.

### Docker Compose

- `docker-compose up`
  - Build, (re)create, start, and attach to containers for a service.
  - `-d` or `--detach` : Run containers in the background.

- `docker-compose down`
  - Stop and remove containers, networks, images, and volumes.

- `docker-compose build`
  - Build or rebuild services.

- `docker-compose ps`
  - List containers.

- `docker-compose logs`
  - View output from containers.

## Docker Shortcuts and Options

- `-d` : Run container in detached mode (background).
- `-p` : Map host ports to container ports.
- `-v` : Mount a host directory or volume into the container.
- `-i` : Keep STDIN open even if not attached.
- `-t` : Allocate a pseudo-TTY (terminal).
- `--rm` : Automatically remove the container when it exits.
- `--name` : Assign a name to the container.
- `--network` : Connect a container to a specific network.
- `--env` or `-e` : Set environment variables.

## Common Docker Files

### Dockerfile

- `FROM <base_image>` : Set the base image for subsequent instructions.
- `COPY <source> <destination>` : Copy files from the host to the image.
- `RUN <command>` : Run a command during image build.
- `CMD <command>` : Specify the default command to run when the container starts.
- `EXPOSE <port>` : Expose a port to the host.

### docker-compose.yml

- `version: '3'` : Specify the Docker Compose file version.
- `services:` : Define services (containers) to run.
- `volumes:` : Define and mount volumes.
- `networks:` : Define and connect to networks.

---

```

::

## Docker Compose

是一個讓你可以定義多個 container 執行的設定文件，以 yaml 格式撰寫 `docker-compose.yml`,
以下是 gpt-4o 提供的範例，基本上跟公司的長的 7788 像。通常我們可以加些綴詞來區分不同環境如

- docker-compose.local.yml
- docker-compose.sta.yml
- docker-compose.prod.yml
  ...etc

```yaml [docker-compose.yml] icon=lucide:code-xml
version: '3'
services:
  web:
    image: my-web-app:latest
    build: .
    ports:
      - '8080:8080'
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/mydatabase
    depends_on:
      - db

  db:
    image: postgres:latest
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydatabase

volumes:
  db-data:
```

## Docker Desktop | Orbstack | Portainer

Docker Desktop 是操作 docker 的 GUI 介面，可以方便你觀察容器使用情況...etc

OrbStack 是 Docker Desktop 的輕量級且高效的替代方案，用於在 macOS 上運行容器和 Linux 虛擬機器。解決了 Docker Desktop 的一些限制，例如資源密集性和複雜的設定。
使用更少的記憶體和 CPU 資源，但目前只在 macOS 上運行。

Portainer.io:是一個輕量級管理 UI，可輕鬆管理 Docker 環境，包括容器、映像、網頁和磁碟區。它提供了一個簡單直覺的基於 Web 的介面來管理 Docker 資源，使初學者和經驗豐富的使用者都可以更輕鬆地操作和監控其 Docker 環境。

## 參考文獻

:read-more{title="Orbstack" to="https://docs.orbstack.dev/"}
:read-more{title="portainer" to="https://www.portainer.io/"}
:read-more{title="Docker" to="https://www.docker.com/"}
