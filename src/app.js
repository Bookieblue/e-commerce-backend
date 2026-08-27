import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from 'cors';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NotFound } from "./middlewares/notFound.js";
import healthRouter from "./routes/health.route.js"
import authRoute from "./routes/auth.route.js"
import usersRoute from "./routes/users.route.js"

const app = express();

app.use(helmet())
app.use(compression())
app.use(cors())

app.use(express.json())

app.use("/api/health", healthRouter);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute)

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(NotFound);

export default app