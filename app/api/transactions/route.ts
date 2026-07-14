import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      type,
      amount,
      note
    } = body;

    if (!userId || !type || amount == null) {
      return NextResponse.json(
        {
          error: "Missing required fields"
        },
        {
          status: 400
        }
      );
    }

    // หา player จาก LINE User ID
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id")
      .eq("line_user_id", userId)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        {
          error: "Player not found"
        },
        {
          status: 404
        }
      );
    }

    // เพิ่มรายการธุรกรรม
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        player_id: player.id,
        buy_in: type === "buy_in" ? amount : 0,
        cash_out: type === "cash_out" ? amount : 0,
        note: note ?? ""
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: error.message
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: data
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Server Error"
      },
      {
        status: 500
      }
    );
  }
}