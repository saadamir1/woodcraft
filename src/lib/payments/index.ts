import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "./types";

const codProvider: PaymentProvider = {
  id: "cod",
  async createPayment(): Promise<CreatePaymentResult> {
    return {
      provider: "cod",
      status: "PENDING",
      instructions: "Pay cash when your order arrives.",
    };
  },
};

const manualProvider: PaymentProvider = {
  id: "manual",
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return {
      provider: "manual",
      status: "AWAITING_PROOF",
      instructions: `Transfer Rs ${input.amountPkr} and submit your TID. Order ${input.orderNumber}.`,
    };
  },
};

/** Phase 2 stub — replace with Safepay/PayFast when merchant account is approved. */
const gatewayStub: PaymentProvider = {
  id: "gateway",
  async createPayment(): Promise<CreatePaymentResult> {
    return {
      provider: "gateway",
      status: "PENDING",
      instructions:
        "Online JazzCash / Easypaisa / cards will unlock after gateway approval.",
    };
  },
  async verifyWebhook() {
    return false;
  },
};

export function getPaymentProvider(
  method: CreatePaymentInput["method"],
): PaymentProvider {
  if (method === "COD") return codProvider;
  if (method === "GATEWAY") return gatewayStub;
  return manualProvider;
}

export type { CreatePaymentInput, CreatePaymentResult, PaymentProvider };
