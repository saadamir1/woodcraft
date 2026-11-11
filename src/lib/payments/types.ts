export type PaymentProviderId = "cod" | "manual" | "gateway";

export type CreatePaymentInput = {
  orderId: string;
  orderNumber: string;
  amountPkr: number;
  method: "COD" | "JAZZCASH" | "EASYPAISA" | "BANK" | "GATEWAY";
  customerPhone: string;
};

export type CreatePaymentResult = {
  provider: PaymentProviderId;
  status: "PENDING" | "AWAITING_PROOF" | "PAID";
  redirectUrl?: string;
  instructions?: string;
};

/** Abstraction so Safepay / PayFast can plug in later without rewriting checkout. */
export interface PaymentProvider {
  id: PaymentProviderId;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyWebhook?(rawBody: string, signature: string): Promise<boolean>;
}
