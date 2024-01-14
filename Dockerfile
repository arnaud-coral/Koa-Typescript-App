
# Stage 1: Build
FROM node:20.11.0-alpine3.19 as builder
ARG APP_PORT=3000
ENV PORT=$APP_PORT
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:20.11.0-alpine3.19
ENV PORT=$APP_PORT
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE $PORT
CMD ["npm", "start"]
