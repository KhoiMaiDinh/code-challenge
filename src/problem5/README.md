# Running the Application with Docker Compose

This guide will help you get the application up and running using Docker Compose.

## Prerequisites

- Docker installed on your machine

## Steps to Run

1. Navigate to the project root directory where the `docker-compose.yml` file is located:

   ```bash
   cd path/to/project
   ```

2. Build and start the containers using Docker Compose:

   ```bash
   docker-compose up --build
   ```

   - Use `-d` flag to run in detached mode:
     ```bash
     docker-compose up -d --build
     ```

3. Run Database Migrations
   - Before seeding data, ensure the database schema and indexes are created.

     ```bash
     docker-compose exec problem5-api npm run migrate:up
     ```

   - To rollback the last migration:

     ```bash
     docker-compose exec problem5-api npm run migrate:down
     ```

   - To check the migration status:

     ```bash
     docker-compose exec problem5-api npm run migrate:status
     ```

   - To create a new migration:

     ```bash
     docker-compose exec problem5-api npm run migrate:create -- <migration-name>
     ```

4. Seed the Database

   Once the migrations are applied, seed the database with initial data:

   ```bash
   npm run seed
   ```

5. Run Tests

   To run the test suite:

   ```bash
   docker-compose exec problem5-api npm test
   ```

   - Run tests in watch mode:

     ```bash
     docker-compose exec problem5-api npm run test:watch
     ```

   - Run tests with coverage:
     ```bash
     docker-compose exec problem5-api npm run test:coverage
     ```

6. The application should now be running and accessible at:
   Backend API: `http://localhost:3000`

## Additional Commands

- Stop the containers:

  ```bash
  docker-compose down
  ```

- View container logs:

  ```bash
  docker-compose logs
  ```

  - Follow logs in real-time:
    ```bash
    docker-compose logs -f
    ```

- Rebuild specific service:
  ```bash
  docker-compose up --build <service-name>
  ```

## Troubleshooting

If you encounter any issues:

1. Ensure all ports required by the application are available
2. Try removing all containers and volumes:
   ```bash
   docker-compose down -v
   ```
3. Rebuild the containers:
   ```bash
   docker-compose up --build
   ```

For more detailed logs and debugging, use:
