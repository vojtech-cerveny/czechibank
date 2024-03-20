"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Response } from "@/lib/response";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { processUserSignIn } from "@/domain/user-domain/user-actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const [serverResponse, setServerResponse] = useState<Response<any> | null>(null);
  const { toast } = useToast();
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const action: () => void = form.handleSubmit(async (data) => {
    const response = await processUserSignIn(data);
    setServerResponse(response);
    if (response.success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in. Enjoy your journey in Czechitoken!",
      });
    }
    redirect("/");
  });

  return (
    <div>
      <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Sign in</h1>
      {serverResponse && !serverResponse.success && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Oops!</AlertTitle>
          <AlertDescription>{serverResponse.message}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form action={action} className="my-4 space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>Email for sign in</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} type="password" />
                </FormControl>
                <FormDescription>Your password must be at least 6 characters long.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit">Sign in</Button>
            <Link href={"/register"}>
              <Button type="button" variant={"link"}>
                Register
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
