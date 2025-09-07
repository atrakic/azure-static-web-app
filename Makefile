MAKEFLAGS += --silent

emulator := cosmosdb-emulator

all: start

start:
	echo "Starting up, use <Ctrl+C> to quit"
	npm install
	npm run $@ --if-present

test dev bootstrap format:
	npm run $@ --if-present

login build deploy:
	swa $@

infra:
	read -p "deploying azure infra, press any key to continue " _
	make -f ./infra/Makefile

# https://learn.microsoft.com/en-us/azure/cosmos-db/emulator
# https://github.com/Azure/azure-cosmos-db-emulator-docker/issues/217
emulator:
	DOCKER_DEFAULT_PLATFORM=linux/amd64 docker run --rm \
    --publish 8081:8081 \
    --publish 1234:1234 \
    --name ${emulator} \
    --detach \
    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview --protocol https
	echo "http://localhost:1234/"

clean:
	npm cache clean --force
	docker stop ${emulator}
	docker rm -f ${emulator}

.PHONY: all azure-infra azure-deploy linux-emulator test format clean
