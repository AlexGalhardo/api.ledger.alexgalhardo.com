#!/bin/bash
cp .env.example .env
bun install
docker-compose down
docker-compose up -d --remove-orphans
bun run dev
