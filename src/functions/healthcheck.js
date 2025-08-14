const { app } = require('@azure/functions');

app.http('healthcheck', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const currentTime = new Date().toISOString();
        return { body: JSON.stringify({ "text": currentTime }) };
    }
});
