import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const { data: players, error } = await supabase
    .from("players")
    .select("*");

  return NextResponse.json({
    envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    userId,
    count: players?.length ?? 0,
    players,
    error,
  });
}