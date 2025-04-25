// src/tests/log.test.ts
import supertest from "supertest";
import { AppDataSource } from "../configs/dataSource";
import express from "express";
import logRoutes from "../src/api/Log/Log.router";

describe("Log API", () => {
    let app: express.Application;

    beforeAll(async () => {
        app = express();
        app.use(express.json());
        app.use("/api", logRoutes);

        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        await AppDataSource.synchronize(true); // Reset database
    });

    it("should insert a log entry", async () => {
        const response = await supertest(app)
            .post("/api/logs")
            .send({ json: { message: "test" } });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.json).toEqual({ message: "test" });
        expect(response.body.inserted_at).toBeDefined();
    });

    it("should return 400 for invalid JSON", async () => {
        const response = await supertest(app)
            .post("/api/logs")
            .send({ json: null });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Valid JSON object is required");
    });

    it("should list all log entries", async () => {
        // Insert a test log
        await supertest(app)
            .post("/api/logs")
            .send({ json: { message: "test" } });

        const response = await supertest(app)
            .get("/api/logs");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].json).toEqual({ message: "test" });
    });
});