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
import { SignUpSchema } from "@/lib/schemas";
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

  const { mutate, isPending } = useAuth().register;
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    mutate(data, {
      onSuccess: () => {
        router.push(`/join/${inviteCode}`);
      },
    });
  };
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 ">
      <Card className="mx-auto w-full max-w-3xl flex items-center flex-col-reverse lg:flex-row shadow-none lg:shadow lg:border gap-2 lg:gap-0 border-none bg-transparent lg:bg-card mt-[73px]">
        <Card className="w-full lg:h-[480px] lg:shadow-none lg:border-0 lg:rounded-r-none lg:border-r flex justify-center items-start flex-col">
          <CardHeader className="p-4 lg:pb-6">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              By singin up, you agree to our Privacy Policy and Terms of Service
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full p-4 pt-0 lg:p-6 lg:pt-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="text"
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  Sign Up
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Alraedy have an account?{" "}
              <Link href={`/join/${inviteCode}/sign-in`} className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full lg:shadow-none lg:border-none lg:h-[480px] flex justify-center items-start flex-col px-0 lg:px-6">
          <CardContent className="flex items-center justify-center flex-col gap-2 p-4 lg:py-6 w-full h-full relative">
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
            <Card className="w-full px-2 lg:px-6 py-2 text-xs bg-yellow-300 flex items-center font-semibold rounded-md shadow-none border-none lg:absolute lg:top-6">
              <AlertCircle className="size-3 mr-2" />
              To join the workspace, please register first.
            </Card>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
};
