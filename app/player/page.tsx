"use client";

import { useEffect, useState } from "react";
import { initLiff } from "../../lib/liff";

export default function PlayerPage() {
  const [player, setPlayer] = useState<any>(null);
  const [buyins, setBuyins] = useState<any[]>([]);
  const [cashOut, setCashOut] = useState(0);

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

      console.log(data);

      if (data.error) {
        alert(data.error);
        return;
      }

      setPlayer(data.player);
      setBuyins(data.buyins);
      setCashOut(data.cashOut);
    }

    run();
  }, []);

  if (!player) {
    return (
      <div
        style={{
          background: "#111",
          color: "#fff",
          minHeight: "100vh",
          padding: 30,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        minHeight: "100vh",
        padding: 30,
      }}
    >
      <h1>{player.displayName || player.name}</h1>

      <hr />

      <h2>Cash Out</h2>

      <h3>{cashOut}</h3>

      <hr />

      <h2>ประวัติ Buy In</h2>

      {buyins.length === 0 ? (
        <p>ไม่มีข้อมูล</p>
      ) : (
        buyins.map((b: any) => (
          <div
            key={b.day}
            style={{
              border: "1px solid #555",
              marginTop: 10,
              padding: 15,
            }}
          >
            <b>วันที่ {b.day}</b>

            <br />

            Buy In : {b.buyIn}
          </div>
        ))
      )}
    </div>
  );
}