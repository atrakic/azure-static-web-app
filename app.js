const { CosmosClient } = require("@azure/cosmos");
const readline = require("readline-sync");

const endpoint = process.env.COSMOS_DB_ENDPOINT || "https://localhost:8081/";
const key =
  process.env.COSMOS_KEY ||
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

const client = new CosmosClient({ endpoint, key });

const databaseId = process.env.COSMOS_DATABASE || "Foo";
const containerId = process.env.COSMOS_CONTAINER || "FooContainer";

async function createItem(item) {
  const { resource: createdItem } = await client
    .database(databaseId)
    .container(containerId)
    .items.create(item);
  console.log(`Item created: ${JSON.stringify(createdItem)}`);
}

async function readItems() {
  const { resources: items } = await client
    .database(databaseId)
    .container(containerId)
    .items.readAll()
    .fetchAll();
  console.log("Items:", items);
}

async function updateItem(id, updatedItem) {
  const { resource: item } = await client
    .database(databaseId)
    .container(containerId)
    .item(id)
    .replace(updatedItem);
  console.log(`Item updated: ${JSON.stringify(item)}`);
}

async function deleteItem(id) {
  await client.database(databaseId).container(containerId).item(id).delete();
  console.log(`Item with id ${id} deleted.`);
}

async function setup() {
  const { statusCode, database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(
    `Database "${database.id}" checked/created. Status code: ${statusCode}`,
  );

  const { statusCode: containerStatusCode, container } =
    await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: ["/id", "/key2"], kind: "MultiHash" },
    });

  console.log(
    `Container "${container.id}" checked/created. Status code: ${containerStatusCode}`,
  );
}

async function ingestData(initialize, end) {
  
  const { container } = await client
    .database(databaseId)
    .container(containerId);
    
  for (let i = initialize; i < end; i++) {
  
    // add items
    await container.items.upsert({ id: `sample${i}`, key1: 0, key2: "0" });

    /**
    await container.items.create({ name: `sample${i}`, key1: 0, key2: "0" });
    await container.items.create({ name: `sample${i}`, key1: 0, key2: "1" });
    await container.items.create({ name: `sample${i}`, key1: 1, key2: "0" });
    await container.items.create({ name: `sample${i}`, key1: 1, key2: "1" });
    */
  }

  console.log(`ingested items: ${initialize} to ${end}`);
}

async function main() {
  await setup();
  await ingestData(0, 10);

  while (true) {
    console.log("\nChoose an action:");
    console.log("1. Create Item");
    console.log("2. Read Items");
    console.log("3. Update Item");
    console.log("4. Delete Item");
    console.log("5. Exit");

    const choice = readline.question("Enter your choice: ");

    switch (choice) {
      case "1":
        const newItem = JSON.parse(readline.question("Enter item JSON: "));
        await createItem(newItem);
        break;
      case "2":
        await readItems();
        break;
      case "3":
        const idToUpdate = readline.question("Enter item ID to update: ");
        const updatedItem = JSON.parse(
          readline.question("Enter updated item JSON: "),
        );
        await updateItem(idToUpdate, updatedItem);
        break;
      case "4":
        const idToDelete = readline.question("Enter item ID to delete: ");
        await deleteItem(idToDelete);
        break;
      case "5":
        console.log("Exiting...");
        return;
      default:
        console.log("Invalid choice. Please try again.");
    }
  }
}

main().catch((err) => {
  console.error(err);
});
