"use server";
import prisma from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
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

export async function createBankAccount({
  userId,
  currency,
  name = "My Bank Account",
}: {
  userId: string;
  currency: Currency;
  name?: string;
}) {
  const bankAccount = await prisma.bankAccount.create({
    data: {
      userId: userId,
      currency: currency,
      name: name,
      number: generateRandomDigits(12) + "/5555",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  if (!bankAccount) return errorResponse("Bank account not created");
  return successResponse("Bank account created successfully", bankAccount);
}

export async function getBankAccountByIdAndUserId(bankAccountId: string, userId: string) {
  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      id: bankAccountId,
      userId: userId,
    },
  });

  if (!bankAccount) return errorResponse("Bank account not found");
  return successResponse("Bank account found", bankAccount);
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

export async function getAllBankAccounts() {
  const bankAccounts = await prisma.bankAccount.findMany({
    select: {
      number: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return bankAccounts;
}
