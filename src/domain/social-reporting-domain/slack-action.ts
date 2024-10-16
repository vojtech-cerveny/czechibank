"use server";
export async function sendSlackMessage({
  message,
  sender,
  text,
  applicationType,
}: {
  message: string;
  sender: string;
  text: string;
  applicationType: "web" | "api";
}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.SLACK_APIKEY}`);

  const raw = JSON.stringify({
    channel: "B07QPF5P56F",
    text: `*[${applicationType.toUpperCase()}]* ${text}`,
    attachments: [
      {
        color: applicationType === "web" ? "#73D2DE" : "#FBB13C",
        text: message,
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
