import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp up to 20 users
    { duration: "1m", target: 20 }, // Stay at 20 users for 1 minute
    { duration: "30s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must complete below 500ms
    http_req_failed: ["rate<0.1"], // Less than 10% of requests can fail
  },
};

const BASE_URL = "http://localhost:3000/api/v1";

// Test data
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: "TestPassword123!",
  firstName: "Test",
  lastName: "User",
};

let authToken = "";
let bankAccountId = "";

// export function setup() {
//   // Create a test user
//   const createUserRes = http.post(`${BASE_URL}/user/create`, JSON.stringify(testUser), {
//     headers: { "Content-Type": "application/json" },
//   });

//   check(createUserRes, {
//     "user created successfully": (r) => r.status === 201,
//   });

//   // TODO: Add login endpoint test once implemented
//   // For now, we'll use a mock token
//   authToken = "mock-token";

//   return { authToken };
// }

export default function () {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  // Test 1: Get transactions without parameters (default pagination)
  const getTransactionsDefaultRes = http.get(`${BASE_URL}/transactions`, { headers });
  check(getTransactionsDefaultRes, {
    "transactions retrieved (default)": (r) => r.status === 200,
    "default transactions response has data": (r) => {
      const body = JSON.parse(r.body);
      return body.data && body.data.transactions;
    },
  });

  // Test 2: Get transactions with large pagination (10,000 transactions)
  const getTransactionsLargeRes = http.get(`${BASE_URL}/transactions?limit=10000`, { headers });
  check(getTransactionsLargeRes, {
    "transactions retrieved (large limit)": (r) => r.status === 200,
    "large transactions response has data": (r) => {
      const body = JSON.parse(r.body);
      return body.data && body.data.transactions;
    },
  });

  // Get API info
  const getAboutRes = http.get(`${BASE_URL}/about`);
  check(getAboutRes, {
    "API info retrieved": (r) => r.status === 200,
  });

  sleep(1);
}
