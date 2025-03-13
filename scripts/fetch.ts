const response = fetch("https://czechibank.ostrava.digital/bankAccount/cm0cf9qvl0005r16jmhthhjg2", {
  headers: {
    accept: "text/x-component",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "text/plain;charset=UTF-8",
    "next-action": "b9bb8aba88d4459b3ffe87f71565339c2af1f901",
    "next-router-state-tree":
      "%5B%22%22%2C%7B%22children%22%3A%5B%22bankAccount%22%2C%7B%22children%22%3A%5B%5B%22id%22%2C%22cm0cf9qvl0005r16jmhthhjg2%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
    priority: "u=1, i",
    "sec-ch-ua": '"Chromium";v="129", "Not=A?Brand";v="8"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    cookie:
      "session=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiY20wY2Y5cXZsMDAwM3IxNmp5NGIxaXhodCIsIm5hbWUiOiJWb2p0YSDwn6aKIENlcnZlbnkiLCJlbWFpbCI6InZvanRhQGN6ZWNoaWJhbmsub3N0cmF2YS5kaWdpdGFsIiwic2V4IjoiTUFMRSIsInBhc3N3b3JkIjoiIiwiYXBpS2V5IjoiIiwiYXZhdGFyQ29uZmlnIjoie1wiYmFja2dyb3VuZENvbG9yXCI6W1wiZmYwMDAwXCJdLFwiZXllYnJvd3NcIjpbXCJ2YXJpYW50MTFcIl0sXCJleWVicm93c0NvbG9yXCI6W1wiZmZmZmZmXCJdLFwiZXllc1wiOltcInZhcmlhbnQwMVwiXSxcImV5ZXNDb2xvclwiOltcImZmZmZmZlwiXSxcImZyZWNrbGVzXCI6W1widmFyaWFudDAxXCJdLFwiZnJlY2tsZXNDb2xvclwiOltcImZmZmZmZlwiXSxcImZyZWNrbGVzUHJvYmFiaWxpdHlcIjpbbnVsbF0sXCJnbGFzc2VzXCI6W1widmFyaWFudDAxXCJdLFwiZ2xhc3Nlc0NvbG9yXCI6W1wiZmZmZmZmXCJdLFwiZ2xhc3Nlc1Byb2JhYmlsaXR5XCI6W251bGxdLFwibW91dGhcIjpbXCJoYXBweTA0XCJdLFwibW91dGhDb2xvclwiOltcImZmZmZmZlwiXSxcIm5vc2VcIjpbXCJ2YXJpYW50MDRcIl0sXCJub3NlQ29sb3JcIjpbXCJmZmZmZmZcIl19In0sImV4cGlyZXMiOiIyMDI0LTEwLTE3VDEwOjE2OjE5LjA1M1oiLCJpYXQiOjE3MjgyOTYxNzksImV4cCI6MTcyOTE2MDE3OX0.fN4ZePIt5stXawIg9fl1_fS1ywCyarGtM7wrQxbgTWs",
    Referer: "https://czechibank.ostrava.digital/bankAccount/cm0cf9qvl0005r16jmhthhjg2",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
  body: '[{"amount":1,"currency":"CZECHITOKEN","fromBankNumber":"000000000002/5555","toBankNumber":"000000000001/5555","userId":"cm0cf9qvp0006r16jkqy3jb59","applicationType":"web"}]',
  method: "POST",
}).then(async (res) => {
  const text = await res.text();
  console.log("Raw response:", text);
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
});

response
  .then((data) => {
    console.log("Parsed response:", data);
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
