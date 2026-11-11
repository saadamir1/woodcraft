import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .min(11, "Enter a Pakistani mobile (03XXXXXXXXX)")
    .max(15),
  city: z.string().min(2, "Enter your city").max(60),
  address: z.string().min(8, "Enter a full address").max(240),
  note: z.string().max(300).optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "JAZZCASH", "EASYPAISA", "BANK"]),
  paymentRef: z.string().max(80).optional().or(z.literal("")),
  discountCode: z.string().max(40).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
  items: z
    .array(
      z.object({
        productId: z.string(),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
