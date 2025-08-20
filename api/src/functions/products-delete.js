const { app } = require("@azure/functions");
const { container } = require("../shared/context");

app.http("productsDelete", {
  route: "products/{id}",
  methods: ["DELETE"],
  authLevel: "function",
  handler: async (request, context) => {
    // Parse item id from query string or route
    const itemId =
      request.query.get("id") || (request.params && request.params.id);
    if (!itemId) {
      return {
        status: 400,
        body: { error: "Missing item id in query." },
      };
    }

    try {
      // Delete item from Cosmos DB
      const { resource: deleted } = await container
        .item(itemId, itemId)
        .delete();
      if (!deleted) {
        return {
          status: 404,
          body: { error: "Item not found." },
        };
      }
      return {
        status: 200,
        body: { message: "Item deleted successfully." },
      };
    } catch (error) {
      context.log("ERROR: Failed to delete item:", error);
      return {
        status: 500,
        body: { error: "Failed to delete item.", details: error.message },
      };
    }
  },
});
