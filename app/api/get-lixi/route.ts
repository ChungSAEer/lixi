import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, accountId } = body;
  
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return NextResponse.json({ message: "Id không hợp lệ" });
  }

  if (!accountId) {
    return NextResponse.json({ message: "Tài khoản không hợp lệ" });
  }

  try {
    // Check if room exists
    const room = storage.getRoom(id);
    if (!room) {
      return NextResponse.json({ message: "Room không tồn tại" });
    }

    // Claim lixi
    const result = storage.claimLixi(id, String(accountId));
    
    if (!result) {
      return NextResponse.json({ message: "Lỗi khi nhận lì xì" });
    }

    return NextResponse.json({ money: result.money });
  } catch (error) {
    console.error("Error claiming lixi:", error);
    return NextResponse.json({ message: "Lỗi khi nhận lì xì" });
  }
}
