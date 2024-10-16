"use server";

export async function sendDiscordMessage({
  message,
  sender,
  text,
  applicationType,
  city,
}: {
  message: string;
  sender: string;
  text: string;
  applicationType: "web" | "api";
  city: "prague" | "brno";
}) {
  const DISCORD_WEBHOOK_URL_PRAGUE =
    "https://discord.com/api/webhooks/1295709536774127737/6BC92ZjqbuHWK4rEQUapMUUTWz5NcpTa9mJBVPD2K5xB9swpATCzkMrtP2JSYx3B57j6";

  const DISCORD_WEBHOOK_URL_BRNO =
    "https://discord.com/api/webhooks/1295709331488243754/HOF-dOhNdcPA1BPP8-uhi-SnJWcF97attHSzvbDNIpvVWBRAj0VEH_3vxu1HnyEIRcHM";

  const URL = {
    prague: DISCORD_WEBHOOK_URL_PRAGUE,
    brno: DISCORD_WEBHOOK_URL_BRNO,
  };

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

  fetch(URL[city], requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
