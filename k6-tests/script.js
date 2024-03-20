import { check, sleep } from "k6";
import http from "k6/http";
export const options = {
  stages: [
    { duration: "1m", target: 20 },
    { duration: "1m30s", target: 10 },
    { duration: "20s", target: 0 },
  ],
};
export function setup() {
  if (__ENV.APIKEY === undefined) {
    throw Error("APIKEY validation failed. Run script k6 run -e APIKEY=yourApiKey script.js");
  }
}

export default function () {
  const res1 = http.post(
    "https://czechibank.ostrava.digital/api/transactions/create",
    JSON.stringify({
      to: "555555555555/5555",
      amount: 1,
    }),
    {
      headers: {
        Authorization: `Bearer ${__ENV.APIKEY}`,
      },
    },
  );
  check(res1, { "status was 200": (r) => r.status == 201 });

  const res2 = http.get("https://czechibank.ostrava.digital/api/transactions", {
    headers: {
      Authorization: `Bearer ${__ENV.APIKEY}`,
    },
  });
  check(res2, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
