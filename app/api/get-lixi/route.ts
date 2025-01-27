import { NextResponse } from "next/server";

export const runtime = "edge";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const body = await request.json();
  const { id, accountId } = body;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return NextResponse.json({ message: "Id không hợp lệ" });
  }

  if (!accountId) {
    return NextResponse.json({ message: "Tài khoản không hợp lệ" });
  }

  try {
    const lixi = await fetch(
      `${process.env.NEXT_PUBLIC_API ?? ""}/get-lixi/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId: String(accountId) }),
      }
    ).then((res) => res.json());

    if (!lixi) {
      return NextResponse.json({ message: "Lỗi khi nhận lì xì" });
    }

    return NextResponse.json({ ...lixi });
  } catch {
    return NextResponse.json({ message: "Lỗi khi nhận lì xì" });
  }
}
