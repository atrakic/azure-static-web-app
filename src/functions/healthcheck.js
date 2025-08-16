const { app } = require('@azure/functions');

app.http('healthcheck', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const name = req.query.name || (req.body && req.body.name);
        const currentTime = new Date().toISOString();
        return { body: JSON.stringify({
            "message": `Hello, ${name || 'World'}!`,
            "status": "healthy",
            "time": currentTime
         }) };
    }
});
