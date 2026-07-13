"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [cashOut, setCashOut] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const { data } = await supabase
      .from("players")
      .select("*")
      .order("name");

    if (!data) return;

    setPlayers(data);

    if (data.length > 0) {
      setSelectedPlayer(data[0].id);
      loadTransactions(data[0].id);
    }
  }

  async function loadTransactions(playerId: string) {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  }

  async function addBuyIn() {
    if (!buyIn) return;

    await supabase.from("transactions").insert({
      player_id: selectedPlayer,
      buy_in: Number(buyIn),
      cash_out: 0,
      note: "Buy In",
    });

    setBuyIn("");
    loadTransactions(selectedPlayer);
  }

  async function addCashOut() {
    if (!cashOut) return;

    await supabase.from("transactions").insert({
      player_id: selectedPlayer,
      buy_in: 0,
      cash_out: Number(cashOut),
      note: "Cash Out",
    });

    setCashOut("");
    loadTransactions(selectedPlayer);
  }

  async function deleteTransaction(id: string) {
    if (!confirm("ลบรายการนี้?")) return;

    await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    loadTransactions(selectedPlayer);
  }

  const totalBuyIn = transactions.reduce(
    (sum, t) => sum + (t.buy_in || 0),
    0
  );

  const totalCashOut = transactions.reduce(
    (sum, t) => sum + (t.cash_out || 0),
    0
  );

  const balance = totalBuyIn - totalCashOut;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "30px auto",
        padding: 30,
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 0 10px rgba(0,0,0,.1)",
        color: "#222",
      }}
    >
      <h1>🎰 DONK CLUB ADMIN</h1>

      <br />

      <select
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
        }}
        value={selectedPlayer}
        onChange={(e) => {
          setSelectedPlayer(e.target.value);
          loadTransactions(e.target.value);
        }}
      >
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div>
          <h3>Buy In</h3>

          <input
            type="number"
            value={buyIn}
            onChange={(e) => setBuyIn(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 18,
            }}
          />

          <br />
          <br />

          <button
            onClick={addBuyIn}
            style={{
              width: "100%",
              padding: 12,
              background: "#1abc9c",
              color: "white",
              border: 0,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            + Add Buy In
          </button>
        </div>

        <div>
          <h3>Cash Out</h3>

          <input
            type="number"
            value={cashOut}
            onChange={(e) => setCashOut(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 18,
            }}
          />

          <br />
          <br />

          <button
            onClick={addCashOut}
            style={{
              width: "100%",
              padding: 12,
              background: "#e74c3c",
              color: "white",
              border: 0,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            - Add Cash Out
          </button>
        </div>
      </div>

      <br />

      <div
        style={{
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <h2>สรุปยอด</h2>

        <h3>Buy In : {totalBuyIn.toLocaleString()}</h3>

        <h3>Cash Out : {totalCashOut.toLocaleString()}</h3>

        <h2 style={{ color: "green" }}>
          คงเหลือ : {balance.toLocaleString()}
        </h2>
      </div>

      <br />

      <h2>History</h2>

      {transactions.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 15,
            borderRadius: 10,
          }}
        >
          <div>
            <b>{new Date(t.created_at).toLocaleString()}</b>
          </div>

          <br />

          <div>Buy In : {t.buy_in}</div>

          <div>Cash Out : {t.cash_out}</div>

          <div>{t.note}</div>

          <br />

          <button
            onClick={() => deleteTransaction(t.id)}
            style={{
              background: "red",
              color: "white",
              border: 0,
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            🗑 ลบ
          </button>
        </div>
      ))}
    </div>
  );
}