import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const { data: player, error } = await supabase
    .from("players")
    .select("*")
    .eq("line_user_id", userId)
    .single();

  if (error || !player) {
    return NextResponse.json({
      error: "Player not found",
    });
  }

  const buyins = [];

  for (let i = 1; i <= 10; i++) {
    const amount = player[`buy_in${i}`];

    if (amount != null) {
      buyins.push({
        day: i,
        buyIn: amount,
      });
    }
  }

  return NextResponse.json({
    player,
    cashOut: player.cash_out,
    buyins,
  });
}