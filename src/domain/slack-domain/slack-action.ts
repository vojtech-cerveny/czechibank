"use server";
export async function sendSlackMessage({
  message: mainMessage,
  sender,
  text: secondMessage,
}: {
  message: string;
  sender: string;
  text: string;
}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.SLACK_APIKEY}`);

  const raw = JSON.stringify({
    channel: "C06SE5WP91U",
    text: secondMessage,
    attachments: [
      {
        color: "#FF0000",
        text: mainMessage,
        footer: sender,
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    // redirect: "follow",
  };

  fetch("https://slack.com/api/chat.postMessage", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
