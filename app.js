const CosmosClient = require("@azure/cosmos").CosmosClient;
const { randomUUID } = require('crypto');
const config = require("./src/shared/config");
const dbContext = require("./src/shared/context");

const newItem = {
  id: randomUUID(),
  category: 'demo',
  name: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
  quantity: Math.floor(Math.random() * 100) + 1,
  price: (Math.random() * (19.99 - 10.05) + 10.5).toFixed(2),
  startTime: new Date(),
  expiryTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  sale: true
};

async function main() {

  const cosmosClient = dbContext.client;

  try {
    // <Setup>
    await dbContext.setup(cosmosClient, config.databaseId, config.containerId);
    // </Setup>

    // <CreateItem>
    const { container } = dbContext;
    await container.items.upsert(newItem)
    // </CreateItem>

    // <QueryItems>
    console.log(`Querying container: ${container.id}`);

    // query to return all items
    const querySpec = {
      query: "SELECT * from c"
    };
    
    // read all items in the Items container
    const { resources: items } = await container.items
     .query(querySpec)
     .fetchAll();

    items.forEach(item => {
      console.log(`${item.id} - ${item.price}`);
    });
    // </QueryItems>

  } catch (err) {
    console.log(err.message);
  }
}

main();
