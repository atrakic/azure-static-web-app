const { app } = require("@azure/functions");
const { container } = require("../shared/context");

app.http("productsGet", {
  methods: ["GET"],
  route: "products",
  authLevel: "function",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
      const querySpec = {
        query: "SELECT * FROM products p ", // WHERE p.category = @category",
        //parameters: [{ name: "@category", value: "gear-surf-surfboards" }],
      };
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
      return {
        body: JSON.stringify(items),
        headers: { "Content-Type": "application/json" },
      };
    } catch (error) {
      context.log("ERROR: Error retrieving items from Cosmos DB:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: "Failed to retrieve items" }),
      };
    }
  },
});
