const config = require("./config");
const CosmosClient = require("@azure/cosmos").CosmosClient;

const client = new CosmosClient({
  endpoint: config.endpoint,
  key: config.key,
});

const container = client
  .database(config.databaseId)
  .container(config.containerId);

async function setup(client, databaseId, containerId) {
  const { statusCode, database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(
    `Database "${database.id}" checked/created. Status code: ${statusCode}`,
  );

  const partitionKey = config.partitionKey;
  const { statusCode: containerStatusCode, container } =
    await database.containers.createIfNotExists({
      id: containerId,
      partitionKey,
      // partitionKey: { paths: ["/id", "/key2"], kind: "MultiHash" },
    });
  console.log(
    `Container "${container.id}" checked/created. Status code: ${containerStatusCode}`,
  );
}

async function getItems(context) {
  const { resources: itemArray } = await container.items.readAll().fetchAll();
  context.log(itemArray);
}

module.exports = { client, container, getItems, setup };
