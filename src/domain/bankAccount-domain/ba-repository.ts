import prisma from "@/lib/db";
import { Currency } from "@prisma/client";

function generateRandomDigits(digitCount: number) {
  let randomNumber = "";
  for (let i = 0; i < digitCount; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return randomNumber;
}

export async function getBankAccountsByUserId(userId: string) {
  if (!userId) throw new Error("userId is required");
  const bankAccounts = await prisma.bankAccount.findMany({
    where: {
      userId: userId,
    },
  });
  console.log(bankAccounts);
  return bankAccounts;
}

export async function createBankAccount({ userId, currency }: { userId: string; currency: Currency }) {
  const bankAccount = await prisma.bankAccount.create({
    data: {
      userId: userId,
      currency: currency,
      name: "My Bank Account",
      number: generateRandomDigits(12) + "/5555",
    },
    include: {
      user: true,
    },
  });

  return bankAccount;
}

export async function getBankAccountByIdAndUserId(bankAccountId: string, userId: string) {
  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      id: bankAccountId,
      userId: userId,
    },
  });

  return bankAccount;
}

export async function getBankAccountByAPIKey(apiKey: string) {
  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      user: {
        apiKey: apiKey,
      },
    },
    // include: {
    //   user: true,
    // },
    select: {
      id: true,
      balance: true,
      currency: true,
      name: true,
    },
  });

  return bankAccount;
}

export async function deleteBankAccount(bankAccountId: string) {
  const bankAccount = await prisma.bankAccount.delete({
    where: {
      id: bankAccountId,
    },
  });

  return bankAccount;
}
