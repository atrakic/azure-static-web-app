all:
	@echo "Starting up, use <Ctrl+C> to quit"
	npm run start

# https://learn.microsoft.com/en-us/azure/cosmos-db/emulator
# https://github.com/Azure/azure-cosmos-db-emulator-docker/issues/217
linux-emulator:
	@echo "http://localhost:1234/"
	DOCKER_DEFAULT_PLATFORM=linux/amd64 docker run \
    --publish 8081:8081 \
    --publish 1234:1234 \
    --name linux-emulator \
    --detach \
    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview

test:
	npm run test --if-present

clean:
	docker stop linux-emulator
	docker rm -f linux-emulator
