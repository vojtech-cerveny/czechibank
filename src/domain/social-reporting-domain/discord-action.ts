"use server";

export async function sendDiscordMessage({
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
  const DISCORD_WEBHOOK_URL =
    "https://discord.com/api/webhooks/1295709536774127737/6BC92ZjqbuHWK4rEQUapMUUTWz5NcpTa9mJBVPD2K5xB9swpATCzkMrtP2JSYx3B57j6";
  const discord_message = {
    username: "DONATION BOT 2.0",
    avatar_url: "https://i.imgur.com/IVb6eBu.png",
    content: "Another donation has been made!",
    embeds: [
      {
        author: {
          name: sender,
          icon_url: "https://i.imgur.com/R66g1Pe.jpg",
        },
        description: `${text}`,
        color: applicationType === "web" ? 15844367 : 5763719,
        fields: [
          {
            name: "Type of transaction",
            value: `${applicationType.toUpperCase()}`,
            inline: true,
          },
        ],
        footer: {
          text: applicationType === "web" ? "Thank you for your support!" : "YOU MADE IT!Thank you for your donation!",
          icon_url: "https://i.imgur.com/fKL31aD.jpg",
        },
      },
    ],
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    body: JSON.stringify(discord_message),
    // redirect: "follow",
    headers: myHeaders,
  };

  fetch(DISCORD_WEBHOOK_URL, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
