const { app } = require("@azure/functions");

app.http("message", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const name = request.query.name || (request.body && request.body.name);
    const currentTime = new Date().toISOString();
    return {
      jsonBody: {
        text: `Hello, ${name || "World"}!`,
        status: "healthy",
        time: currentTime,
        env: process.env,
      },
    };
  },
});
