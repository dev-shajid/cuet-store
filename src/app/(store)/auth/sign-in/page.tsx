'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator"
import { LoginSchema } from '@/lib/schema'
import { login } from '@/lib/action'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import wait from '@/lib/utils'


export default function LoginForm() {
    const { onClose, onOpen } = useLoadingOverlay()
    const [error, setError] = useState<string>('')
    const callbackUrl = new URLSearchParams(window.location.search).get('callback') || '/'
    const router = useRouter()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        onOpen()
        const res = await login(values, callbackUrl)
        console.log(res)
        if (res.success) {
            window.location.replace(callbackUrl)
        }else{
            setError(res.message)
        }
        onClose()
    }

    useEffect(() => {
        return () => {
            onClose()
            // router.refresh()
        }
    }, [])

    return (
        <div className="flex items-center justify-center container h-full py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className='text-3xl font-bold text-center'>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter your email" {...field} />
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
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-between">
                                <Link href="#" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-6">
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full">
                                <FcGoogle className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                            <Button variant="outline" className="w-full">
                                <FaGithub className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col gap-4'>
                    <p className="text-center text-sm text-muted-foreground w-full">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/sign-up" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                    {error ?
                        <Alert className='bg-destructive/30 border border-red-500 text-red-500'>
                            <AlertDescription className='flex gap-2 items-center'>
                                <AlertCircle /> {error}
                            </AlertDescription>
                        </Alert> : null
                    }
                </CardFooter>
            </Card>
        </div>
    )
}