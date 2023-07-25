import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Card,
  CardFooter,
  CardTitle,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useLoginMutation } from "./api";
import { Loader2Icon } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

export type LoginValues = z.infer<typeof loginSchema>;

export function LoginRoute() {
  const { mutate, status } = useLoginMutation();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: LoginValues) {
    console.log({ values });
    mutate(values);
  }
  return (
    <Card className="m-auto min-w-[300px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Mirvac email" {...field} />
                  </FormControl>
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex">
            <Button className="w-20">
              {status === "loading" && (
                <Loader2Icon className="animate-spin w-4 h-4" />
              )}
              {status !== "loading" && "Sign in"}
            </Button>
          </CardFooter>
        </Form>
      </form>
    </Card>
  );
}
