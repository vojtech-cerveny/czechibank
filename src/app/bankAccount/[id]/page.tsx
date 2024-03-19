import { TransactionTable } from "@/components/transactions/table";
import { TransactionTranfer } from "@/components/transactions/transfer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meteors } from "@/components/ui/meteors";
import { getBankAccountByIdAndUserId } from "@/domain/bankAccount-domain/ba-repository";
import { getAllUsers } from "@/domain/user-domain/user-repository";
import { getSession } from "@/lib/auth";
import { RocketIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export default async function BankAccountPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }
  const bankAccount = await getBankAccountByIdAndUserId(params.id, session.userId);
  if (!bankAccount.success) {
    notFound();
  }
  const allUsers = await getAllUsers();

  if (!session || !bankAccount) {
    <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">404</h1>;
  }
  if (bankAccount) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{bankAccount.data.name}</h1>
        <h2 className="flex items-center gap-4 text-xl font-bold">
          <RocketIcon />
          Číslo účtu
        </h2>
        <div className="flex">
          <h2 className="mb-8 inline-block scroll-m-20 bg-gradient-to-r from-pink-600 to-gray-900 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent lg:text-5xl">
            {bankAccount.data.number}
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <Card className="relative flex flex-grow flex-col overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <Meteors number={20} />
            <CardHeader className="flex-none">{/* <CardTitle>{bankAccount.currency}</CardTitle> */}</CardHeader>
            <CardContent className="flex flex-grow flex-col justify-end">
              <div className="grow"></div>
              <div className="flex-none">
                <div className="flex scroll-m-20 flex-col items-center justify-end">
                  <span className="bg-clip-text text-7xl font-extrabold tracking-tight text-transparent text-white lg:text-6xl">
                    {bankAccount.data.balance.toFixed(1)}
                  </span>
                  <span className="bg-clip-text text-4xl font-bold tracking-tight text-transparent text-white lg:text-3xl">
                    {bankAccount.data.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Transfer your money</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTranfer
                bankAccountNumber={bankAccount.data.number}
                userId={session.user.id}
                allUsers={JSON.parse(JSON.stringify(allUsers.data))}
                balance={bankAccount.data.balance}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your history</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable bankAccountId={bankAccount.data.id} />
          </CardContent>
        </Card>
      </div>
    );
  }
}
