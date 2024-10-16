"use server";
import prisma from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import { Currency } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendDiscordMessage } from "../social-reporting-domain/discord-action";
import { CreateTransactionNumberToNumberSchema } from "./transation-schema";

export async function sendMoneyToBankNumber({
  userId,
  fromBankNumber,
  toBankNumber,
  amount,
  currency,
  applicationType,
}: {
  userId: string;
  toBankNumber: string;
  fromBankNumber?: string;
  amount: number;
  currency: Currency;
  applicationType: "web" | "api";
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

  const response = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        amount: parsedTransaction.data.amount,
        currency: parsedTransaction.data.currency,
        fromBankId: fromAccount.id,
        toBankId: toAccount.id,
      },
      select: {
        amount: true,
        createdAt: true,
        id: true,
        currency: true,
        from: {
          select: {
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
            number: true,
          },
        },
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
  // HARD-CODED DONATION NUMBER, who cares
  if (response[0].to.number == "555555555555/5555") {
    // await sendSlackMessage({
    //   text: `Money sent from account \`${fromAccount.number}\` - *${parsedTransaction.data.amount} ${parsedTransaction.data.currency}* :tada:`,
    //   message: ":money_with_wings: Money sent successfully!",
    //   sender: `Thanks for your donation ${response[0].from.user.name}`,
    //   applicationType,
    // });

    await sendDiscordMessage({
      text: `Money sent from account \`${fromAccount.number}\` - **${parsedTransaction.data.amount} ${parsedTransaction.data.currency}** :tada:`,
      message: "Money sent successfully!",
      sender: `${response[0].from.user.name}`,
      applicationType,
      city: "prague",
    });
  }

  if (response[0].to.number == "444444444444/5555") {
    await sendDiscordMessage({
      text: `Money sent from account \`${fromAccount.number}\` - **${parsedTransaction.data.amount} ${parsedTransaction.data.currency}** :tada:`,
      message: "Money sent successfully!",
      sender: `${response[0].from.user.name}`,
      applicationType,
      city: "brno",
    });
  }
  revalidatePath("/bankAccount");

  return successResponse("Money sent successfully", { message: response[0] });
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
    take: 30,
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
