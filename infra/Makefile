SHELL := /bin/bash

rgName?=rg-swa-$(shell date +'%Y%m%d')
location?=westus2

.PHONY: all status outputs test clean

# https://learn.microsoft.com/en-us/azure/static-web-apps/publish-bicep
all:
	az account show || az login --use-device-code
	az group create --name $(rgName) --location $(location)
	az deployment group create \
		--resource-group $(rgName) \
		--template-file main.bicep

status:
	az resource list --resource-group $(rgName) --location $(location) --output table

outputs:
	az deployment group list --resource-group $(rgName) --query "[].properties.outputs"

clean:
	az group delete --name $(rgName)
