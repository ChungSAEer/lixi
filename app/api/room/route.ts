import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { amount } = body;
    if (!amount) {
      return NextResponse.json({ message: "Amount is required" });
    }

    if (!Array.isArray(amount) || amount.length !== 2) {
      return NextResponse.json({ message: "Amount must be an array" });
    }

    if (amount[0] < 10 || amount[1] > 500) {
      return NextResponse.json({
        message: "Amount range must be between 10 and 500",
      });
    }

    const [amountMin, amountMax] = amount;
    const id = storage.createRoom(amountMin, amountMax);

    return NextResponse.json({ id });
  } catch (e) {
    console.log("e", e);
    return NextResponse.json({ message: "Error" });
  }
}
