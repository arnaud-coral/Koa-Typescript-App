
# 🌟 Koa TypeScript App 🌟

## Introduction 📚
This application is a robust, scalable solution built using TypeScript and Koa.js, designed for efficient server-side operations. Leveraging the power of TypeScript, it offers strong typing and modern JavaScript features, making your backend development smooth and error-free.

## Features 🚀
- **TypeScript Integration**: Strong typing and latest JavaScript features.
- **Docker Ready**: Easy deployment and scaling with Docker support.
- **Environment Configuration**: Customizable settings with `.env` files.
- **MongoDB Integration**: Utilizes MongoDB for efficient data storage and retrieval.
- **Code Quality Assurance**: ESLint and Prettier for consistent code style.

## App Structure and Middleware 🏗️
- **Main Application (`app.ts`)**: Integrates middlewares like `bodyParser`, `helmet`, `cors`, and `rateLimit`. Custom middlewares include `errorHandler` for error handling and `loggerMiddleware` for request logging.
- **Middleware**: Custom error handling (`errorHandler.ts`) and request logging (`logger.ts`).
- **Routes**: Includes a health check route (`healthCheckRoute.ts`).

## MongoDB Integration 🍃
The application includes MongoDB as its primary database, providing a reliable and scalable solution for data management. The integration is handled through Mongoose, a powerful ODM for MongoDB with TypeScript support.

### Setting Up MongoDB
- **Docker Configuration**: MongoDB is set up as part of the Docker environment. Check `docker-compose.yml` for the MongoDB service configuration.
- **Connection**: The database connection is managed in `src/database/mongoConnection.ts`, which establishes a connection to MongoDB at application startup.
- **Environment Variables**: Ensure the `MONGO_HOST`, `MONGO_PORT` and `MONGO_DB` environment variables are set correctly in your `.env` file for connecting to your MongoDB instance.


## Code Structure 🧱
- **Controllers**: Handle the request-response cycle.
- **Helpers**: Shared utility functions and logic.
- **Services**: Business logic, possibly including database and API interactions.
- **Config**: Configuration management.

## Running the App with `run.sh` 🚀

### Cluster Mode
The application supports running in cluster mode, utilizing all CPU cores for improved performance. This is handled in `src/index.ts`, where the app spawns multiple worker processes.
The `run.sh` script simplifies starting the application with proper environment settings. It loads environment variables from `.env`, ensures `NODE_ENV` is set, and starts the app using Docker. For local development, it uses `docker-compose.local.yml`, and for other environments, the standard `docker-compose.yml`.

## How to Use 🛠️
1. **Clone the Repository**: `git clone [repository-url]`
2. **Install Dependencies**: `npm install`
3. **Environment Setup**: Create a `.env` file based on `.env.example`.
4. **Run Locally**: Execute `./run.sh` after setting `NODE_ENV` to your desired environment.

## Technical Details 🔧
- **Framework**: Koa.js for the backend.
- **Language**: TypeScript for type safety and modern JavaScript features.
- **Database**: MongoDB with Mongoose for data modeling.
- **Docker Support**: Includes `Dockerfile` and `docker-compose` files for containerization.
- **Code Standards**: ESLint and Prettier configurations for code quality.

## License 📜
Built with ❤️ by Arnaud Coral © 2024. It's licensed under CC BY-NC-SA 4.0. Please refer to the license for permissions and restrictions.

Enjoy building amazing things! 🌈✨
