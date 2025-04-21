'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import axios, {AxiosError} from 'axios'
import { useEffect, useState } from "react"
import {  useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import lucide, { Loader, Loader2, LoaderCircle } from 'lucide'
import lucide2, { LoaderIcon } from 'lucide-react'


const page = () =>{

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500)

  const router = useRouter();

// ZOD IMPLEMENTATION 

const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues :{
        username: '',
        email: '',
        password: '',
    }
})

 useEffect(()=>{
 const checkUsernameUnique = async () =>{
    if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('') // reset messages
        try {
          const response =  await axios.get(`/api/check-username-unique?username=${username}`) 
          console.log(response);         
          setUsernameMessage(response.data.message)
        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
                AxiosError.response?.data.message ?? 'Error while checking the username'
            )
        }finally{
            setIsCheckingUsername(false)
        }
    }
 }
 checkUsernameUnique()
 }, [username])

 const onSubmit = async(data: z.infer<typeof signupSchema>) => {
  setIsSubmitting(true)

  try {
    const response = axios.post<ApiResponse>('/api/sign-up',  data)
    toast("Success")
    router.replace(`/verify/${username}`);
    setIsSubmitting(false)

  } catch (error) {
    console.error("Error while signup user", error);
    const AxiosError = error as AxiosError<ApiResponse>;
   let axiosError =   AxiosError.response?.data.message
   toast( axiosError )
   setIsSubmitting(false)

  }
 }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e)=>{
                    field.onChange(e)
                    debounced(e.target.value)
                }}
                />
                
              </FormControl>       
              {isCheckingUsername && <LoaderIcon className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}       
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} 
                />
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
                <Input type="password" placeholder="password" {...field} 
                />
              </FormControl>              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
        {
            isSubmitting ? (
              
               <>
               <LoaderIcon className="mr-2 h-4 w-4 animate-spin"/> Please Wait
               </>
            ) : ('Signup') 
        }
        </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
        </div>
    </div>
  )
}

export default page