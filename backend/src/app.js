import express from "express";
import bcrypt from "bcrypt";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import AppDataSource from "./config/data-source.js";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("E-commerce Backend - Assignment 2");
});

const setupRoutes = (userRepository) => {
  
  // POST /users → Register a new user (Assignment Requirement)
  app.post("/users", async (req, res, next) => {
    try {
      const { name, email, age, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email and password are required"
        });
      }

      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = userRepository.create({
        name,
        email,
        age,
        password: hashedPassword,
        role: "user"
      });

      const savedUser = await userRepository.save(newUser);

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          age: savedUser.age,
          role: savedUser.role
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.use(errorMiddleware);
};

export { setupRoutes };
export default app;