const { app } = require('@azure/functions');
const { DefaultAzureCredential } = require('@azure/identity');
const { CosmosClient } = require('@azure/cosmos');

app.http('products', {
    methods: ['GET'],
    authLevel: 'function',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const endpoint = process.env.COSMOS_DB_ENDPOINT;
            if (!endpoint) {
                context.error('ERROR:', 'COSMOS_DB_ENDPOINT environment variable is not set');
                return {
                    status: 500,
                    body: JSON.stringify({ error: 'COSMOS_DB_ENDPOINT is not configured' })
                };
            }

            const client = new CosmosClient({
                endpoint,
                aadCredentials: new DefaultAzureCredential(),
                connectionPolicy: {
                    requestTimeout: 10000,
                },
            });

            const database = client.database('cosmosCatalog.cosmicworks');
            if (!database) {
                context.error('ERROR:', 'Database not found');
                return {
                    status: 404,
                    body: JSON.stringify({ error: 'Database not found' })
                };
            }

            context.log('Connected to Cosmos DB successfully');
            const container = database.container('cosmosCatalog.cosmicworks.products');
            const querySpec = {
                query: 'SELECT * FROM products p WHERE p.category = @category',
                parameters: [{
                    name: '@category',
                    value: 'gear-surf-surfboards'
                }
                ]
            };

            const { resources: items } = await container.items.query(querySpec).fetchAll();
            return {
                body: JSON.stringify(items),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } catch (error) {
            context.log('ERROR:', 'Error retrieving items from Cosmos DB:', error);
            return {
                status: 500,
                body: JSON.stringify({ error: 'Failed to retrieve items' })
            };
        }
    }
});
