import liff from "@line/liff";

export async function initLiff() {
  try {
    alert("LIFF START");

    await liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
    });

    alert("INIT OK");

    alert("LOGIN = " + liff.isLoggedIn());

    if (!liff.isLoggedIn()) {
      alert("GO LOGIN");
      liff.login();
      return null;
    }

    const profile = await liff.getProfile();

    alert("DISPLAY = " + profile.displayName);
    alert("USERID = " + profile.userId);

    console.log(profile);

    return profile;
  } catch (e) {
    console.error(e);
    alert("ERROR : " + String(e));
    return null;
  }
}