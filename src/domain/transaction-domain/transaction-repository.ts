"use server";
import prisma from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import { Currency } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function sendMoneyToUser({
  fromUserId,
  toUserId,
  amount,
  currency,
}: {
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: Currency;
}) {
  amount = parseFloat(amount.toFixed(1));
  if (amount < 0) return errorResponse("Amount must be positive, this incident will be reported");

  const fromAccount = await prisma.bankAccount.findFirst({
    where: {
      userId: fromUserId,
      currency: currency,
    },
  });

  const toAccount = await prisma.bankAccount.findFirst({
    where: {
      userId: toUserId,
      currency: currency,
    },
  });

  if (fromAccount === null || toAccount === null) {
    return errorResponse("Bank account not found");
  }

  if (fromAccount.balance < amount) {
    return errorResponse("Insufficient funds");
  }

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        amount: amount,
        currency: currency,
        fromBankId: fromAccount.id,
        toBankId: toAccount.id,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: fromAccount.id,
      },
      data: {
        balance: fromAccount.balance - amount,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: toAccount.id,
      },
      data: {
        balance: toAccount.balance + amount,
      },
    }),
  ]);

  revalidatePath("/bankAccount");

  return successResponse("Money sent successfully", { message: "yolo" });
}

export async function sendMoneyToBankNumber({
  userId,
  fromBankNumber,
  toBankNumber,
  amount,
  currency,
}: {
  userId: string;
  toBankNumber: string;
  fromBankNumber?: string;
  amount: number;
  currency: Currency;
}) {
  amount = parseFloat(amount.toFixed(1));
  if (amount < 0) return errorResponse("Amount must be positive, this incident will be reported");
  const fromAccount = await prisma.bankAccount.findFirst({
    where: {
      userId: userId,
      number: fromBankNumber,
      currency: currency,
    },
  });

  const toAccount = await prisma.bankAccount.findFirst({
    where: {
      number: toBankNumber,
      currency: currency,
    },
  });

  if (fromAccount === null || toAccount === null) {
    return errorResponse("Bank account not found");
  }

  if (fromAccount.balance < amount) {
    return errorResponse("Insufficient funds");
  }

  const transaction = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        amount: amount,
        currency: currency,
        fromBankId: fromAccount.id,
        toBankId: toAccount.id,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: fromAccount.id,
      },
      data: {
        balance: fromAccount.balance - amount,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: toAccount.id,
      },
      data: {
        balance: toAccount.balance + amount,
      },
    }),
  ]);

  revalidatePath("/bankAccount");

  return successResponse("Money sent successfully", { transaction: transaction[0] });
}

export async function getAllTransactionsByUserId(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          from: {
            userId: userId,
          },
        },
        {
          to: {
            userId: userId,
          },
        },
      ],
    },
    include: {
      from: {
        include: {
          user: true,
        },
      },
      to: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions;
}

export async function getAllTransactionsByUserIdForAPI(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          from: {
            userId: userId,
          },
        },
        {
          to: {
            userId: userId,
          },
        },
      ],
    },
    // include: {
    //   from: {
    //     include: {
    //       user: true,
    //     },
    //   },
    //   to: {
    //     include: {
    //       user: true,
    //     },
    //   },
    // },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      amount: true,
      createdAt: true,
      currency: true,
      from: {
        select: {
          id: true,
          number: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      to: {
        select: {
          id: true,
          number: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return transactions;
}
