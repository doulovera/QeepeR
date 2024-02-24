import type { WranglerEnv } from ".."

import * as Firestore from 'fireworkers';

const db = async (env: WranglerEnv, uid: string) => await Firestore.init({
  uid,
  project_id: env.FIREBASE_PROJECT_ID,
  client_email: env.FIREBASE_CLIENT_EMAIL,
  private_key: env.FIREBASE_PRIVATE_KEY,
  private_key_id: env.FIREBASE_PRIVATE_KEYID
});

type QrInfo = {
  key: string,
  destinationUrl: string,
}

export const createQrInfoDB = async (c: { get: () => void, env: WranglerEnv }, qrInfo: QrInfo) => {
  const { key, destinationUrl } = qrInfo;

  /// @ts-ignore ** TODO **
  const uid = c.get('auth')?.uid

  if (!uid) {
    throw new Error('Unauthorized');
  }

  const docObj = {
    destinationUrl,
    disabled: false,
    created: new Date().toISOString(),
    user: `/users/${uid}`,
  }

  const response = await Firestore.set(await db(c.env, uid), `qrs/${key}`, docObj);

  return response;
}