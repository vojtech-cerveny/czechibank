import { describe, expect, it } from "vitest";

describe("Transactions API", () => {
  describe("GET /api/v1/transactions", () => {
    it("should return 401 when no Bearer token is provided", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions");
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.message).toBe("Unauthorized");
    });

    it("should return 401 when invalid Bearer token is provided", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.message).toBe("Unauthorized");
    });

    it("should return transactions with valid Bearer token", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions", {
        headers: {
          Authorization: "Bearer 33", // Vojta's account with 100 transactions
        },
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data.transactions)).toBe(true);
      expect(data.meta.pagination).toBeDefined();
    });

    describe("Pagination", () => {
      it("should return first page with default limit (10)", async () => {
        const response = await fetch("http://localhost:3000/api/v1/transactions", {
          headers: {
            Authorization: "Bearer 33",
          },
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data.transactions).toHaveLength(10);
        expect(data.meta.pagination).toEqual({
          page: 1,
          limit: 10,
          total: 102,
          totalPages: 11,
        });
      });

      it("should return second page with 10 items", async () => {
        const response = await fetch("http://localhost:3000/api/v1/transactions?page=2", {
          headers: {
            Authorization: "Bearer 33",
          },
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data.transactions).toHaveLength(10);
        expect(data.meta.pagination).toEqual({
          page: 2,
          limit: 10,
          total: 100,
          totalPages: 10,
        });
      });

      it("should return last page with remaining items", async () => {
        const response = await fetch("http://localhost:3000/api/v1/transactions?page=10", {
          headers: {
            Authorization: "Bearer 33",
          },
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data.transactions).toHaveLength(10);
        expect(data.meta.pagination).toEqual({
          page: 10,
          limit: 10,
          total: 100,
          totalPages: 10,
        });
      });

      it("should return 400 for invalid pagination parameters", async () => {
        const response = await fetch("http://localhost:3000/api/v1/transactions?page=0&limit=0", {
          headers: {
            Authorization: "Bearer 33",
          },
        });
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.success).toBe(false);
        expect(data.error.details[0].message).toBe("Page and limit must be positive numbers");
      });

      it("should return empty array for page beyond total pages", async () => {
        const response = await fetch("http://localhost:3000/api/v1/transactions?page=11", {
          headers: {
            Authorization: "Bearer 33",
          },
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data.transactions).toHaveLength(0);
        expect(data.meta.pagination).toEqual({
          page: 11,
          limit: 10,
          total: 100,
          totalPages: 10,
        });
      });
    });

    describe("Sorting", () => {
      it("should sort by createdAt in descending order by default", async () => {
        const response = await fetch("http://localhost:3000/api/v1/transactions", {
          headers: {
            Authorization: "Bearer 33",
          },
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        const transactions = data.data.transactions;
        expect(transactions[0].createdAt).toBeGreaterThan(transactions[transactions.length - 1].createdAt);
      });

      it("should sort by amount in ascending order", async () => {
        const response = await fetch("http://localhost:3000/api/v1/transactions?sortBy=amount&sortOrder=asc", {
          headers: {
            Authorization: "Bearer 33",
          },
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        const transactions = data.data.transactions;
        expect(transactions[0].amount).toBeLessThan(transactions[transactions.length - 1].amount);
      });
    });
  });

  describe("GET /api/v1/transactions/[id]", () => {
    it("should return 401 when no Bearer token is provided", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions/123");
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.message).toBe("Unauthorized");
    });

    // MAKE REPOSITORY AND SERVICE!!!! 👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈
    it("should return 404 for non-existent transaction", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions/non-existent-id", {
        headers: {
          Authorization: "Bearer 33",
        },
      });
      expect(response.status).toBe(404);
      const data = await response.json();
      console.log(data);
      expect(data.success).toBe(false);
      expect(data.error.message).toBe("Transaction not found");
    });

    it("should return transaction details for valid ID", async () => {
      // First get a list of transactions to get a valid ID
      const listResponse = await fetch("http://localhost:3000/api/v1/transactions", {
        headers: {
          Authorization: "Bearer 33",
        },
      });
      const listData = await listResponse.json();
      const transactionId = listData.data.transactions[0].id;

      // Then get the details for that transaction
      const response = await fetch(`http://localhost:3000/api/v1/transactions/${transactionId}`, {
        headers: {
          Authorization: "Bearer 33",
        },
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.transaction.id).toBe(transactionId);
    });
  });

  describe("POST /api/v1/transactions/create", () => {
    it("should return 401 when no Bearer token is provided", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 100,
          toBankNumber: "1234567890/1234",
        }),
      });
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.message).toBe("Unauthorized");
    });

    it("should return 400 for missing required fields", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 55",
        },
        body: JSON.stringify({}),
      });
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.details[0].message).toBe("Amount and recipient bank account number are required");
    });

    it("should return 400 for invalid amount", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 55",
        },
        body: JSON.stringify({
          amount: -1,
          toBankNumber: "1234567890/1234",
        }),
      });
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.details[0].message).toBe("Amount must be greater than 0");
    });

    it("should return 404 for non-existent recipient bank account", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 55",
        },
        body: JSON.stringify({
          amount: 100,
          toBankNumber: "123456789012/5555", // Exactly 17 characters
        }),
      });
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.message).toBe("Bank account not found");
    });

    it("should create a new transaction", async () => {
      const response = await fetch("http://localhost:3000/api/v1/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 55",
        },
        body: JSON.stringify({
          amount: 100,
          toBankNumber: "555555555555/5555", // Prague rescue fund
        }),
      });
      expect(response.status).toBe(201);
      const data = await response.json();
      console.log(data);
      expect(data.success).toBe(true);
      expect(data.data.message.amount).toBe(100);
      expect(data.data.message.currency).toBe("CZECHITOKEN");
    });
  });
});
