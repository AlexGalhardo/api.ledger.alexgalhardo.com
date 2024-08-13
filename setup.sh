#!/bin/bash
cp .env.example .env
npm install
docker-compose down
docker-compose up -d --remove-orphans
npm run dev
