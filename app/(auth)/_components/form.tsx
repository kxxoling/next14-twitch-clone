/* eslint-disable react/no-unescaped-entities */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
// @ts-ignore
import { getCsrfToken } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
})

function LoginForm({ csrfToken }: { csrfToken: string }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  })
  const usernameField: any = form.register("username")
  const passwordField: any = form.register("password")
  return (

    <Card>
      <Form {...form}>
        <form
          method="POST"
          action="/api/auth/callback/credentials"
          className="space-y-8">
          <CardHeader>
            <CardTitle>Login with your account.</CardTitle>
            <CardDescription>
              We're happy to see you again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field: usernameField }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...usernameField} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field: passwordField }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' {...passwordField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type='hidden' name="csrfToken" defaultValue={csrfToken} />
            <input type='hidden' name="callbackUrl" value="/" />
          </CardContent>

          <CardFooter>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
function RegisterForm({ csrfToken }: { csrfToken: string }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  })
  const usernameField: any = form.register("username")
  const passwordField: any = form.register("password")
  return (

    <Card>
      <Form {...form}>
        <form
          method="POST"
          action="/api/auth/callback/credentials"
          className="space-y-8">
          <CardHeader>
            <CardTitle>Register a new account.</CardTitle>
            <CardDescription>
              And will create a related stream instantly.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field: usernameField }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...usernameField} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field: passwordField }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' {...passwordField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type='hidden' name="isNewUser" value="true" />
            <input type='hidden' name="csrfToken" defaultValue={csrfToken} />
            <input type='hidden' name="callbackUrl" value="/" />
          </CardContent>

          <CardFooter>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export async function FormTabs() {
  const csrfToken = await getCsrfToken()
  return <>
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Login</TabsTrigger>
        <TabsTrigger value="password">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <LoginForm csrfToken={csrfToken} />
      </TabsContent>
      <TabsContent value="password">
        <RegisterForm csrfToken={csrfToken} />
      </TabsContent>
    </Tabs>

    <form method="POST" action="/api/auth/signin/github">
      <input type='hidden' name="csrfToken" defaultValue={csrfToken} />
      <input type='hidden' name="callbackUrl" value="/" />
      <Button className="w-full my-2" type="submit">GitHub 登录</Button>
    </form>
  </>
}