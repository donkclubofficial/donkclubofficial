"use client";

import { useEffect, useState } from "react";
import { initLiff } from "../../lib/liff";

export default function PlayerPage() {
  const [player, setPlayer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function run() {
      console.log("=== PLAYER PAGE START ===");

      const profile = await initLiff();

      console.log("PROFILE =", profile);

      if (!profile) {
        console.log("NO PROFILE");
        return;
      }

      console.log("FETCH /api/player/me");

      const res = await fetch("/api/player/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.userId,
        }),
      });

      console.log("STATUS =", res.status);

      const data = await res.json();

      console.log("API DATA =", data);

      if (data.error) {
        console.log("API ERROR =", data.error);
        alert(data.error);
        return;
      }

      console.log("PLAYER =", data.player);
      console.log("TRANSACTIONS =", data.transactions);

      setPlayer(data.player);
      setTransactions(data.transactions ?? []);
    }

    run();
  }, []);

  console.log("RENDER PLAYER =", player);

  if (!player) {
    console.log("PLAYER IS NULL");
    return (
      <div style={{ padding: 30 }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>DONK CLUB</h1>

      <hr />

      <h2>{player.display_name}</h2>

      <p>
        <strong>Name:</strong> {player.name}
      </p>

      <p>
        <strong>LINE:</strong> {player.line_user_id}
      </p>

      <p>
        <strong>Buy In:</strong> {player.buy_in}
      </p>

      <hr />

      <h3>Transactions ({transactions.length})</h3>

      {transactions.length === 0 ? (
        <p>No transactions</p>
      ) : (
        transactions.map((t: any) => (
          <div
            key={t.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: 10,
              padding: 10,
            }}
          >
            <div>Buy In : {t.buy_in}</div>
            <div>Cash Out : {t.cash_out}</div>
            <div>Note : {t.note}</div>
            <div>Date : {t.created_at ?? "-"}</div>
          </div>
        ))
      )}
    </div>
  );
}