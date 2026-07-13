"use client";

import { useEffect, useState } from "react";
import { initLiff } from "../../lib/liff";

export default function PlayerPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const p = await initLiff();

      if (p) {
        setProfile(p);
      }
    }

    load();
  }, []);

  if (!profile) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: 30 }}>

      <h1>DONK CLUB</h1>

      <img
        src={profile.pictureUrl}
        width={100}
        style={{ borderRadius: "50%" }}
      />

      <h2>{profile.displayName}</h2>

      <p>{profile.userId}</p>

    </div>
  );
}