"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const { data, error } = await supabase
      .from("players")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setPlayers(data);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>DONK CLUB</h1>

      {players.map((player) => (
        <div
          key={player.id}
          style={{
            border: "1px solid gray",
            padding: 10,
            marginTop: 10,
          }}
        >
          <h3>{player.name}</h3>
          <p>Buy In : {player.buy_in}</p>
        </div>
      ))}
    </div>
  );
}