"use client";

import { useEffect, useState } from "react";
import { initLiff } from "../../lib/liff";

export default function PlayerPage() {
  const [player, setPlayer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function run() {
      const profile = await initLiff();

      if (!profile) return;

      const res = await fetch("/api/player/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.userId,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setPlayer(data.player);
      setTransactions(data.transactions || []);
    }

    run();
  }, []);

  if (!player) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{player.display_name}</h1>
      <p>Buy In: {player.buy_in}</p>

      <hr />

      {transactions.map((t: any) => (
        <div key={t.id}>
          <p>{t.buy_in}</p>
        </div>
      ))}
    </div>
  );
}