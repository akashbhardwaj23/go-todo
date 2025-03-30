import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "@tanstack/react-router";
import { Toaster, toast } from "sonner";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const navigate = useNavigate();

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>,
    type: "login" | "register"
  ) {
    e.preventDefault();
    setIsLoading(true);

    console.log(e.target);

    if (type === "register") {
      if (
        email === "" ||
        name === "" ||
        password === "" ||
        checkPassword === ""
      ) {
        alert("Please Fill All The Values");
        setIsLoading(false);
        return;
      }

      if (password !== checkPassword) {
        alert("Password is Not Same");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${BACKEND_URL}/create-user`, {
          email: email,
          name: name,
          password: password,
        });

        const data = response.data.id;

        localStorage.setItem("userId", data);
      
        toast.info("Please Signin Now")

      } finally {
        setIsLoading(false);
      }
    } else {
      if (email === "" || password === "") {
        alert("Please Fill All The Values");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${BACKEND_URL}/signin`, {
          email: email,
          password: password,
        });

        const data = response.data;

        localStorage.setItem("userId", data.id);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        navigate({ to: "/", state: true });
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#D4C3AA] p-8 flex items-center justify-center">
      <Toaster />
      <div className="w-full max-w-md">
        <Card className="border-[#372A15] bg-[#D4C3AA]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-[#372A15]">
              Welcome
            </CardTitle>
            <CardDescription className="text-[#372A15]/80">
              Choose your authentication method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#D4C3AA] border-[#372A15] border">
                <TabsTrigger
                  value="login"
                  className="py-0 data-[state=active]:bg-[#C7A26B]"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="py-0 data-[state=active]:bg-[#C7A26B]"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={(e) => onSubmit(e, "login")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#372A15]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="youremail@gmail.com"
                        required
                        className="input-monospace border-[#372A15] bg-[#D4C3AA] text-[#372A15] placeholder:text-[#372A15]/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[#372A15]">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-monospace border-[#372A15] bg-[#D4C3AA] text-[#372A15]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#C7A26B] hover:bg-[#B89255] text-[#372A15] border-[#372A15] border"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Login"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={(e) => onSubmit(e, "register")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-email"
                        className="text-[#372A15]"
                      >
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="youremail@gmail.com"
                        required
                        className="input-monospace border-[#372A15] bg-[#D4C3AA] text-[#372A15] placeholder:text-[#372A15]/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#372A15]">
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="your name"
                        required
                        className="input-monospace border-[#372A15] bg-[#D4C3AA] text-[#372A15] placeholder:text-[#372A15]/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-password"
                        className="text-[#372A15]"
                      >
                        Password
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-monospace border-[#372A15] bg-[#D4C3AA] text-[#372A15]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-[#372A15]"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={checkPassword}
                        onChange={(e) => setCheckPassword(e.target.value)}
                        required
                        className="input-monospace border-[#372A15] bg-[#D4C3AA] text-[#372A15]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#C7A26B] hover:bg-[#B89255] text-[#372A15] border-[#372A15] border"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Register"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#372A15]/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#D4C3AA] px-2 text-[#372A15]/80">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-[#372A15] text-[#372A15] hover:bg-[#372A15]/5"
                onClick={() => {}}
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="border-[#372A15] text-[#372A15] hover:bg-[#372A15]/5"
                onClick={() => {}}
              >
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
