const { app } = require('@azure/functions');
const { DefaultAzureCredential } = require('@azure/identity');
const { CosmosClient } = require('@azure/cosmos');

app.http('products', {
    methods: ['GET'],
    authLevel: 'function',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const endpoint = process.env.COSMOS_DB_ENDPOINT;
        if (!endpoint) {
            context.log('ERROR: COSMOS_DB_ENDPOINT environment variable is not set');
            return {
                status: 500,
                body: JSON.stringify({ error: 'COSMOS_DB_ENDPOINT is not configured' })
            };
        }
        try {
            const client = new CosmosClient({
                endpoint,
                aadCredentials: new DefaultAzureCredential(),
                connectionPolicy: { requestTimeout: 10000 },
            });
            const container = client
                .database('cosmosCatalog.cosmicworks')
                .container('cosmosCatalog.cosmicworks.products');
            const querySpec = {
                query: 'SELECT * FROM products p WHERE p.category = @category',
                parameters: [{ name: '@category', value: 'gear-surf-surfboards' }]
            };
            const { resources: items } = await container.items.query(querySpec).fetchAll();
            return {
                body: JSON.stringify(items),
                headers: { 'Content-Type': 'application/json' }
            };
        } catch (error) {
            context.log('ERROR: Error retrieving items from Cosmos DB:', error);
            return {
                status: 500,
                body: JSON.stringify({ error: 'Failed to retrieve items' })
            };
        }
    }
});
