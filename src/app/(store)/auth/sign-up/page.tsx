'use client'

import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '@/components/ui/separator'
import { FaGithub } from 'react-icons/fa'
import { SignupSchema } from '@/lib/schema'
import { login, signup } from '@/lib/action'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import { toast } from '@/hooks/use-toast'

export default function SignupForm() {
    const { onClose, onOpen } = useLoadingOverlay()

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: '',
            address: "",
            // dateOfBirth: "",
            // studentId: "",
            // gender: undefined,
            // department: "",
            // yearOfStudy: 1,
            // bio: "",
            // agreeToTerms: false,
            // receiveUpdates: false,
        },
    })

    async function onSubmit(values: z.infer<typeof SignupSchema>) {
        onOpen()
        const res = await signup(values)
        if (res.success) {
            toast({
                title: "✅ Success",
                description: "Your account has been created successfully",
            })
            await login({ email: values.email, password: values.password })
            window.location.replace('/')
        }
        else {
            toast({
                title: "❌ Error",
                description: res.message,
            })
        }
        console.log(res)
        onClose()
    }

    useEffect(() => {
        return () => onClose()
    }, [])

    return (
        <div className="flex items-center justify-center container h-full">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className='text-3xl font-bold text-center'>Signup</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
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
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@example.com" {...field} />
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
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter your phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter your address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                    control={form.control}
                                    name="dateOfBirth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="studentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Student ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your student ID" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="male" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Male
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="female" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Female
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="other" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Other
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="cs">Computer Science</SelectItem>
                                                    <SelectItem value="ee">Electrical Engineering</SelectItem>
                                                    <SelectItem value="me">Mechanical Engineering</SelectItem>
                                                    <SelectItem value="ce">Civil Engineering</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="yearOfStudy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year of Study</FormLabel>
                                            <FormControl>
                                                <Slider
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    defaultValue={[field.value]}
                                                    onValueChange={(vals) => field.onChange(vals[0])}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Year {field.value} of 5
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us a little about yourself"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                You can write up to 200 characters.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="agreeToTerms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Accept terms and conditions
                                                </FormLabel>
                                                <FormDescription>
                                                    You agree to our Terms of Service and Privacy Policy.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="receiveUpdates"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Receive email updates
                                                </FormLabel>
                                                <FormDescription>
                                                    Get notified about new features and updates.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                /> */}
                            <Button type="submit" className="w-full">Sign Up</Button>
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
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground w-full">
                        Already have an account?{" "}
                        <Link href="/auth/sign-in" className="text-primary underline">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}