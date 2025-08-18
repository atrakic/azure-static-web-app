# Vanilla JavaScript App

[![CI](https://github.com/atrakic/azure-static-web-app/actions/workflows/ci.yml/badge.svg)](https://github.com/atrakic/azure-static-web-app/actions/workflows/ci.yml)

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build JavaScript apps in minutes. Use this repo with the [quickstart](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=vanilla-javascript) to build and customize a new static site.

This repo is used as a starter for a _very basic_ HTML web application using no front-end frameworks.

---

## Deployment Instructions

### 1. Provision Infrastructure (Azure)

The infrastructure is defined in `infra/main.bicep` and can be deployed using the provided Makefile:

```sh
cd infra
make all
# This will create a resource group, Cosmos DB account, database, container, and a Static Web App.
```

You can check deployment status and outputs:

```sh
make status
make outputs
```

To clean up resources:

```sh
make clean
```

### 2. Deploy the Application

Push your code to the repository connected to Azure Static Web Apps, or use Azure Portal to link your repo and trigger deployment. The Static Web App will be built and deployed automatically.

### 3. Seed the Database (Cosmos DB)

Use the Jupyter notebook in the `notebook/` folder to seed sample data into Cosmos DB:

1. Build and run the notebook container:
   ```sh
   cd notebook
   docker compose up
   # Or run Jupyter Lab locally
   python3 -m pip install jupyterlab
   jupyter lab
   ```
2. Open `cosmicsworks.ipynb` in Jupyter Lab.
3. Follow the notebook steps to:
   - Authenticate to Azure
   - Create Cosmos DB resources (if not already created)
   - Configure Spark/Cosmos connection
   - Create database and containers
   - Ingest sample product data
   - Query and validate data

---

## Notes

- The API [api/src/functions/products.js](api/src/functions/products.js) expects Cosmos DB endpoint and credentials to be set in environment variables (see Bicep outputs and Static Web App settings).
- The notebook can be used for both initial seeding and further data exploration.
- For more details, see the documentation in the [notebook/README.md](notebook/README.md).
