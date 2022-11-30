FROM node:alpine
ENV CI=true

WORKDIR /app

ARG NPM_TOKEN
COPY .npmrc .

RUN rm -f .npmrc
COPY . .

COPY package.json .
RUN npm install --only=prod

EXPOSE 3000
CMD ["npm", "start"]