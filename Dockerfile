FROM node:hydrogen-alpine
WORKDIR /app
COPY package.json /app
RUN yarn install --frozen-lockfile
COPY . /app
RUN yarn tsc 
EXPOSE 3000
CMD ["node", "/app/dist/app.js"]