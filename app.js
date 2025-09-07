const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./src/shared/config");
const dbContext = require("./src/shared/context");

const newItem = {
  id: 'aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb',
  category: 'gear-surf-surfboards',
  name: 'Sunnox Surfboard',
  quantity: 81,
  price: 299.99,
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
      console.log(`${item.id} - ${item.category}`);
    });
    // </QueryItems>

  } catch (err) {
    console.log(err.message);
  }
}

main();
