import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
})

export const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  country: z.string().default("India"),
})

export const orderSchema = z.object({
  addressId: z.string().min(1, "Address is required"),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
  })).min(1, "At least one item is required"),
})
