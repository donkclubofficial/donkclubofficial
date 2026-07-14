import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    console.log("========== /api/player/me ==========");
    console.log("LINE USER ID =", userId);

    if (!userId) {
      return NextResponse.json({
        error: "Missing userId",
      });
    }

    // หา Player จาก LINE User ID
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("line_user_id", userId)
      .single();

    console.log("PLAYER =", player);
    console.log("PLAYER ERROR =", playerError);

    if (playerError || !player) {
      return NextResponse.json({
        error: "Player not found",
      });
    }

    // ดึงประวัติ Buy In / Cash Out
    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("player_id", player.id)
      .order("created_at", { ascending: false });

    console.log("TRANSACTIONS =", transactions);
    console.log("TRANSACTION ERROR =", txError);

    return NextResponse.json({
      success: true,
      player,
      transactions: transactions ?? [],
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json({
      error: "Server Error",
    });
  }
}