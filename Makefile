MAKEFLAGS += --silent

all: start

start:
	echo "Starting up, use <Ctrl+C> to quit"
	npm install
	npm run $@ --if-present

test format:
	npm run $@ --if-present

login build deploy:
	swa $@

azure-infra:
	read -p "deploying azure infra, press any key to continue " _
	make -f ./infra/Makefile

# https://learn.microsoft.com/en-us/azure/cosmos-db/emulator
# https://github.com/Azure/azure-cosmos-db-emulator-docker/issues/217
linux-emulator:
	DOCKER_DEFAULT_PLATFORM=linux/amd64 docker run \
    --publish 8081:8081 \
    --publish 1234:1234 \
    --name linux-emulator \
    --detach \
    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview --protocol https
	echo "http://localhost:1234/"

clean:
	npm cache clean --force
	docker stop linux-emulator
	docker rm -f linux-emulator

.PHONY: all azure-infra azure-deploy linux-emulator test format clean
