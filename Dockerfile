FROM node:20 AS base

FROM base as test

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm install -g @angular/cli@18.1.4

RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*  

ENV CHROME_BIN="/usr/bin/google-chrome"

COPY . .

RUN ng lint

RUN ng test --watch=false --browsers=ChromeHeadlessNoSandbox 


FROM base as build

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build --configuration=production

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/data-analysis/browser/ /usr/share/nginx/html/


