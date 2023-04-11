FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

RUN  rm -rf node_modules && npm install && npm run docs:build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf 
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

ENV \
  PORT=8080 \
  HOST=0.0.0.0

EXPOSE 8080

# CMD [ "npm", "run", "dev" ]

CMD sh -c "envsubst '\$PORT' < /etc/nginx/nginx.conf  > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
