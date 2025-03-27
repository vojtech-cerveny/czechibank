import { Currency, PrismaClient, Sex, User } from "@prisma/client";

const users: {
  data: { BankAccount: { create: { name: string; balance: number; number: string; currency: Currency } } } & Omit<
    User,
    "id"
  >;
}[] = [
  {
    data: {
      BankAccount: {
        create: {
          name: "ZÁCHRANÁŘSKÝ FOND [OSTRAVA!!!]",
          balance: 0,
          number: "555555555555/5555",
          currency: "CZECHITOKEN" as Currency,
        },
      },
      email: "zachranNas+praha@pejsekAKocicka.cz",
      name: "[OSTRAVA!!!] Pejsek a Kočicka 🐶&🐱",
      password: "PejsekAKocicka123",
      sex: "MALE" as Sex,
      apiKey: "11",
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
      apiKey: "22",
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
      apiKey: "33",
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
      apiKey: "44",
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
      apiKey: "55",
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
      apiKey: "66",
      avatarConfig: `{"backgroundColor":["4699CD"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
    },
  },
];

async function prepareDb() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  try {
    // Clean up all data first
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.bankAccount.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    console.log("Database cleaned up");

    for (const user of users) {
      const createdUser = await prisma.user.upsert({
        where: { email: user.data.email },
        update: user.data,
        create: user.data,
      });
      console.log("User created:", createdUser);
    }
  } catch (error) {
    console.log(error);
  }

  // Create some initial transactions
  try {
    // Get all users and their bank accounts
    const allUsers = await prisma.user.findMany({
      include: {
        BankAccount: true,
      },
    });

    // Create transactions between team members
    const teamTransactions = [
      {
        fromBankNumber: "000000000001/5555", // Vojta
        toBankNumber: "000000000002/5555", // Simona
        amount: 1000,
        currency: "CZECHITOKEN" as Currency,
      },
      {
        fromBankNumber: "000000000002/5555", // Simona
        toBankNumber: "000000000003/5555", // Vitalii
        amount: 2000,
        currency: "CZECHITOKEN" as Currency,
      },
      {
        fromBankNumber: "000000000003/5555", // Vitalii
        toBankNumber: "000000000004/5555", // Michal
        amount: 1500,
        currency: "CZECHITOKEN" as Currency,
      },
    ];

    // Create donations to rescue funds
    const rescueFundTransactions = [
      {
        fromBankNumber: "000000000001/5555", // Vojta
        toBankNumber: "555555555555/5555", // Prague rescue fund
        amount: 5000,
        currency: "CZECHITOKEN" as Currency,
      },
      {
        fromBankNumber: "000000000002/5555", // Simona
        toBankNumber: "444444444444/5555", // Brno rescue fund
        amount: 3000,
        currency: "CZECHITOKEN" as Currency,
      },
    ];

    // Process all transactions
    for (const transaction of [...teamTransactions, ...rescueFundTransactions]) {
      const fromUser = allUsers.find((user) =>
        user.BankAccount.some((account) => account.number === transaction.fromBankNumber),
      );

      if (!fromUser) {
        console.log(`User not found for bank account ${transaction.fromBankNumber}`);
        continue;
      }

      const result = await prisma.$transaction([
        prisma.transaction.create({
          data: {
            amount: transaction.amount,
            currency: transaction.currency,
            fromBankId: fromUser.BankAccount[0].id,
            toBankId: (await prisma.bankAccount.findFirst({
              where: { number: transaction.toBankNumber },
            }))!.id,
          },
        }),
        prisma.bankAccount.update({
          where: { id: fromUser.BankAccount[0].id },
          data: {
            balance: fromUser.BankAccount[0].balance - transaction.amount,
          },
        }),
        prisma.bankAccount.update({
          where: { number: transaction.toBankNumber },
          data: {
            balance: {
              increment: transaction.amount,
            },
          },
        }),
      ]);

      console.log("Transaction created:", result[0]);
    }
  } catch (error) {
    console.log("Error creating transactions:", error);
  }

  // Create 100 test transactions for pagination testing
  try {
    const testUser = await prisma.user.findFirst({
      where: { email: "vojta@czechibank.ostrava.digital" }, // Vojta's account
      include: { BankAccount: true },
    });

    if (!testUser) {
      console.log("Test user not found");
      return;
    }

    const testAccount = testUser.BankAccount[0];
    const rescueFund = await prisma.bankAccount.findFirst({
      where: { number: "555555555555/5555" }, // Prague rescue fund
    });

    if (!rescueFund) {
      console.log("Rescue fund not found");
      return;
    }

    // Create 100 transactions
    for (let i = 0; i < 100; i++) {
      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            amount: 1,
            currency: "CZECHITOKEN",
            fromBankId: testAccount.id,
            toBankId: rescueFund.id,
          },
        }),
        prisma.bankAccount.update({
          where: { id: testAccount.id },
          data: {
            balance: testAccount.balance - 1,
          },
        }),
        prisma.bankAccount.update({
          where: { id: rescueFund.id },
          data: {
            balance: rescueFund.balance + 1,
          },
        }),
      ]);
    }

    console.log("Created 100 test transactions");
  } catch (error) {
    console.log("Error creating test transactions:", error);
  }
}

prepareDb().finally(() => process.exit(0));
