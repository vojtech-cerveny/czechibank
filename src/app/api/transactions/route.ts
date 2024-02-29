import {
  getAllTransactionsByUserIdForAPI,
  sendMoneyToBankNumber,
} from "@/domain/transaction-domain/transaction-repository";
import { ErrorResponse, SuccessResponse } from "@/lib/response";
import { Currency } from "@prisma/client";
import _ from "lodash";
import { authenticateRequest, handleErrors } from "../routes";
export { DELETE, HEAD, OPTIONS, PATCH, PUT, handleErrors } from "../routes";

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
  const { searchParams } = new URL(request.url);
  const sortBy: keyof TransactionAPI = (searchParams.get("sortBy") as keyof TransactionAPI) || "createdAt";
  const order = searchParams.get("sortOrder") || sortBy === "createdAt" ? "asc" : "desc";
  const filterBy: keyof TransactionAPI = (searchParams.get("filterBy") as keyof TransactionAPI) || "";
  const filterValue = searchParams.get("filterValue") || "";
  try {
    const user = await authenticateRequest(request);

    const transactions = await getAllTransactionsByUserIdForAPI(user.id);
    _.sortBy(transactions, [sortBy]);
    if (order === "desc") {
      transactions.reverse();
    }
    if (filterBy) {
      return Response.json({
        data: {
          transactions: transactions.filter((transaction) => {
            // QUESTION: this use include, should we use == ?
            return transaction[filterBy].toString().toLowerCase().includes(filterValue.toLowerCase());
          }),
        },
      });
    }
    return Response.json({ data: { transactions } });
  } catch (error) {
    const err = error as unknown as Error;
    handleErrors(err);
  }
}

function isError(response: ErrorResponse | SuccessResponse<any>): response is ErrorResponse {
  return (response as ErrorResponse).success === false;
}

export async function POST(request: Request) {
  try {
    const user = await authenticateRequest(request);

    const body = await request.json();
    const { amount, to } = body;
    const response = await sendMoneyToBankNumber({
      amount,
      toBankNumber: to,
      userId: user.id,
      currency: "CZECHITOKEN",
    });
    if (isError(response)) {
      return Response.json({ error: response.message }, { status: 400 });
    }
    return Response.json({ data: { response } });
  } catch (error) {
    handleErrors(error as Error);
  }
}
