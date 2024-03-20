import { getAllTransactionsByUserIdForAPI } from "@/domain/transaction-domain/transaction-repository";

import { Currency } from "@prisma/client";
import { authenticateRequest, handleErrors } from "../routes";
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy: keyof TransactionAPI = (searchParams.get("sortBy") as keyof TransactionAPI) || "createdAt";
    const order = searchParams.get("sortOrder") || (sortBy === "createdAt" ? "asc" : "desc");
    const filterBy: keyof TransactionAPI = (searchParams.get("filterBy") as keyof TransactionAPI) || "";
    const filterValue = searchParams.get("filterValue") || "";

    const user = await authenticateRequest(request);

    console.log(searchParams.get("sortOrder"), order);
    let transactions = await getAllTransactionsByUserIdForAPI(user.id, sortBy, order as "asc" | "desc");

    if (filterBy) {
      return Response.json({
        data: {
          transactions: transactions.filter((transaction) => {
            // QUESTION: this use include, should we use == ?
            // need to use toISOString to convert date to string
            if (filterBy === "createdAt") {
              return transaction[filterBy].toISOString().toLowerCase().includes(filterValue.toLowerCase());
            }
            return transaction[filterBy].toString().toLowerCase().includes(filterValue.toLowerCase());
          }),
        },
      });
    }
    return Response.json({ data: { transactions } });
  } catch (error) {
    const err = error as unknown as Error;
    return handleErrors(err);
  }
}
