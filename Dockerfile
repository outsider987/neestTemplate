# docker image : mccdev/backend-corporate-plan-admin-portal
# Command to build Docker Image : docker build --platform=linux/amd64 -t mccdannyli/backend-corporate-plan-admin-portal:latest .
# Command to build Docker Image : docker build --platform=linux/arm64 -t mccdannyli/backend-corporate-plan-admin-portal:arm64 .
FROM node:18.8-alpine
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

CMD ["node", "dist/main"]
