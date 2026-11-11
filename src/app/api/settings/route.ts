import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const s = await getSettings();
  return NextResponse.json({
    freeDeliveryThresholdPkr: s.freeDeliveryThresholdPkr,
    defaultDeliveryFeePkr: s.defaultDeliveryFeePkr,
    jazzcashNumber: s.jazzcashNumber,
    easypaisaNumber: s.easypaisaNumber,
    bankDetails: s.bankDetails,
    codEnabled: s.codEnabled,
    manualTransferEnabled: s.manualTransferEnabled,
    brandName: s.brandName,
    whatsappNumber: s.whatsappNumber,
  });
}
