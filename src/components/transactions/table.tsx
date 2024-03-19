"use server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllTransactionsByUserAndBankAccountId } from "@/domain/transaction-domain/transaction-repository";
import { Transaction, User } from "@prisma/client";
import { UserAvatar } from "../user/avatar";

export async function TransactionTable({ bankAccountId }: { bankAccountId: string }) {
  const transactions = await getAllTransactionsByUserAndBankAccountId(bankAccountId);

  type TransactionWithUsers = Transaction & {
    to: { user: User };
    from: { user: User };
  };

  function calculateTotalAmount(transactions: TransactionWithUsers[], bankAccount: string) {
    let total = 0;

    for (const transaction of transactions) {
      if (transaction.fromBankId === bankAccount) {
        total -= transaction.amount;
      } else if (transaction.toBankId === bankAccount) {
        total += transaction.amount;
      }
    }

    return total;
  }

  const totalAmount = calculateTotalAmount(transactions, bankAccountId);

  return (
    <div className="my-8 w-full">
      <h1>Transactions</h1>

      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id.padStart(10)}>
              <TableCell className=" font-medium">
                <div className="flex flex-row items-center justify-start space-x-2">
                  <UserAvatar size={8} userAvatarConfig={transaction.from.user.avatarConfig} />
                  <span>{transaction.from.user.name}</span>
                </div>
              </TableCell>
              <TableCell className="">
                <div className="flex flex-row items-center justify-start space-x-2">
                  <UserAvatar size={8} userAvatarConfig={transaction.to.user.avatarConfig} />
                  <span>{transaction.to.user.name}</span>
                </div>
              </TableCell>
              <TableCell>{transaction.currency}</TableCell>
              <TableCell className="text-right">{transaction.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Received/Send</TableCell>
            <TableCell className="text-right">{totalAmount}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
