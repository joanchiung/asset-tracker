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

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>登入帳號</CardTitle>
            <CardDescription>輸入 email 來登入帳號</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">電子信箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">密碼</Label>
                    {/* <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      忘記密碼？
                    </a> */}

                    <Link
                      href="/forget-pwd"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      忘記密碼？
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    登入
                  </Button>
                  <Button variant="outline" className="w-full">
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
    // </div>
  );
}
