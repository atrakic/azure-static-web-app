const { app } = require("@azure/functions");
const { container } = require("./shared/context");

app.http("productsPost", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (request, context) => {
    const item = await request.json();
    if (!item || typeof item !== "object") {
      return {
        status: 400,
        body: { error: "Invalid item data" },
      };
    }
    try {
      const { resource: created } = await container.items.create(item);
      context.log(`Item created with id: ${created.id}`);
      return {
        status: 201,
        body: created,
      };
    } catch (error) {
      context.log("ERROR: Failed to add product:", error);
      return {
        status: 500,
        body: { error: "Failed to add product", details: error.message },
      };
    }
  },
});
