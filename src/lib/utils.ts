import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default async function wait(time: number = 1000): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10) as string
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword) as boolean
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
  }).format(amount);
}
