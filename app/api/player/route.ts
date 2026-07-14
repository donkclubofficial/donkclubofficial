import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, displayName, pictureUrl } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // เช็กว่ามีผู้เล่นแล้วหรือยัง
    const { data: player } = await supabase
      .from("players")
      .select("*")
      .eq("line_user_id", userId)
      .single();

    if (player) {
      await supabase
        .from("players")
        .update({
          display_name: displayName,
          picture_url: pictureUrl,
        })
        .eq("line_user_id", userId);

      return NextResponse.json({
        success: true,
        action: "updated",
      });
    }

    await supabase.from("players").insert({
      line_user_id: userId,
      display_name: displayName,
      picture_url: pictureUrl,
      name: displayName,
    });

    return NextResponse.json({
      success: true,
      action: "created",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}