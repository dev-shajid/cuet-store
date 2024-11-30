
import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(5, {
        message: "Password must be at least 8 characters.",
    }),
})

export const SignupSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(5, { message: "Password must be at least 8 characters" }),
    // dateOfBirth: z.string().nonempty({ message: "Date of birth is required" }),
    // studentId: z.string().nonempty({ message: "Student ID is required" }),
    // gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender" }),
    // department: z.string().nonempty({ message: "Please select a department" }),
    // yearOfStudy: z.number().min(1).max(5),
    // bio: z.string().max(200, { message: "Bio must not exceed 200 characters" }),
    // agreeToTerms: z.boolean().refine(value => value === true, { message: "You must agree to the terms" }),
    // receiveUpdates: z.boolean(),
})

export const CategorySchema = z.object({
    name: z.string({ message: "Name is required" }).min(3, "Name is required"),
    description: z.string().optional().default(""),
    is_featured: z.boolean().default(false),
    parentId: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("INACTIVE"),
});

export const ProductSchema = z.object({
    name: z.string({ message: "Name is required" }).min(3, "Name should be atelast 3 characters"),
    description: z.string().optional().default(""),
    is_featured: z.boolean().default(false),
    price: z.preprocess((val) => Number(val), z.number().min(0).default(0)),
    stock: z.preprocess((val) => Number(val), z.number().min(0).default(0)),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    category_name: z.string({ message: "Category ID is required" }).min(3, "Category ID is required"),
});


export const CheckoutSchema = z.object({
    phone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, {
        message: "Invalid Bangladeshi phone number",
    }),
    address: z.object({
        full_address: z.string().min(5, "Full address must be at least 5 characters"),
        save: z.boolean().default(false),
        new: z.boolean().default(false),
    })
});