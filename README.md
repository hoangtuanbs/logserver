<!-- ABOUT THE PROJECT -->
## About The Project
A special server to maintain logs entries

### API Endpoints
* POST /api/logs - Insert log entry
- Example payload:
  ```json
  {
    "json": { "messages": "string" },
    "inserted_at": "Date"
  }
  ```
- Example response:
  ```json
  {
    "status":true,"message":"OK","data":[{"id":1,"inserted_at":"2025-04-26T05:55:30.923Z","json":{"message":"test 0"}}]
  }
  ```
* GET /api/logs - List all log entries
  The result is paged by pageSize = 10.
  Example response:
  ```json
  {
    "status":true,"message":"OK","data":[{"id":1,"inserted_at":"2025-04-26T05:55:30.923Z","json":{"message":"test 0"}},
    {"id":2,"inserted_at":"2025-04-26T05:55:30.931Z","json":{"message":"test 1"}},
    {"id":3,"inserted_at":"2025-04-26T05:55:30.941Z","json":{"message":"test 2"}},
    {"id":4,"inserted_at":"2025-04-26T05:55:30.948Z","json":{"message":"test 3"}},
    {"id":5,"inserted_at":"2025-04-26T05:55:30.956Z","json":{"message":"test 4"}},
    {"id":6,"inserted_at":"2025-04-26T05:55:30.963Z","json":{"message":"test 5"}},
    {"id":7,"inserted_at":"2025-04-26T05:55:30.971Z","json":{"message":"test 6"}},
    {"id":8,"inserted_at":"2025-04-26T05:55:30.979Z","json":{"message":"test 7"}},
    {"id":9,"inserted_at":"2025-04-26T05:55:30.986Z","json":{"message":"test 8"}},
    {"id":10,"inserted_at":"2025-04-26T05:55:30.994Z","json":{"message":"test 9"}}],
    "pagination":{"total":20,"page":1,"limit":10,"totalPages":2}
  }
  ```

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
* postgres database must be installed

### Run with docker compose

* Ensure Docker Compose is installed
* Ensure the .env file exists and contains the required variables (see .env example)
* Run the following command to start both the backend and PostgreSQL services:

  ```sh
  docker-compose up -d
  ```

To verify the application is running (by default the application is running on port 3000):

  ```sh
  curl -H 'Content-Type: application/json' http://localhost:3000/api/logs
  ```

### Testing ###

Run tests:
  ```sh
  npm test
  ```
