
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useUserContext } from "@/components/userContext";
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"


const formSchema = z.object({
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }).email('Invalid email address'),
    password: z.string().min(8,{
      message: "password must be at least 8 characters."
    })
  })

export default function Login() {
  const { setCredentials } = useUserContext();
  const navigate = useNavigate();
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      email: values.email,
      password: values.password,
    };

    const url = 'https://karchu.onrender.com/v1/user/auth';
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          toast.error("Invalid login credentials. Verify your username and password and try again")
          throw new Error(`HTTP error! Status: ${response}`);
        }
        return response.json();
      })
      .then((userId: number) => {
        setCredentials(values.email, values.password, userId, true);
        localStorage.setItem('email', values.email);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('password', values.password);
        localStorage.setItem('loginTime', new Date().getTime().toString());
        console.log("navigating to trans")
        navigate("/transactions");
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      form.setValue('email', '');
      form.setValue('password', '');
  }
  
  return (
    <div className="flex justify-center">
        <Card className="w-[300px]">
        <CardHeader className="flex flex-row justify-between">
            <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 justify-center">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
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
                        <FormControl>
                            <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex justify-center">
                        <Button className="w-1/2" type="submit">Login</Button>
                    </div>
                </form>
            </Form>
        </CardContent>

        </Card>
    </div>
    
  )
}
