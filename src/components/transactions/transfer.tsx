"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendMoneyToUser } from "@/domain/transaction-domain/transaction-repository";
import { Response } from "@/lib/response";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { UserAvatar } from "../user/avatar";

export function TransactionTranfer({
  userId,
  balance,
  allUsers,
}: {
  userId: string;
  allUsers: User[];
  balance: number;
}) {
  const { toast } = useToast();
  const users = allUsers.filter((user) => user.id !== userId).sort((a, b) => a.name.localeCompare(b.name));

  const [serverResponse, setServerResponse] = useState<Response<any> | null>(null);

  const transferScheme = z.object({
    receiverId: z.string(),
    amount: z.coerce.number().min(0).max(balance),
    // .refine((value) => {
    //   // const decimalPart = value.toString().split('.')[1];
    //   // return decimalPart === undefined || decimalPart.length === 1;
    // },
    //   {
    //     message: "Only one decimal is allowed",
    //     path: ["amount"],
    // })
  });

  const form = useForm<z.infer<typeof transferScheme>>({
    resolver: zodResolver(transferScheme),
    defaultValues: {},
  });

  const action: () => void = form.handleSubmit(async (data) => {
    console.log(data);
    const response = await sendMoneyToUser({
      amount: data.amount,
      currency: "CZECHITOKEN",
      fromUserId: userId,
      toUserId: data.receiverId,
    });
    setServerResponse(response);
    toast({
      title: "💸 Transaction created!",
      description: (
        <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGw2OXB2cmMydW1kb3k5cnpub2x4bm02bmhzZm9lb3E3ZTRxdnhwNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HFkA6omUyjVYqw8/giphy.gif" />
      ),
    });
    form.resetField("amount");
  });
  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form action={action} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="receiverId"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel>Receiver</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select an receiver your money" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex flex-row items-center justify-start space-x-2">
                              <UserAvatar size={8} userAvatarConfig={user.avatarConfig} />
                              <span>{user.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Send her/him some love!</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Transfer</Button>
        </form>
      </Form>
    </div>
  );
}
