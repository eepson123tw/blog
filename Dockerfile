# 第一階段：構建 Vue.js 靜態資源
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
