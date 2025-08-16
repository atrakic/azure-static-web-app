# Jupyter Notebook for Azure Static Web App

This notebook is designed to help you seed and explore data in Azure Cosmos DB for the Static Web App project. It provides step-by-step instructions for:

- Authenticating to Azure
- Creating Cosmos DB resources (account, database, containers)
- Configuring Spark and Cosmos DB integration
- Ingesting sample product data
- Querying and visualizing data

## Setup

You can run the notebook in two ways:

1. **Using Docker Compose** (recommended for reproducibility):
	```sh
	cd notebook
	docker compose up
	# Access Jupyter Lab at http://localhost:8888 (token: foo)
	```

2. **Locally with Jupyter Lab**:
	```sh
	python3 -m pip install jupyterlab
	cd notebook
	jupyter lab
	```

## Usage

1. Open `cosmicsworks.ipynb` in Jupyter Lab.
2. Follow the cells in order:
	- Authenticate to Azure
	- Create Cosmos DB account, database, and containers
	- Configure Spark connection
	- Seed sample product data
	- Run queries and visualize results

## Integration with Static Web App

- The seeded Cosmos DB data is used by the API in `src/functions/products.js`.
- You can use the notebook to validate, update, or explore product data for your app.
- The infrastructure (Cosmos DB, etc.) should be provisioned before running the notebook (see main project README for deployment steps).

## Tips

- You can modify the sample data in the notebook to fit your needs.
- Use the notebook for troubleshooting, data validation, and learning Cosmos DB integration with Spark.

---

For more details, see the main project README and comments in the notebook itself.
