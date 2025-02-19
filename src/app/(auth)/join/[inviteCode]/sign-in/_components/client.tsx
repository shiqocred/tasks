"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/lib/schemas";
import { useAuth } from "@/features/api";
import { WorkspaceAvatarGeneral } from "@/components/workspace-avatar-general";
import { AlertCircle } from "lucide-react";
import { useInviteCode } from "@/features/join/hooks/use-invite-code";
import { useRouter } from "next/navigation";

export const Client = ({
  info,
}: {
  info: {
    data: {
      status: boolean;
      data: {
        id: string;
        name: string;
        imageUrl: string;
      } | null;
    };
  };
}) => {
  const inviteCode = useInviteCode();
  const router = useRouter();

  const { mutate, isPending } = useAuth().login;
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    mutate(data, {
      onSuccess: () => {
        router.push(`/join/${inviteCode}`);
      },
    });
  };
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 ">
      <Card className="mx-auto w-full max-w-3xl flex items-center flex-col-reverse lg:flex-row shadow-none lg:shadow lg:border gap-2 lg:gap-0 border-none bg-transparent lg:bg-white mt-[36.5px]">
        <Card className="w-full lg:h-[400px] lg:shadow-none lg:border-0 lg:rounded-r-none lg:border-r flex justify-center items-start flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="password"
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending} type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={`/join/${inviteCode}/sign-up`} className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full lg:shadow-none lg:border-none lg:h-[400px] flex justify-center items-start flex-col px-0 lg:px-6">
          <CardContent className="flex items-center justify-center flex-col gap-2 py-4 lg:py-6 w-full h-full relative">
            <div className="flex items-center w-full justify-start gap-4 lg:flex-col">
              <WorkspaceAvatarGeneral
                className={"lg:size-14 lg:text-2xl"}
                name={info.data.data?.name}
                image={info.data.data?.imageUrl}
              />
              <div className="flex flex-col justify-center items-start lg:items-center text-sm lg:text-base">
                <p className=" text-gray-500">
                  You&apos;ve been invited to join
                </p>
                <h3 className="font-semibold capitalize text-base lg:text-xl truncate">
                  {info.data.data?.name} Workspace
                </h3>
              </div>
            </div>
            <Card className="w-full px-6 py-2 text-xs bg-yellow-400 flex items-center font-semibold rounded-md shadow-none border-none lg:absolute lg:top-6">
              <AlertCircle className="size-3 mr-2" />
              To join the workspace, please log in first.
            </Card>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
};
