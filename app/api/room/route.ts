import { NextResponse } from "next/server";
export const runtime = "edge";

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
    const created = await fetch(`${process.env.NEXT_PUBLIC_API ?? ""}/room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    const data = await created.json();
    if (!data?.id) {
      return NextResponse.json({ message: "Error creating room" });
    }

    return NextResponse.json({ id: data?.id });
  } catch (e) {
    console.log("e", e);
    return NextResponse.json({ message: "Error" });
  }
}
