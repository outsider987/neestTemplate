## Description

Corporate Plan Member Admin Portal built on NestJS Framework

## Requirements

```bash
node 18+
package manager: npm or yarn
```

## Running the App

```bash
# 1. Install packages
yarn install / npm install

# 2. add .env file. (Copy from .env.example)
cp .env.example .env

# 3. Start Docker
docker-compose up
```

## Docker-Compose and Tests

```bash
# Stop Docker
docker-compose down

# Run Unit Tests (can add --watch flag)
yarn run test / npm run test

# Run Integration Tests
docker exec -it main sh
yarn run test:e2e:watch / npm run test:e2e:watch

```

## Migrations

```bash
# Go into Docker Container to run migration related commands
docker exec -it nest-js-main sh

# Generate migration files based on entities
npm run migration:generate {path to entity}/{entity name}

# Run Migration
npm run migration:run

# Revert Migration
npm run migration:revert
```
