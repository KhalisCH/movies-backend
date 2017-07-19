FROM mhart/alpine-node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN yarn install
COPY . /usr/src/app
ENV PORT=8081
EXPOSE 8081
CMD [ "yarn", "start" ]
