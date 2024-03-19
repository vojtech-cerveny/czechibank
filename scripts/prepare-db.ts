import { PrismaClient } from "@prisma/client";

async function prepareDb() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  try {
    const pejsekAKocicka = await prisma.user.create({
      data: {
        BankAccount: {
          create: {
            name: "ZÁCHRANÁŘSKÝ FOND",
            balance: 0,
            number: "555555555555/5555",
            currency: "CZECHITOKEN",
          },
        },
        email: "zachranNasa@pejsekAKocicka.cz",
        name: "Pejsek a Kocicka",
        password: "PejsekAKocicka123",
        sex: "MALE",
        avatarConfig: `{"backgroundColor":["ffe900"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
      },
    });
    console.log("User created:", pejsekAKocicka);
  } catch (error) {
    console.log(error);
  }
}

prepareDb().finally(() => process.exit(0));
