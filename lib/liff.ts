import liff from "@line/liff";

export async function initLiff() {
  await liff.init({
    liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
  });

  console.log("CURRENT URL =", window.location.href);

  console.log("LIFF URL =", liff.permanentLink.createUrl());

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  return await liff.getProfile();
}