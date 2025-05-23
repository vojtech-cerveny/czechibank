import { check, sleep } from "k6";
import http from "k6/http";
export const options = {
  stages: [
    { duration: "15s", target: 50 },
    // { duration: "1m30s", target: 10 },
    // { duration: "20s", target: 0 },
  ],
};
export function setup() {
  if (__ENV.APIKEY === undefined) {
    throw Error("APIKEY validation failed. Run script k6 run -e APIKEY=yourApiKey script.js");
  }
}

export default function () {
  // const res1 = http.post(
  //   "https://czechibank.ostrava.digital/v1/api/transactions/create",
  //   JSON.stringify({
  //     to: "594810059418/5555",
  //     amount: 1,
  //   }),
  //   {
  //     headers: {
  //       "X-API-Key": __ENV.APIKEY,
  //     },
  //   },
  // );
  // check(res1, { "status was 200": (r) => r.status == 201 });

  const res2 = http.get("https://czechibank.ostrava.digital/v1/api/transactions/transactions?limit=10", {
    headers: {
      "X-API-Key": __ENV.APIKEY,
    },
  });
  check(res2, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
