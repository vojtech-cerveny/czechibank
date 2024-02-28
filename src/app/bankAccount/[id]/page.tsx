import { TransactionTable } from "@/components/transactions/table";
import { TransactionTranfer } from "@/components/transactions/transfer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meteors } from "@/components/ui/meteors";
import { getBankAccountByIdAndUserId } from "@/domain/bankAccount-domain/ba-repository";
import { getAllUsers } from "@/domain/user-domain/user-repository";
import { getSession } from "@/lib/auth";
import { RocketIcon } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function BankAccountPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }
  const bankAccount = await getBankAccountByIdAndUserId(params.id, session.userId);
  const allUsers = await getAllUsers();
  if (!session || !bankAccount) {
    <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">404</h1>;
  }
  if (bankAccount) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Your bank account</h1>
        <h2 className="flex items-center gap-4 text-xl font-bold">
          <RocketIcon />
          Číslo účtu
        </h2>
        <div className="flex">
          <h2 className="mb-8 inline-block scroll-m-20 bg-gradient-to-r from-pink-600 to-gray-900 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent lg:text-5xl">
            {bankAccount.number}
          </h2>
          {/* <h2 className="mb-8 scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
            /{bankAccount.number.split("/")[1]}
          </h2> */}
        </div>
        <div className="flex flex-row gap-4">
          <Card className="relative flex flex-grow flex-col overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <Meteors number={20} />
            <CardHeader className="flex-none">{/* <CardTitle>{bankAccount.currency}</CardTitle> */}</CardHeader>
            <CardContent className="flex flex-grow flex-col justify-end">
              <div className="grow"></div>
              <div className="flex-none">
                <div className="flex scroll-m-20 flex-row items-center justify-end space-x-2 ">
                  <Image src="/czechitoken-white4.svg" alt="Czechitoken" width={40} height={40} />
                  <span className="bg-gradient-to-r from-pink-400 to-gray-200 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent lg:text-6xl">
                    {bankAccount.balance.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>Transfer your money</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTranfer userId={session.user.id} allUsers={allUsers.data} balance={bankAccount.balance} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your history</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable userId={session.user.id} />
          </CardContent>
        </Card>
      </div>
    );
  }
}
