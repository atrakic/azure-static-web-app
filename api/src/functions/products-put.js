const { app } = require("@azure/functions");
const { container } = require("./shared/context");

app.http("productsPut", {
  methods: ["PUT"],
  route: "products",
  authLevel: "function",
  handler: async (request, context) => {
    const item = await request.json();
    if (!item || typeof item !== "object" || !item.id) {
      return {
        status: 400,
        body: { error: "Invalid product data or missing id" },
      };
    }
    try {
      const { resource: updated } = await container
        .item(item.id, item.id)
        .replace(item);
      context.log(`Product updated with id: ${updated.id}`);
      return {
        status: 200,
        body: updated,
      };
    } catch (error) {
      context.log("ERROR: Failed to update product:", error);
      return {
        status: 500,
        body: { error: "Failed to update product", details: error.message },
      };
    }
  },
});
