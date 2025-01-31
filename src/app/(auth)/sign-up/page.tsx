import React from "react";
import Client from "./_components/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { protect } from "../../../features/auth/server/queries";

export const metadata: Metadata = {
  title: "Sign-Up",
};

const SignUppage = async () => {
  const user = await protect();

  if (user) redirect("/");
  return (
    <div>
      <Client />
    </div>
  );
};

export default SignUppage;
