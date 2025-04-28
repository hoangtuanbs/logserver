import supertest from "supertest";
import { AppDataSource } from "../dataSource/dataSource";
import app from '../server';

describe("Log API", () => {

    var server: any;

    beforeAll(async () =>
    {
        const port = 3000;
        await AppDataSource.initialize();

        app.set('port', port);
        server = app.listen(app.get('port'), () =>
        {
            console.info(`server is listening on ${port}`);
        });
    });

    /**
     * Reset database and clean resources after all tests
     */
    afterAll(async () =>
    {
        await AppDataSource.synchronize(true);
        server.close();
        await AppDataSource.destroy();
    });

    beforeEach(async () =>
    {
        await AppDataSource.synchronize(true); // Reset database
    });

    /**
     * Test for inserting a log entry
     * The test should send a POST request to the API with a valid JSON object.
     */
    it("should insert a log entry", async () =>
    {
        const response = await supertest(app)
            .post("/api/logs")
            .send({ json: { message: "test" } });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.json).toEqual({ message: "test" });
        expect(response.body.data.inserted_at).toBeDefined();
    });

    /**
     * Test for inserting a log entry with date
     * The test should send a POST request to the API with a valid JSON object.
     */
    it("should insert a log entry with date", async () =>
        {
            const testdate = new Date("2023-01-01T10:00:00Z");
            const response = await supertest(app)
                .post("/api/logs")
                .send({ json: { message: "test" }, inserted_at: testdate });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data.json).toEqual({ message: "test" });
            expect(response.body.data.inserted_at).toBeDefined();
            expect(new Date(response.body.data.inserted_at).getTime()).toEqual(testdate.getTime());
        });

    it("should return 400 for invalid JSON", async () =>
    {
        const response = await supertest(app)
            .post("/api/logs")
            .send({ json: null });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Valid JSON object is required");
    });

    /**
     * Test for listing all log entries
     * The test should insert a log entry and then verify that the API returns the correct log entry.
     * The test should also verify that the API returns a 200 status code and the correct response format.
     * The test should check that the response includes the log entry's ID, JSON data, and timestamp.
     */
    it("should list all log entries", async () =>
    {
        // Insert a test log
        const maxLogs = 7;
        for (let i = 0; i < maxLogs; i++)
        {
            await supertest(app)
                .post("/api/logs")
                .send({ json: { message: "test " + i } });
        }

        const response = await supertest(app)
            .get("/api/logs");

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(maxLogs);

        let message = response.body.data[0];
        expect(message.json.message).toContain("test");
        expect(message.inserted_at).toBeDefined();
        expect(message.id).toBeDefined();
    });

    /**
     * Test for paginated log entries
     * When the number of log entries exceeds the page size, the API should return paginated results.
     * The default page size is 10, and the API should return the first page of results.
     * The response should include the total number of log entries, the current page, the page size, and the total number of pages.
     * The test should insert a number of log entries greater than the page size, and then verify that the API returns the correct pagination information.
     * The test should also verify that the API returns the correct number of log entries on the first page.
     */
    it("should list log entries paginatied", async () =>
    {
        // Insert a test log
        const maxLogs = 20;
        for (let i = 0; i < maxLogs; i++)
        {
            await supertest(app)
                .post("/api/logs")
                .send({ json: { message: "test " + i } });
        }

        const response = await supertest(app)
            .get("/api/logs");

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(10);
        expect(response.body.pagination).toBeDefined();
        expect(response.body.pagination.total).toEqual(maxLogs);
        expect(response.body.pagination.page).toEqual(1);
        expect(response.body.pagination.limit).toEqual(10);
        expect(response.body.pagination.totalPages).toEqual(Math.ceil(maxLogs / 10));
    });
});