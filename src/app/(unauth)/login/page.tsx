"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

type LoginForm = {
  username: string;
  password: string;
};

export default function Page() {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setErrorMsg("");

    console.log("準備登入:", data.username);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      console.log("登入結果:", res);

      if (res?.ok) {
        console.log("登入成功，準備跳轉");
        router.push("/user-portfolio");
      } else {
        console.log("登入失敗:", res?.error);
        // 根據不同的錯誤類型顯示不同的訊息
        if (res?.error === "CredentialsSignin") {
          setErrorMsg("登入失敗，帳號或密碼錯誤");
        } else {
          setErrorMsg(res?.error || "登入失敗，請稍後再試");
        }
      }
    } catch (error) {
      console.error("登入過程發生錯誤:", error);
      setErrorMsg("登入過程發生錯誤，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>登入帳號</CardTitle>
            <CardDescription>輸入帳號與密碼來登入</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">使用者名稱</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="輸入帳號"
                    required
                    disabled={isLoading}
                    {...register("username", {
                      required: "此欄位為必填",
                    })}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">密碼</Label>
                    <Link
                      href="/forget-pwd"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      忘記密碼？
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="輸入密碼"
                    disabled={isLoading}
                    {...register("password", { required: "請輸入密碼" })}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                {errorMsg && (
                  <div className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-md">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "登入中..." : "登入"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                    type="button"
                  >
                    使用 Google 帳號登入
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                還沒有帳號嗎？
                <Link href="/signup" className="underline underline-offset-4">
                  前往註冊
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
