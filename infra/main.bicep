@description('The name of the project or application')
param projectName string = 'mywebapp'

@description('Azure region for all resources')
param location string = resourceGroup().location

param appNameSuffix string = uniqueString(resourceGroup().id)

@description('CosmosDB account name')
param cosmosAccountName string = 'cosmos-${projectName}-${appNameSuffix}'

@description('Static Web App name')
param staticWebAppName string = 'stapp-${projectName}-${appNameSuffix}'

@description('Application Insights name')
param appInsightsName string = 'appinsights-${projectName}-${appNameSuffix}'

@description('Name of the workspace where the data will be stored.')
param workspaceName string = 'myWorkspace-${projectName}-${appNameSuffix}'

@description('CosmosDB database name')
param cosmosDatabaseName string = 'mainDatabase'

@description('CosmosDB container name')
param cosmosContainerName string = 'mainContainer'

// Application Insights Resource
resource workspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: workspaceName
  location: location
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspace.id
  }
}

// CosmosDB Account
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmosAccountName
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
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
  }
}

// CosmosDB Database
resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosAccount
  name: cosmosDatabaseName
  properties: {
    resource: {
      id: cosmosDatabaseName
    }
  }
}

// CosmosDB Container
resource cosmosContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDatabase
  name: cosmosContainerName
  properties: {
    resource: {
      id: cosmosContainerName
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
      }
    }
  }
}

// Static Web App
resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: '' // Optional: Add your GitHub/Azure DevOps repo URL
    branch: '' // Optional: Specify branch for CI/CD
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true

    buildProperties: {
      apiLocation: 'api'
      appLocation: 'app'
      outputLocation: 'build'
    }
  }
}

resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
  name: '${staticWebAppName}/appsettings'
  properties: {
    APPLICATIONINSIGHTS_CONNECTION_STRING: appInsights.properties.InstrumentationKey
    COSMOS_DB_ENDPOINT: cosmosAccount.properties.documentEndpoint
    COSMOS_KEY: cosmosAccount.listKeys().primaryMasterKey
  }
  dependsOn: [
    staticWebApp
    cosmosDatabase
    appInsights
  ]
}

// Outputs for reference and connection
output resourceGroupName string = resourceGroup().name
output staticWebAppName string = staticWebAppName
output cosmosEndpoint string = cosmosAccount.properties.documentEndpoint
output cosmosKey string = cosmosAccount.listKeys().primaryMasterKey
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
