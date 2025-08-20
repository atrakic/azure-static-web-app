const cosmos = require("@azure/cosmos");
const endpoint = process.env.COSMOS_DB_ENDPOINT || "https://localhost:8081/";
const key =
  process.env.COSMOS_KEY ||
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
const { CosmosClient } = cosmos;

const client = new CosmosClient({
  endpoint,
  key,
  connectionPolicy: {
    requestTimeout: 10000,
  },
});
const container = client.database("cosmicworks").container("products");

async function getItems(context) {
  const { resources: itemArray } = await container.items.readAll().fetchAll();
  context.log(itemArray);
}

module.exports = { client, container, getItems };
