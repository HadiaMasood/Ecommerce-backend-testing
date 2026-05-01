import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import User from "../entities/User.js";
import Product from "../entities/Product.js";
import UserProduct from "../entities/UserProduct.js";
import Result from "../entities/Result.js";

dotenv.config();

const TestDataSource = new DataSource({
  type: "postgres",
  host: process.env.TEST_DB_HOST || process.env.DB_HOST || "localhost",
  port: Number(process.env.TEST_DB_PORT || process.env.DB_PORT || 5432),
  username: process.env.TEST_DB_USERNAME || process.env.DB_USERNAME || "postgres",
  password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.TEST_DB_NAME || "web-engineering-db",

  synchronize: true, 
  dropSchema: false, 
  logging: false,

  entities: [User, Product, UserProduct, Result], // Added all entities to fix metadata error
});

export default TestDataSource;
