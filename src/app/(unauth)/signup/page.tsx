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

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>註冊</CardTitle>
            <CardDescription>請輸入完整資料完成註冊</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">用戶名稱</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="英數字，3-20字"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">電子信箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">密碼</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">確認密碼</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">手機號碼（選填）</Label>
                  <Input
                    id="phone"
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
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
