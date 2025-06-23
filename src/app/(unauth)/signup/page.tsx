"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { signUpSchema } from "@/schemas/signup";

type SignUpForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });
  // 註冊 API 呼叫
  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpForm) => {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          phone: data.phone || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "註冊失敗");
      }

      return response.json();
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast("註冊成功", {
        description: "帳號已建立完成，現在可以登入了！",
        duration: 3000,
      });

      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("註冊過程發生錯誤:", error);

      let errorMessage = "註冊失敗，請稍後再試";

      if (error.message.includes("用戶名稱")) {
        errorMessage = "此用戶名稱已被使用";
      } else if (error.message.includes("電子信箱")) {
        errorMessage = "此電子信箱已被註冊";
      } else if (error.message) {
        errorMessage = error.message;
      }

      // 使用 Sonner toast 顯示錯誤訊息
      toast("註冊失敗", {
        description: errorMessage,
        duration: 4000,
        action: {
          label: "重試",
          onClick: () => console.log("準備重試註冊"),
        },
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: SignUpForm) => {
    signUpMutation.mutate(data);
  };

  const finalIsLoading = isLoading || signUpMutation.isPending || isSubmitting;

<<<<<<< HEAD
=======
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function validateUsername(username: string) {
    return /^[a-zA-Z0-9]{3,20}$/.test(username);
  }

  function validatePassword(password: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  }

  function validatePhone(phone: string) {
    return phone === "" || /^\d{10}$/.test(phone);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = (formData.get("username") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const password = (formData.get("password") ?? "").toString();
    const confirmPassword = (formData.get("confirmPassword") ?? "").toString();
    const phone = (formData.get("phone") ?? "").toString().trim();

    if (!username || !email || !password || !confirmPassword) {
      setErrorMsg("請填寫所有必填欄位");
      setLoading(false);
      return;
    }
    if (!validateUsername(username)) {
      setErrorMsg("用戶名稱須為 3-20 字元，僅限英數字");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setErrorMsg("密碼須至少8字元，包含大小寫、數字和特殊符號");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("密碼與確認密碼不符");
      setLoading(false);
      return;
    }
    if (!validatePhone(phone)) {
      setErrorMsg("手機號碼格式錯誤，須為10位數字");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
          phone,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMsg(errorData.message || "註冊失敗");
        setLoading(false);
        return;
      }

      setSuccessMsg("註冊成功！請去登入");
    } catch (error) {
      setErrorMsg(`註冊過程發生錯誤+${error}`);
    } finally {
      setLoading(false);
    }
  }

>>>>>>> c3165f5 (feat: signin)
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>註冊</CardTitle>
            <CardDescription>請輸入完整資料完成註冊</CardDescription>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <form onSubmit={handleSubmit(onSubmit)}>
=======
            <form onSubmit={handleSubmit}>
>>>>>>> c3165f5 (feat: signin)
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">用戶名稱</Label>
                  <Input
                    id="username"
<<<<<<< HEAD
                    type="text"
                    placeholder="英數字，3-20字元"
                    disabled={finalIsLoading}
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
=======
                    name="username"
                    type="text"
                    placeholder="英數字，3-20字"
                    required
                  />
>>>>>>> c3165f5 (feat: signin)
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">電子信箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@example.com"
                    disabled={finalIsLoading}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">密碼</Label>
                  <Input
                    id="password"
<<<<<<< HEAD
                    type="password"
                    placeholder="至少8字元，包含大小寫、數字、符號"
                    disabled={finalIsLoading}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
=======
                    name="password"
                    type="password"
                    required
                  />
>>>>>>> c3165f5 (feat: signin)
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">確認密碼</Label>
                  <Input
                    id="confirmPassword"
<<<<<<< HEAD
                    type="password"
                    placeholder="再次輸入密碼"
                    disabled={finalIsLoading}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
=======
                    name="confirmPassword"
                    type="password"
                    required
                  />
>>>>>>> c3165f5 (feat: signin)
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">手機號碼（選填）</Label>
                  <Input
                    id="phone"
<<<<<<< HEAD
                    type="text"
                    placeholder="0912345678"
                    disabled={finalIsLoading}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                {/* 顯示 mutation 錯誤 */}
                {signUpMutation.error && (
                  <div className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-md">
                    {signUpMutation.error.message}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={finalIsLoading}
                  >
                    {finalIsLoading ? "註冊中..." : "確認註冊"}
=======
                    name="phone"
                    type="text"
                    placeholder="0912345678"
                  />
                </div>
                {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
                {successMsg && (
                  <p className="text-green-600 text-sm">{successMsg}</p>
                )}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "註冊中..." : "確認"}
>>>>>>> c3165f5 (feat: signin)
                  </Button>
                </div>
              </div>
              {/* 登入連結 */}
              <div className="mt-4 text-center text-sm">
                已經有帳號了嗎？
                <Link href="/login" className="underline underline-offset-4">
                  前往登入
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
