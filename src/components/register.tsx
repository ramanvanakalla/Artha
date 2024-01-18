
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"


const formSchema = z.object({
    name: z.string().min(5, {
        message: "name must be at least 5 characters"
    }),
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }).email('Invalid email address'),
    password: z.string().min(8,{
      message: "password must be at least 8 characters."
    })
  })

export default function Register() {
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
      name: values.name,
      email: values.email,
      password: values.password,
    };

    const url = 'https://karchu.onrender.com/v1/user';
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
          toast.error("Failed to create user");
          throw new Error(`HTTP error! Status: ${response}`);
        }
        return response.json();
      })
      .then((data: {}) => {
        console.log(data)
        toast.success("User created successfully")
        navigate("/login");
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      form.setValue('email', '');
      form.setValue('password', '');
      form.setValue('name', "");
  }
  return (
    <div className="flex justify-center">
        <Card className="w-[300px]">
        <CardHeader className="flex flex-row justify-between">
            <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 justify-center">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
                            <Input placeholder="Password" {...field} />
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
