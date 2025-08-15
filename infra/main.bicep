param location string = resourceGroup().location
param staticWebAppName string = 'my-static-web-app'
param cosmosDbAccountName string = 'my-cosmos-db-account'

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
    name: staticWebAppName
    location: location
    sku: {
        name: 'Standard'
        tier: 'Standard'
    }
    properties: {
        repositoryUrl: ''
        branch: ''
        buildProperties: {
            apiLocation: 'api'
            appLocation: 'app'
            outputLocation: 'build'
        }
    }
}


resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-03-15' = {
    name: cosmosDbAccountName
    location: location
    kind: 'GlobalDocumentDB'
    properties: {
        databaseAccountOfferType: 'Standard'
        locations: [
            {
                locationName: location
                failoverPriority: 0
                isZoneRedundant: false
            }
        ]
        consistencyPolicy: {
            defaultConsistencyLevel: 'Session'
        }
        enableFreeTier: true
    }
}


resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
    name: '${staticWebAppName}/appsettings'
    properties: {
        properties: {
            COSMOS_DB_ENDPOINT: cosmosDbAccount.properties.documentEndpoint
            COSMOS_DB_ACCOUNT_NAME: cosmosDbAccountName
            // Add other settings as needed
        }
    }
    dependsOn: [
        staticWebApp
        cosmosDbAccount
    ]
}

output staticWebAppEndpoint string = staticWebApp.properties.defaultHostname
output cosmosDbEndpoint string = cosmosDbAccount.properties.documentEndpoint
