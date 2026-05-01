/**
 * Integration Test: POST /users
 *
 * Uses a real PostgreSQL database (test DB).
 * No mocking — every layer (HTTP → app → TypeORM → Postgres) is exercised.
 * Test data is cleaned up in afterAll.
 */

import request from "supertest";
import app, { setupRoutes } from "../../app.js";
import TestDataSource from "../../config/test-data-source.js";

let userRepository;
let createdUserId; // track the created user so we can clean it up

// ── Setup ────────────────────────────────────────────────────────────────────

beforeAll(async () => {
  // 1. Connect to the real test database
  await TestDataSource.initialize();

  // 2. Get a real repository (no mock)
  userRepository = TestDataSource.getRepository("User");

  // 3. Register routes with the real repository
  setupRoutes(userRepository);
});

// ── Cleanup ──────────────────────────────────────────────────────────────────

afterAll(async () => {
  // Delete the test user that was inserted during the test
  if (createdUserId) {
   await userRepository.delete({ id: createdUserId });
 }

  // Close the DB connection
  await TestDataSource.destroy();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("POST /users — Integration Test (real PostgreSQL)", () => {
  const testUser = {
    name: "John",
    email: `John_${Date.now()}@example.com`, // unique each run
    password: "SecurePass@123",
    age: 25,
  };

  it("should return 201 and the created user object", async () => {
    const response = await request(app).post("/users").send(testUser);

    // ── HTTP response assertions ────────────────────────────────────────────
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
    expect(response.body).toHaveProperty("user");

    const { user } = response.body;

    expect(user).toHaveProperty("id");
    expect(typeof user.id).toBe("number");

    expect(user.name).toBe(testUser.name);
    expect(user.email).toBe(testUser.email);
    expect(user.age).toBe(testUser.age);
    expect(user.role).toBe("user");

    // Password must never be returned in the response
    expect(user.password).toBeUndefined();

    // Store ID for cleanup
    createdUserId = user.id;
  });

  it("should actually persist the user in the database", async () => {
    // Direct DB query — proves the record was saved, not just returned in memory
    expect(createdUserId).toBeDefined();

    const dbUser = await userRepository.findOneBy({ id: createdUserId });

    expect(dbUser).not.toBeNull();
    expect(dbUser.name).toBe(testUser.name);
    expect(dbUser.email).toBe(testUser.email);
    expect(dbUser.age).toBe(testUser.age);
    expect(dbUser.role).toBe("user");

    // Password should be stored as a bcrypt hash (not plaintext)
    expect(dbUser.password).toBeDefined();
    expect(dbUser.password).not.toBe(testUser.password);
    expect(dbUser.password.startsWith("$2b$")).toBe(true); // bcrypt hash prefix
  });

  it("should return 400 when email already exists", async () => {
    // Attempt to register with the same email again
    const response = await request(app).post("/users").send(testUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already exists");
  });

  it("should return 400 when required fields are missing", async () => {
    const response = await request(app).post("/users").send({
      email: "missing_fields@example.com",
      // name and password intentionally omitted
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name, email and password are required");
  });
});
