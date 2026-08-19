import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { PresensiMuridItem, PresensiAsatidzItem, BiodataAsatidz, BiodataMurid } from '../types';

/**
 * Standardized Generic CRUD Handlers for Firestore
 */

// 1. CREATE or OVERWRITE document
export async function createDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      id: docId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2. UPDATE existing document
export async function updateDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  partialData: Partial<T>
): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...partialData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 3. DELETE document
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. GET single document
export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as T;
    }
    return null;
  } catch (error: any) {
    if (error?.code === 'unavailable' || error?.message?.includes('offline') || error?.message?.includes('could not be completed')) {
      console.info(`Firestore document ${path} reading from cache/offline.`);
      return null;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// 5. GET all documents in a collection
export async function getCollection<T>(
  collectionName: string
): Promise<T[]> {
  const path = collectionName;
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
  } catch (error: any) {
    if (error?.code === 'unavailable' || error?.message?.includes('offline') || error?.message?.includes('could not be completed')) {
      console.info(`Firestore collection ${collectionName} reading from cache/offline.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 6. REALTIME SUBSCRIBE to collection
export function subscribeCollection<T>(
  collectionName: string,
  callback: (items: T[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = collectionName;
  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
      callback(items);
    },
    (error) => {
      if (error?.code === 'unavailable' || error?.message?.includes('offline') || error?.message?.includes('could not be completed')) {
        console.info(`Firestore listener on ${path} active in offline cache mode.`);
        return;
      }
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }
  );
}

// 7. REALTIME SUBSCRIBE to a single document
export function subscribeDocument<T>(
  collectionName: string,
  docId: string,
  callback: (item: T | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `${collectionName}/${docId}`;
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as unknown as T);
      } else {
        callback(null);
      }
    },
    (error) => {
      if (error?.code === 'unavailable' || error?.message?.includes('offline') || error?.message?.includes('could not be completed')) {
        console.info(`Firestore doc listener on ${path} active in offline cache mode.`);
        return;
      }
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }
  );
}

/**
 * High-Level Helpers for Madrasah Modules
 */

// Presensi Harian Record Interface
export interface DailyAttendanceRecord {
  id?: string;
  tanggal: string; // ISO date string (YYYY-MM-DD)
  tanggalFormat: string;
  murid: PresensiMuridItem[];
  asatidz: PresensiAsatidzItem[];
  totalMurid: number;
  totalHadirMurid: number;
  totalSakitMurid: number;
  totalIjinMurid: number;
  totalAlphaMurid: number;
  totalHadirAsatidz: number;
  updatedAt?: string;
  savedBy?: string;
}

// Save Daily Attendance to Firestore
export async function saveDailyAttendanceToFirestore(
  record: DailyAttendanceRecord
): Promise<void> {
  const docId = record.tanggal; // e.g. "2026-08-18"
  await createDocument('presensi_harian', docId, record);
}

// Get Daily Attendance from Firestore
export async function getDailyAttendanceFromFirestore(
  tanggalIso: string
): Promise<DailyAttendanceRecord | null> {
  return await getDocument<DailyAttendanceRecord>('presensi_harian', tanggalIso);
}

// Subscribe Daily Attendance in Real-time
export function subscribeDailyAttendanceFromFirestore(
  tanggalIso: string,
  callback: (record: DailyAttendanceRecord | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return subscribeDocument<DailyAttendanceRecord>('presensi_harian', tanggalIso, callback, onError);
}

// Generic Menu Record Interface for 18 Menu views
export interface MenuRecordItem<T = any> {
  id: string;
  menuKey: string;
  title: string;
  payload: T;
  updatedAt?: string;
}

// Save any Menu Record to Firestore (e.g. for Rapor, Keuangan, Tata Tertib, Kegiatan)
export async function saveMenuRecordToFirestore<T>(
  menuKey: string,
  recordId: string,
  title: string,
  payload: T
): Promise<void> {
  await createDocument<MenuRecordItem<T>>('menu_records', `${menuKey}_${recordId}`, {
    id: `${menuKey}_${recordId}`,
    menuKey,
    title,
    payload,
    updatedAt: new Date().toISOString()
  });
}

// Get Menu Record
export async function getMenuRecordFromFirestore<T>(
  menuKey: string,
  recordId: string
): Promise<MenuRecordItem<T> | null> {
  return await getDocument<MenuRecordItem<T>>('menu_records', `${menuKey}_${recordId}`);
}

// Subscribe Menu Records
export function subscribeMenuRecords<T>(
  menuKey: string,
  callback: (records: MenuRecordItem<T>[]) => void
): Unsubscribe {
  return subscribeCollection<MenuRecordItem<T>>('menu_records', (all) => {
    const filtered = all.filter(r => r.menuKey === menuKey);
    callback(filtered);
  });
}

/**
 * BIODATA ASATIDZ HELPERS
 */
export async function saveAsatidzToFirestore(asatidz: BiodataAsatidz): Promise<void> {
  const docId = asatidz.id || `ast_${Date.now()}`;
  await createDocument<BiodataAsatidz>('asatidz', docId, {
    ...asatidz,
    id: docId
  });
}

export async function deleteAsatidzFromFirestore(docId: string): Promise<void> {
  await deleteDocument('asatidz', docId);
}

export function subscribeAsatidzFromFirestore(
  callback: (list: BiodataAsatidz[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return subscribeCollection<BiodataAsatidz>('asatidz', callback, onError);
}

/**
 * BIODATA MURID / SANTRI HELPERS
 */
export async function saveMuridToFirestore(murid: BiodataMurid): Promise<void> {
  const docId = murid.id || `mrd_${Date.now()}`;
  await createDocument<BiodataMurid>('santri', docId, {
    ...murid,
    id: docId
  });
}

export async function deleteMuridFromFirestore(docId: string): Promise<void> {
  await deleteDocument('santri', docId);
}

export function subscribeMuridFromFirestore(
  callback: (list: BiodataMurid[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return subscribeCollection<BiodataMurid>('santri', callback, onError);
}

