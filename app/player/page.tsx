"use client";

import { useEffect } from "react";
import { initLiff } from "../../lib/liff";

export default function PlayerPage() {
  useEffect(() => {
    async function run() {
      const profile = await initLiff();

      console.log("PROFILE =", profile);

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

      console.log("STATUS =", res.status);

      const text = await res.text();

      console.log("RAW RESPONSE =", text);

      alert(text);
    }

    run();
  }, []);

  return <h1>Loading...</h1>;
}