import { NextResponse } from "next/server";
import { initializeWorkbook } from "@/lib/sheets";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const token = request.headers.get("x-setup-token");
  if (!process.env.SETUP_TOKEN || token !== process.env.SETUP_TOKEN) {
    return NextResponse.json({error:"Unauthorized"},{status:401});
  }
  try {
    const result=await initializeWorkbook();
    return NextResponse.json({ok:true,...result});
  } catch (error) {
    return NextResponse.json({error:error instanceof Error?error.message:"Setup gagal"},{status:500});
  }
}
