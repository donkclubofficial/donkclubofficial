import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" });
    }

    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("line_user_id", userId)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: "Player not found" });
    }

    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("player_id", player.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      player,
      transactions: transactions ?? [],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server Error" });
  }
}