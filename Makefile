.PHONY: db server-dev server-prod web-app-dev test user-docs

UIDS:= USER_ID=$(shell id -u) GROUP_ID=$(shell id -g)
ENV_VARS:= set -a && . ./conf.env && ${UIDS} && set +a

# Database

db:
	cd server && mkdir -p db && ${ENV_VARS} && docker compose down && docker compose build --no-cache && docker compose up db -d

# Server

server-dev:
	cd server && npm run dev

server-prod:
	cd server && npm run start:prod

test:
	cd server && npm run test
	 


# Web app

web-app-dev:
	cd web-app && npm start

# User documentation

user-docs:
	cd user-docs && python -m mkdocs build
