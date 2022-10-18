FROM node:16

WORKDIR /apict

COPY . .

RUN npm --force install --global yarn
RUN yarn install && yarn build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]

