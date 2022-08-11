FROM tejasvp25/alpine-node-minimal-docker:latest

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install