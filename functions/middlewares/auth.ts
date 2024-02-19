
import { getFirebaseToken, verifyFirebaseAuth } from "@hono/firebase-auth";

/// @ts-ignore
export const auth = async (c, next) => {
  let l: any;
  const firebaseAuth = verifyFirebaseAuth({
    projectId: c.env.FIREBASE_PROJECT_ID,
    firebaseEmulatorHost: "",
    keyStore: {
      get() {
        return l;
      },
      /// @ts-ignore
      put(e: any) {
        l = e;
      },
    },
  });

  try {
    /// @ts-ignore
    await firebaseAuth(c, () => {
      c.set("auth", getFirebaseToken(c));
    });

    return await next();
  } catch (e) {
    console.error("Unauthenticated Request");
    return c.json({ error: "Unauthenticated Request" }, 401);
  }
};