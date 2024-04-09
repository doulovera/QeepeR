import type { Context } from "hono";
import type { HonoContext, WranglerEnv } from "../types";

import * as Firestore from 'fireworkers';
import { DocumentList, QrObject } from "../types/firestore";
import ApplicationError from "./error";
import { API_RESPONSE } from "../constants/errors";

/// TODO: Transform into class

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

export const getQrInfoByKey = async (c: Context<HonoContext>, key: string) => {
  const uid = c.get('auth')?.uid

  if (!uid) {
    throw new ApplicationError(API_RESPONSE.UNAUTHORIZED.TITLE, API_RESPONSE.UNAUTHORIZED.MESSAGE, 401);
  }

  const qrInfo = await Firestore.get<QrObject>(await db(c.env, uid), `qrs/${key}`);

  if (!qrInfo.fields.user) {
    return null; 
  }

  if (qrInfo.fields.user !== `/users/${uid}`) {
    throw new ApplicationError(API_RESPONSE.UNAUTHORIZED.TITLE, API_RESPONSE.UNAUTHORIZED.MESSAGE, 401);
  }

  return qrInfo.fields;
}

export const createQrInfoDB = async (c: Context<HonoContext>, qrInfo: QrInfo) => {
  const { key, destinationUrl } = qrInfo;

  const uid = c.get('auth')?.uid

  if (!uid) {
    throw new ApplicationError(API_RESPONSE.UNAUTHORIZED.TITLE, API_RESPONSE.UNAUTHORIZED.MESSAGE, 401);
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

export const getUserQrListDB = async (c: Context<HonoContext>) => {
  const uid = c.get('auth')?.uid
  
  if (!uid) {
    throw new ApplicationError(API_RESPONSE.UNAUTHORIZED.TITLE, API_RESPONSE.UNAUTHORIZED.MESSAGE, 401);
  }

  const fetchedQrs = await Firestore.query<QrObject>(await db(c.env, uid), {
    from: [{ collectionId: 'qrs' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'user' },
        op: 'EQUAL',
        value: { stringValue: `/users/${uid}` }
      }
    }
  })

  const mappedQrs = fetchedQrs.map(({ createTime, id, fields }) => ({
    id,
    createdAt: createTime,
    disabled: fields.disabled,
    destinationUrl: fields.destinationUrl,
  }))

  return mappedQrs
}

export const addQrToUserListDB = async (c: Context<HonoContext>, key: string) => {
  const uid = c.get('auth')?.uid

  if (!uid) {
    throw new Error('Unauthorized');
  }

  const response = await Firestore.set(await db(c.env, uid), `users/${uid}/qrs/${key}`, { qr: `/qrs/${key}` });

  return response;
}

export const validateUserQrDB = async (c: Context<HonoContext>, key: string) => {
  const uid = c.get('auth')?.uid

  if (!uid) {
    throw new ApplicationError(API_RESPONSE.UNAUTHORIZED.TITLE, API_RESPONSE.UNAUTHORIZED.MESSAGE, 401);
  }

  const userInfo = await Firestore.get(await db(c.env, uid), `users/${uid}/qrs`) as unknown as DocumentList<{ qr: { stringValue: string } }>

  const mappedList = userInfo.documents.map(({ name }) => name.split('/').at(-1));

  if (!mappedList.includes(key)) {
    throw new ApplicationError(API_RESPONSE.NOT_FOUND.TITLE, 'This QR code is not associated with your account', 404);
  }

  return true;  
}

type UpdateQrDBResponse = {
  createTime?: unknown | string,
  updateTime?: unknown | string,
  id: string,
  fields: Partial<QrObject>
}
export const updateQrDB = async (c: Context<HonoContext>, key: string, properties: Partial<QrObject>): Promise<UpdateQrDBResponse> => {
  await validateUserQrDB(c, key);

  const response = await Firestore.update(await db(c.env, c.get('auth')?.uid), `qrs/${key}`, properties);
  return response;  
}

export const getUserQrKeys = async (c: Context<HonoContext>) => {
  const uid = c.get('auth')?.uid

  if (!uid) {
    throw new ApplicationError(API_RESPONSE.UNAUTHORIZED.TITLE, API_RESPONSE.UNAUTHORIZED.MESSAGE, 401);
  }

  const userInfo = await Firestore.get(await db(c.env, uid), `users/${uid}/qrs`) as unknown as DocumentList<{ qr: { stringValue: string } }>
  const sortedList = userInfo.documents.toSorted((a,b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime())

  const mappedList = sortedList.map(({ name }) => name.split('/').at(-1))
  return mappedList;
}