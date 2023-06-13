**This software is under development and not stable**
  
Awary allows you to register events and metrics.  

# Getting started with Awary

Awary is made of 2 parts: the server and the web app, both in typescript.  

## Quickstart

Awary use mongoDB to store the data, a docker file for quick DB setup is provided for simplicity but you can link to your own instance and not use docker if you want.

### Prerequisites

- Node.js & npm
- make
- (optional) docker & docker-compose

### Configuration

1. Copy the server config example `server/conf-example.env` to `server/conf.env`, then edit it to fill the required fields, everything should be documented inside the file itself.
2. Edit the web app config file `web-app/.env.production` and change the `REACT_APP_API_URL` to match the location of the server.

### Launch it

1. `make db` to launch MongoDB with docker (optional).
2. `make server-setup` to install the server dependencies (only the first time)
3. `make web-app-setup` to install the web app dependencies (only the first time)
4. `make server` to launch the server
5. `make web-app` to launch the web app

## Building the documentation

1. Install **make**, **python** and **pip** if you don't already have them.
2. Install mkdocs with `pip install mkdocs`.
3. Install mkdocs material theme with `pip install mkdocs-material`.
4. Build the docs with `make docs`.
