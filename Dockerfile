# 第一階段：構建 Vue.js 靜態資源
FROM node:20 AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# 清理可能存在的 pnpm 缓存
RUN pnpm store prune

# 先複製 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Use pnpm instead of yarn
RUN pnpm install

# 再複製其他文件
COPY . .

# 增加 Node.js 記憶體限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm run docs:build

# 第二階段：將靜態資源部署到 Nginx 上
FROM nginx

# 複製 nginx.conf 到容器中的 /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf

# 複製生成的靜態資源到 Nginx 的 HTML 目錄
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
