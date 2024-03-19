"use server";
import prisma from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import { Currency } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CreateTransactionNumberToNumberSchema, CreateTransactionUserIdToUserIdUserSchema } from "./transation-schema";

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
  const parsedTransaction = CreateTransactionUserIdToUserIdUserSchema.safeParse({
    fromUserId,
    toUserId,
    amount,
    currency,
  });

  if (!parsedTransaction.success) {
    return errorResponse("Invalid transaction data");
  }

  const fromAccount = await prisma.bankAccount.findFirst({
    where: {
      userId: parsedTransaction.data.fromUserId,
      currency: parsedTransaction.data.currency,
    },
  });

  const toAccount = await prisma.bankAccount.findFirst({
    where: {
      userId: parsedTransaction.data.toUserId,
      currency: parsedTransaction.data.currency,
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
        amount: parsedTransaction.data.amount,
        currency: parsedTransaction.data.currency,
        fromBankId: fromAccount.id,
        toBankId: toAccount.id,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: fromAccount.id,
      },
      data: {
        balance: fromAccount.balance - parsedTransaction.data.amount,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: toAccount.id,
      },
      data: {
        balance: toAccount.balance + parsedTransaction.data.amount,
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
  const parsedTransaction = CreateTransactionNumberToNumberSchema.safeParse({
    userId,
    fromBankNumber,
    toBankNumber,
    amount,
    currency,
  });

  if (!parsedTransaction.success) {
    return errorResponse("Invalid transaction data", { errors: parsedTransaction.error.errors });
  }

  const fromAccount = await prisma.bankAccount.findFirst({
    where: {
      userId: parsedTransaction.data.userId,
      number: parsedTransaction.data.fromBankNumber,
      currency: parsedTransaction.data.currency,
    },
  });

  const toAccount = await prisma.bankAccount.findFirst({
    where: {
      number: parsedTransaction.data.toBankNumber,
      currency: parsedTransaction.data.currency,
    },
  });

  if (fromAccount === null || toAccount === null) {
    return errorResponse("Bank account not found");
  }

  if (fromAccount.balance < parsedTransaction.data.amount) {
    return errorResponse("Insufficient funds");
  }

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        amount: parsedTransaction.data.amount,
        currency: parsedTransaction.data.currency,
        fromBankId: fromAccount.id,
        toBankId: toAccount.id,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: fromAccount.id,
      },
      data: {
        balance: fromAccount.balance - parsedTransaction.data.amount,
      },
    }),
    prisma.bankAccount.update({
      where: {
        id: toAccount.id,
      },
      data: {
        balance: toAccount.balance + parsedTransaction.data.amount,
      },
    }),
  ]);

  revalidatePath("/bankAccount");

  return successResponse("Money sent successfully", { message: "yolo" });
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

export async function getAllTransactionsByUserAndBankAccountId(bankAccountId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          fromBankId: bankAccountId,
        },
        {
          toBankId: bankAccountId,
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

export async function getAllTransactionsByUserIdForAPI(userId: string, orderBy: string, order: "asc" | "desc") {
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
    orderBy: {
      [orderBy]: order,
    },
    select: {
      amount: true,
      id: true,
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

export async function getTransactionDetailById(transactionId: string, userId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
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
        select: {
          balance: false,
          number: true,
          currency: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      to: {
        select: {
          balance: false,
          number: true,
          currency: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return transaction;
}
