import liff from "@line/liff";

export async function initLiff() {
  console.log("Init LIFF...");

  await liff.init({
    liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
  });

  console.log("LIFF Ready");

  console.log("Logged In :", liff.isLoggedIn());

  if (!liff.isLoggedIn()) {
    console.log("Redirect Login");
    liff.login();
    return null;
  }

  const profile = await liff.getProfile();

  console.log(profile);

  return profile;
}