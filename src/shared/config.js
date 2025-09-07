const config = {
  endpoint: process.env.COSMOS_DB_ENDPOINT || "https://localhost:8081",
  key:
    process.env.COSMOS_KEY ||
    "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
  databaseId: "cosmicworks",
  containerId: "products",
  partitionKey: { kind: "Hash", paths: ["/id"] },
};

module.exports = config;
