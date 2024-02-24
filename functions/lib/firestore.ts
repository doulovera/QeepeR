import type { Context } from "hono";
import type { HonoContext, WranglerEnv } from ".."

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

export const createQrInfoDB = async (c: Context<HonoContext>, qrInfo: QrInfo) => {
  const { key, destinationUrl } = qrInfo;

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
  await addQrToUserListDB(c, key);

  return response;
}

export const getUserQrInfoDB = async (c: Context<HonoContext>, key: string) => {}

export const getUserQrListDB = async (c: Context<HonoContext>) => {}

export const addQrToUserListDB = async (c: Context<HonoContext>, key: string) => {
  const uid = c.get('auth')?.uid

  if (!uid) {
    throw new Error('Unauthorized');
  }

  const response = await Firestore.set(await db(c.env, uid), `users/${uid}/qrs/${key}`, { qr: `/qrs/${key}` });

  return response;
}

export const validateUserQrDB = async (c: Context<HonoContext>) => {}
