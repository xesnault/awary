echo "Port: $DOCKER_SERVER_PORT"
./in-docker "npm install && npm run build && npx serve -s build -p $DOCKER_SERVER_PORT" -d
