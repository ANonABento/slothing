"use client";

import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/google/GoogleIcon";

interface SignInCardProps {
  callbackUrl: string;
}

export function SignInCard({ callbackUrl }: SignInCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Welcome back to Slothing</CardTitle>
        <CardDescription>
          Sign in with Google to continue your job search.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button
          className="w-full gap-2"
          onClick={() => signIn("google", { callbackUrl })}
        >
          <GoogleIcon className="h-4 w-4" />
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
