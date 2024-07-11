FROM node:20-alpine AS builder

RUN adduser --disabled-password --gecos '' user

WORKDIR /home/user

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.21.0-alpine AS production

COPY --from=builder /home/user/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
