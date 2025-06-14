# -----------
# Build for local testing
FROM node:20.11.1-slim as development

# Install procps for live reloading
RUN apt-get update -qq && \
    apt-get install -y openssl && \
    apt-get install -y procps

# Set a working directory
RUN mkdir /home/node/app
WORKDIR /home/node/app

# Install dependencies
COPY --chown=node:node package*.json ./
RUN yarn install

# Copy over the app source
COPY --chown=node:node . .
COPY ./tsconfig.json ./tsconfig.json

CMD [ "tail", "-f", "/dev/null" ]

# -----------
# Build static assets
FROM node:20.11.1-slim as builder

# Set environment variables
ENV NODE_ENV staging

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY ./tsconfig.json ./tsconfig.json

# Copy over the node modules from previous image in order to build statis assets
COPY --chown=node:node . .
COPY --chown=node:node --from=development /home/node/app/node_modules ./node_modules

# Create compiles assets
RUN yarn build

# Install dependencies in production ready mode
RUN yarn install
# -----------
# Build production ready image
FROM node:20.11.1-slim as production

RUN apt-get update -qq && \
    apt-get install -y openssl

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node --from=builder /home/node/app/dist ./dist
COPY --chown=node:node --from=builder /home/node/app/src ./src
COPY --chown=node:node --from=builder /home/node/app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/app/package.json ./