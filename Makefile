MAKEFLAGS += --silent

all: dev

dev:
	echo "Starting up, use <Ctrl+C> to quit"
	npm run start

azure-infra:
	read -p "deploying azure infra, press any key to continue " _
	make -f ./infra/Makefile

azure-deploy:
	#STATIC_WEB_APP_NAME=
	#APPLICATION_NAME=$$(az staticwebapp show --name $$STATIC_WEB_APP_NAME)
	#echo $$APPLICATION_NAME
	# export SWA_CLI_DEPLOYMENT_TOKEN=$$(az staticwebapp secrets list --name $$APPLICATION_NAME --query "properties.apiKey")
	swa deploy

# https://learn.microsoft.com/en-us/azure/cosmos-db/emulator
# https://github.com/Azure/azure-cosmos-db-emulator-docker/issues/217
linux-emulator:
	echo "http://localhost:1234/"
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

.PHONY: all azure-infra azure-deploy linux-emulator test clean
