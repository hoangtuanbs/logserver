import { Log } from '..';
import { LogService } from '..';
import { describe, it, expect } from '@jest/globals';
import { AppDataSource } from "../../../dataSource/dataSource";


describe("LogService", () =>
{
    let logService: LogService;

    beforeAll(async () =>
    {
        await AppDataSource.initialize();
        logService = new LogService();
    });

    afterAll(async () =>
    {
        await AppDataSource.destroy();
    });

    beforeEach(async () =>
    {
        await AppDataSource.synchronize(true); // Reset database
    });

    describe("getLogs", () =>
    {
        it("should return a log", async () =>
        {
            // Insert test logs
            const log1 = { json: { message: "log1" }};

            await logService.save(log1);

            const [logs, count] = await logService.getLogs(1, 10, true);

            expect(count).toBe(1);
            expect(logs.length).toBe(1);
            expect(logs[0].json).toEqual({ message: "log1" }); // Newest first
        });

        it("should return paginated logs in ascending order", async () =>
        {
            const log1 = { json: { message: "log1" }, inserted_at: new Date("2023-01-01T10:00:00Z") };
            const log2 = { json: { message: "log2" }, inserted_at: new Date("2023-01-02T10:00:00Z") };
            await logService.save([log1, log2]);

            const [logs, count] = await logService.getLogs(1, 1, false);

            expect(count).toBe(2);
            expect(logs).toHaveLength(1);
            expect(logs[0].json).toEqual({ message: "log1" }); // Oldest first
        });

        it("should handle empty results", async () =>
        {
            const [logs, count] = await logService.getLogs(1, 10);

            expect(count).toBe(0);
            expect(logs).toHaveLength(0);
        });
    });

    describe("listByDateRange", () =>
    {
        it("should return logs within date range in descending order", async () =>
        {
            const log1 = { json: { message: "log1" }, inserted_at: new Date("2023-01-01T10:00:00Z") };
            const log2 = { json: { message: "log2" }, inserted_at: new Date("2023-01-02T10:00:00Z") };
            const log3 = { json: { message: "log3" }, inserted_at: new Date("2023-01-03T10:00:00Z") };
            await logService.save([log1, log2, log3]);

            const startDate = new Date("2023-01-01T00:00:00Z");
            const endDate = new Date("2023-01-02T23:59:59Z");
            const [logs, count] = await logService.listByDateRange(startDate, endDate, 10, 1, true);

            expect(count).toBe(2);
            expect(logs).toHaveLength(2);
            expect(logs[0].json).toEqual({ message: "log2" }); // Newest first
            expect(logs[1].json).toEqual({ message: "log1" });
        });

        it("should return logs within date range in ascending order", async () =>
        {
            const log1 = { json: { message: "log1" }, inserted_at: new Date("2023-01-01T10:00:00Z") };
            const log2 = { json: { message: "log2" }, inserted_at: new Date("2023-01-02T10:00:00Z") };
            await logService.save([log1, log2]);

            const startDate = new Date("2023-01-01T00:00:00Z");
            const endDate = new Date("2023-01-02T23:59:59Z");
            const [logs, count] = await logService.listByDateRange(startDate, endDate, 10, 1, false);

            expect(count).toBe(2);
            expect(logs).toHaveLength(2);
            expect(logs[0].json).toEqual({ message: "log1" }); // Oldest first
            expect(logs[1].json).toEqual({ message: "log2" });
        });

        it("should return empty array for no logs in date range", async () =>
        {
            const log1 = { json: { message: "log1" }, inserted_at: new Date("2023-01-01T10:00:00Z") };
            await logService.save([log1]);

            const startDate = new Date("2023-02-01T00:00:00Z");
            const endDate = new Date("2023-02-02T23:59:59Z");
            const [logs, count] = await logService.listByDateRange(startDate, endDate);

            expect(count).toBe(0);
            expect(logs).toHaveLength(0);
        });
    });
});