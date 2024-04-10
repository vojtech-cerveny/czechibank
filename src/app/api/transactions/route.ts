import { getAllTransactionsByUserIdForAPI } from "@/domain/transaction-domain/transaction-repository";

import { Currency } from "@prisma/client";
import { ApiError, authenticateRequest, handleErrors } from "../routes";
export { DELETE, HEAD, OPTIONS, PATCH, PUT } from "../routes";

type TransactionAPI = {
  amount: number;
  currency: Currency;
  createdAt: Date;
  from: {
    number: string;
    id: string;
    user: {
      name: string;
    };
  };
  to: {
    number: string;
    id: string;
    user: {
      name: string;
    };
  };
};

function getNestedProperty(obj: any, path: string) {
  return path.split(".").reduce((obj, prop) => obj && obj[prop], obj);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy: keyof TransactionAPI = (searchParams.get("sortBy") as keyof TransactionAPI) || "createdAt";
    const order = searchParams.get("sortOrder") || (sortBy === "createdAt" ? "asc" : "desc");
    const filterBy: keyof TransactionAPI = (searchParams.get("filterBy") as keyof TransactionAPI) || "";
    const filterValue = searchParams.get("filterValue") || "";

    console.log(sortBy, order, filterBy, filterValue);
    const user = await authenticateRequest(request);

    console.log(searchParams.get("sortOrder"), order);
    let transactions = await getAllTransactionsByUserIdForAPI(user.id, sortBy, order as "asc" | "desc");
    console.log(transactions.length);
    if (filterBy) {
      return Response.json({
        data: {
          transactions: transactions.filter((transaction) => {
            const transactionValue = getNestedProperty(transaction, filterBy);
            if (transactionValue) {
              return transactionValue.toString().toLowerCase().includes(filterValue.toLowerCase());
            }
            if (filterBy === "createdAt") {
              return transaction[filterBy].toISOString().toLowerCase().includes(filterValue.toLowerCase());
            }
            return false;
          }),
        },
      });
    }
    return Response.json({ data: { transactions } });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return handleErrors(error);
    } else {
      return Response.json({ error: "Internal Server Error", message: error }, { status: 500 });
    }
  }
}
