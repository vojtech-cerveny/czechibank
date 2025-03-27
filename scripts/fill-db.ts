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

// Array of Lektors and Coordinators
const lektorsAndCoordinators = [
  {
    name: "Chapčáková Dana",
    email: "dana.chapcakova@czechitas.cz",
  },
  {
    name: "Cihlářová Dita",
    email: "dita.cihlarova@czechitas.cz",
  },
  {
    name: "Kurníková Kamila",
    email: "kamila.kurnikova@czechitas.cz",
  },
  {
    name: "Fárka Michal",
    email: "michal.farka@czechitas.cz",
  },
  {
    name: "Grabcová Kateřina",
    email: "katerina.grabcova@czechitas.cz",
  },
  {
    name: "Hrdý Jakub",
    email: "jakub.hrdy@czechitas.cz",
  },
  {
    name: "Humpolová Simona",
    email: "simona.humpolova@czechitas.cz",
  },
  {
    name: "Koudelka Jiří",
    email: "jiri.koudelka@czechitas.cz",
  },
  {
    name: "Maiksnar Martin",
    email: "martin.maiksnar@czechitas.cz",
  },
  {
    name: "Pavelková Klára",
    email: "klara.pavelkova@czechitas.cz",
  },
  {
    name: "Pilátová Kateřina",
    email: "katerina.pilatova@czechitas.cz",
  },
  {
    name: "Postolov Vitalii",
    email: "vitalii.postolov@czechitas.cz",
  },
  {
    name: "Roller Vladimír",
    email: "vladimir.roller@czechitas.cz",
  },
  {
    name: "Šadibol Soňa",
    email: "sona.sadibol@czechitas.cz",
  },
  {
    name: "Sotolář Zdeněk",
    email: "zdenek.sotolar@czechitas.cz",
  },
  {
    name: "Šrámek Ondřej",
    email: "ondrej.sramek@czechitas.cz",
  },
  {
    name: "Veverka Pavel",
    email: "pavel.veverka@czechitas.cz",
  },
];

// Convert Lektors and Coordinators to user data format
const lektorUsers = lektorsAndCoordinators.map((user, index) => ({
  data: {
    BankAccount: {
      create: {
        name: `${user.name}'s Account`,
        balance: 1000000, // Starting balance of 1M tokens
        number: `${String(index + 10000).padStart(12, "0")}/5555`, // Unique account numbers starting from 10000
        currency: "CZECHITOKEN" as Currency,
      },
    },
    email: user.email,
    name: user.name,
    password: "czechitas123", // Default password for all users
    sex: "MALE" as Sex, // Default sex, can be updated later
    apiKey: String(index + 100), // Unique API keys
    avatarConfig: `{"backgroundColor":["${Math.floor(Math.random() * 16777215).toString(16)}"],"eyebrows":["variant12"],"eyebrowsColor":["000000"],"eyes":["variant01"],"eyesColor":["000000"],"freckles":["variant01"],"frecklesColor":["000000"],"frecklesProbability":[null],"glasses":["variant03"],"glassesColor":["000000"],"glassesProbability":[null],"mouth":["happy05"],"mouthColor":["000000"],"nose":["variant06"],"noseColor":["000000"]}`,
  },
}));

// Add lektor users to the main users array
users.push(...lektorUsers);

// Helper function to generate deterministic random numbers
function seededRandom(seed: number, offset: number = 0) {
  // Use a more stable random number generation
  const x = Math.sin(seed + offset) * 10000;
  const result = x - Math.floor(x);

  // Add logging for seed 4 to debug the issue
  if (seed === 4) {
    console.log(`[${new Date().toISOString()}] Debugging seed 4 with offset ${offset}...`);
    console.log(`[${new Date().toISOString()}] seed 4 calculation:`, { x, result });
  }

  return result;
}

// Test the seededRandom function with more test cases
console.log(`[${new Date().toISOString()}] Testing seededRandom function...`);
for (let i = 0; i < 10; i++) {
  console.log(`[${new Date().toISOString()}] seededRandom(${i}) = ${seededRandom(i)}`);
}

// Generate transaction data
function generateTransactionData(regularUsers: any[], totalTransactions: number) {
  console.log(
    `[${new Date().toISOString()}] Starting generateTransactionData with ${regularUsers.length} users and ${totalTransactions} transactions`,
  );
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const transactions = [];

  // Track transaction patterns
  const transactionPatterns = new Map<string, Map<string, number>>();
  regularUsers.forEach((user) => {
    transactionPatterns.set(user.name, new Map());
    regularUsers.forEach((otherUser) => {
      transactionPatterns.get(user.name)!.set(otherUser.name, 0);
    });
  });

  // Log user information for debugging
  console.log(
    `[${new Date().toISOString()}] Regular users:`,
    regularUsers.map((u) => ({
      id: u.id,
      name: u.name,
      accountId: u.BankAccount[0].id,
      balance: u.BankAccount[0].balance,
    })),
  );

  for (let i = 0; i < totalTransactions; i++) {
    try {
      const seed = i;

      // Generate random but deterministic sender and receiver
      const senderIndex = Math.floor(seededRandom(seed, 0) * regularUsers.length);
      let receiverIndex = Math.floor(seededRandom(seed, 1) * regularUsers.length);
      let retryCount = 0;
      const MAX_RETRIES = 5;

      // Ensure sender and receiver are different
      while (receiverIndex === senderIndex && retryCount < MAX_RETRIES) {
        receiverIndex = Math.floor(seededRandom(seed, 2 + retryCount) * regularUsers.length);
        retryCount++;
      }

      // If we couldn't find a different receiver after max retries, skip this transaction
      if (receiverIndex === senderIndex) {
        console.log(
          `[${new Date().toISOString()}] Skipping transaction ${i + 1} - couldn't find different receiver after ${MAX_RETRIES} retries`,
        );
        continue;
      }

      const sender = regularUsers[senderIndex];
      const receiver = regularUsers[receiverIndex];

      // Track transaction pattern
      const currentCount = transactionPatterns.get(sender.name)!.get(receiver.name)!;
      transactionPatterns.get(sender.name)!.set(receiver.name, currentCount + 1);

      // Generate random but deterministic amount between 100 and 10000
      const amount = Math.floor(100 + seededRandom(seed, 3) * 9900);

      // Generate random but deterministic timestamp within the 6-month period
      const timeOffset = Math.floor(seededRandom(seed, 4) * (now.getTime() - sixMonthsAgo.getTime()));
      const transactionDate = new Date(sixMonthsAgo.getTime() + timeOffset);

      // Log progress every 100 transactions
      if (i % 100 === 0) {
        console.log(`[${new Date().toISOString()}] Generated ${i} transactions so far...`);
      }

      transactions.push({
        createdAt: transactionDate,
        amount,
        currency: "CZECHITOKEN" as Currency,
        fromBankId: sender.BankAccount[0].id,
        toBankId: receiver.BankAccount[0].id,
        senderBalance: sender.BankAccount[0].balance - amount,
        receiverBalance: receiver.BankAccount[0].balance + amount,
        senderAccountId: sender.BankAccount[0].id,
        receiverAccountId: receiver.BankAccount[0].id,
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error generating transaction ${i}:`, error);
      throw error;
    }
  }

  // Log transaction patterns
  console.log(`\n[${new Date().toISOString()}] Transaction Patterns:`);
  console.log("From -> To: Count");
  console.log("----------------");
  transactionPatterns.forEach((receivers, sender) => {
    receivers.forEach((count, receiver) => {
      console.log(`${sender} -> ${receiver}: ${count}`);
    });
    console.log("----------------");
  });

  console.log(`[${new Date().toISOString()}] Finished generating ${transactions.length} transactions`);
  return transactions;
}

// Generate deterministic transactions between users
async function generateDeterministicTransactions(prisma: PrismaClient) {
  console.log(`[${new Date().toISOString()}] Starting generateDeterministicTransactions...`);

  const allUsers = await prisma.user.findMany({
    include: {
      BankAccount: true,
    },
  });
  console.log(`[${new Date().toISOString()}] Found ${allUsers.length} total users`);

  // Filter out rescue fund accounts
  const regularUsers = allUsers.filter(
    (user) =>
      !user.BankAccount[0].number.includes("555555555555") && !user.BankAccount[0].number.includes("444444444444"),
  );
  console.log(`[${new Date().toISOString()}] Found ${regularUsers.length} regular users (excluding rescue funds)`);

  const TOTAL_TRANSACTIONS = 10000; // Increased from 1000 to 10000
  console.log(`[${new Date().toISOString()}] Generating ${TOTAL_TRANSACTIONS} transaction records...`);

  try {
    // Generate all transaction data first
    const transactions = generateTransactionData(regularUsers, TOTAL_TRANSACTIONS);
    console.log(`[${new Date().toISOString()}] Generated ${transactions.length} transaction records`);

    // Process transactions in batches
    const BATCH_SIZE = 100; // Increased from 50 to 100 for better performance
    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      const batch = transactions.slice(i, i + BATCH_SIZE);
      console.log(
        `[${new Date().toISOString()}] Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(transactions.length / BATCH_SIZE)} (${batch.length} transactions)...`,
      );

      // Process transactions in parallel within each batch
      await Promise.all(
        batch.map(async (transaction, j) => {
          const transactionNumber = i + j + 1;
          try {
            // Create transaction record
            const createdTransaction = await prisma.transaction.create({
              data: {
                createdAt: transaction.createdAt,
                amount: transaction.amount,
                currency: transaction.currency,
                fromBankId: transaction.fromBankId,
                toBankId: transaction.toBankId,
              },
            });

            // Update sender balance
            await prisma.bankAccount.update({
              where: { id: transaction.senderAccountId },
              data: { balance: transaction.senderBalance },
            });

            // Update receiver balance
            await prisma.bankAccount.update({
              where: { id: transaction.receiverAccountId },
              data: { balance: transaction.receiverBalance },
            });

            // Log progress every 1000 transactions
            if (transactionNumber % 1000 === 0) {
              console.log(`[${new Date().toISOString()}] Successfully processed transaction ${transactionNumber}`);
            }
          } catch (error) {
            console.error(`[${new Date().toISOString()}] Error processing transaction ${transactionNumber}:`, error);
            throw error;
          }
        }),
      );
    }

    console.log(`[${new Date().toISOString()}] Finished processing all ${transactions.length} transactions`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fatal error in generateDeterministicTransactions:`, error);
    throw error;
  }
}

async function prepareDb() {
  console.log(`[${new Date().toISOString()}] Starting prepareDb...`);
  const prisma = new PrismaClient();
  await prisma.$connect();
  console.log(`[${new Date().toISOString()}] Connected to database`);

  try {
    // Clean up all data first
    console.log(`[${new Date().toISOString()}] Cleaning up database...`);
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.bankAccount.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    console.log(`[${new Date().toISOString()}] Database cleaned up`);

    // Create all users
    for (const user of users) {
      console.log(`[${new Date().toISOString()}] Creating user: ${user.data.email}`);
      const createdUser = await prisma.user.upsert({
        where: { email: user.data.email },
        update: user.data,
        create: user.data,
      });
      console.log(`[${new Date().toISOString()}] User created: ${createdUser.email}`);
    }

    // Generate transactions between Lektors and Coordinators
    console.log(`[${new Date().toISOString()}] Starting to generate transactions between Lektors and Coordinators...`);
    await generateDeterministicTransactions(prisma);
    console.log(`[${new Date().toISOString()}] Finished all database operations`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in prepareDb:`, error);
  }
}

console.log(`[${new Date().toISOString()}] Starting script...`);
prepareDb()
  .catch((error) => {
    console.error(`[${new Date().toISOString()}] Fatal error:`, error);
  })
  .finally(() => {
    console.log(`[${new Date().toISOString()}] Script finished`);
    process.exit(0);
  });
