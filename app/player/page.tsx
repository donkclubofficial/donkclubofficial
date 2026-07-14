"use client";

import { useEffect, useState } from "react";
import { initLiff } from "../../lib/liff";

export default function PlayerPage() {

  alert("PLAYER PAGE RUN");

  const [player, setPlayer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {

    alert("STEP 1");

    async function run() {

      alert("STEP 2");

      const profile = await initLiff();

      alert("PROFILE = " + JSON.stringify(profile));

      if (!profile) {

        alert("NO PROFILE");

        return;

      }

      alert("STEP 3");

      const res = await fetch("/api/player/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.userId,
        }),
      });

      alert("STEP 4");

      const data = await res.json();

      alert(JSON.stringify(data));

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
    return <div style={{ padding: 30 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{player.display_name}</h1>

      {transactions.map((t: any) => (
        <div key={t.id}>
          <p>{t.buy_in}</p>
        </div>
      ))}
    </div>
  );
}