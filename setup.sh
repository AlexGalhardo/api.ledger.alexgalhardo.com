#!/bin/bash
cp .env.example .env
npm install
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
docker-compose down
docker-compose up -d --remove-orphans
npm run dev
