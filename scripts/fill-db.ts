import { Currency, PrismaClient, Sex } from "@prisma/client";

const users = [
  {
    data: {
      BankAccount: {
        create: {
          name: "ZÁCHRANÁŘSKÝ FOND [PRAHA]",
          balance: 0,
          number: "555555555555/5555",
          currency: "CZECHITOKEN" as Currency,
        },
      },
      email: "zachranNas+praha@pejsekAKocicka.cz",
      name: "[PRAHA] Pejsek a Kočicka 🐶&🐱",
      password: "PejsekAKocicka123",
      sex: "MALE" as Sex,
      avatarConfig: `{"backgroundColor":["696AC9"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
    },
  },
  {
    data: {
      BankAccount: {
        create: {
          name: "ZÁCHRANÁŘSKÝ FOND [BRNO]",
          balance: 0,
          number: "444444444444/5555",
          currency: "CZECHITOKEN" as Currency,
        },
      },
      email: "zachranNas+brno@pejsekAKocicka.cz",
      name: "[BRNO] Pejsek a Kočička 🐶&🐱",
      password: "PejsekAKocicka123",
      sex: "MALE" as Sex,
      avatarConfig: `{"backgroundColor":["0DC681"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
    },
  },
  {
    data: {
      BankAccount: {
        create: {
          name: "Secret bank account",
          balance: 10000000,
          number: "000000000001/5555",
          currency: "CZECHITOKEN" as Currency,
        },
      },
      email: "vojta@czechibank.ostrava.digital",
      name: "Vojta 🦊 Cerveny",
      password: "hello123456",
      sex: "MALE" as Sex,
      avatarConfig: `{"backgroundColor":["ff0000"],"eyebrows":["variant11"],"eyebrowsColor":["ffffff"],"eyes":["variant01"],"eyesColor":["ffffff"],"freckles":["variant01"],"frecklesColor":["ffffff"],"frecklesProbability":[null],"glasses":["variant01"],"glassesColor":["ffffff"],"glassesProbability":[null],"mouth":["happy04"],"mouthColor":["ffffff"],"nose":["variant04"],"noseColor":["ffffff"]}`,
    },
  },
  {
    data: {
      BankAccount: {
        create: {
          name: "Secret bank account",
          balance: 10000000,
          number: "000000000002/5555",
          currency: "CZECHITOKEN" as Currency,
        },
      },
      email: "simona@czechibank.ostrava.digital",
      name: "Simona Humpolová",
      password: "hello123456",
      sex: "FEMALE" as Sex,
      avatarConfig: `{"backgroundColor":["C4DD68"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
    },
  },
  {
    data: {
      BankAccount: {
        create: {
          name: "Secret bank account",
          balance: 10000000,
          number: "000000000003/5555",
          currency: "CZECHITOKEN" as Currency,
        },
      },
      email: "vitalii@czechibank.ostrava.digital",
      name: "Vitalii Postolov",
      password: "hello123456",
      sex: "MALE" as Sex,
      avatarConfig: `{"backgroundColor":["ffe900"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
    },
  },
  {
    data: {
      BankAccount: {
        create: {
          name: "Secret bank account",
          balance: 10000000,
          number: "000000000004/5555",
          currency: "CZECHITOKEN" as Currency,
        },
      },
      email: "michal@czechibank.ostrava.digital",
      name: "Michal F.",
      password: "hello123456",
      sex: "MALE" as Sex,
      avatarConfig: `{"backgroundColor":["4699CD"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
    },
  },
];

async function prepareDb() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  try {
    for (const user of users) {
      const createdUser = await prisma.user.create({
        data: user.data,
      });
      console.log("User created:", createdUser);
    }
  } catch (error) {
    console.log(error);
  }
}

prepareDb().finally(() => process.exit(0));
