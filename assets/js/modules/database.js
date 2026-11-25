import { APP_CONFIG } from '../config.js';

/** Error raised by the guestbook persistence API. */
export class GuestbookDatabaseError extends Error {
  constructor(message, operation, cause) {
    super(message, { cause });
    this.name = 'GuestbookDatabaseError';
    this.operation = operation;
  }
}

/** Opens the IndexedDB boundary used by the application. */
export function openGuestbookDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new GuestbookDatabaseError('IndexedDB tidak tersedia pada browser ini.', 'open'));
      return;
    }

    let request;
    try {
      request = window.indexedDB.open(APP_CONFIG.databaseName, APP_CONFIG.databaseVersion);
    } catch (error) {
      reject(new GuestbookDatabaseError('Gagal meminta pembukaan database.', 'open', error));
      return;
    }

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(APP_CONFIG.visitorStoreName)) {
        database.createObjectStore(APP_CONFIG.visitorStoreName, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => database.close();
      resolve(database);
    };
    request.onerror = () => reject(new GuestbookDatabaseError(
      'Gagal membuka database buku tamu.', 'open', request.error,
    ));
    request.onblocked = () => reject(new GuestbookDatabaseError(
      'Pembukaan database tertahan oleh tab lain yang masih memakai versi lama.', 'open', request.error,
    ));
  });
}

function validateVisitor(visitor, operation) {
  if (!visitor || typeof visitor !== 'object' || Array.isArray(visitor) || visitor.id === undefined || visitor.id === null) {
    throw new GuestbookDatabaseError('Data pengunjung harus berupa objek dengan field id.', operation);
  }
}

function validateId(id, operation) {
  if (id === undefined || id === null || id === '') {
    throw new GuestbookDatabaseError('ID pengunjung wajib diisi.', operation);
  }
}

function runRequest(operation, mode, issueRequest) {
  return openGuestbookDatabase().then((database) => new Promise((resolve, reject) => {
    let transaction;
    let request;
    let result;
    let failed = false;
    const fail = (message, cause) => {
      if (failed) return;
      failed = true;
      database.close();
      reject(new GuestbookDatabaseError(message, operation, cause));
    };

    try {
      transaction = database.transaction(APP_CONFIG.visitorStoreName, mode);
      request = issueRequest(transaction.objectStore(APP_CONFIG.visitorStoreName));
    } catch (error) {
      database.close();
      fail('Gagal memulai transaksi database.', error);
      return;
    }

    request.onsuccess = () => { result = request.result; };
    request.onerror = () => fail('Operasi data pengunjung gagal.', request.error);
    transaction.oncomplete = () => {
      database.close();
      if (!failed) resolve(result);
    };
    transaction.onerror = () => fail('Transaksi database gagal.', transaction.error);
    transaction.onabort = () => fail('Transaksi database dibatalkan.', transaction.error);
  }));
}

/** Adds a visitor record and returns its id. Duplicate ids reject. */
export function addVisitor(visitor) {
  validateVisitor(visitor, 'add');
  return runRequest('add', 'readwrite', (store) => store.add(visitor));
}

/** Atomically inserts visitors; optionally skips IDs already in the store. */
export function addVisitorsSafely(visitors, { skipExisting = false } = {}) {
  if (!Array.isArray(visitors)) throw new GuestbookDatabaseError('Data impor harus berupa daftar pengunjung.', 'addMany');
  visitors.forEach((visitor) => validateVisitor(visitor, 'addMany'));
  const ids = new Set();
  for (const visitor of visitors) {
    if (ids.has(visitor.id)) throw new GuestbookDatabaseError('File backup memuat ID pengunjung yang berulang.', 'addMany');
    ids.add(visitor.id);
  }
  return openGuestbookDatabase().then((database) => new Promise((resolve, reject) => {
    let transaction;
    let failed = false;
    const fail = (message, cause) => {
      if (failed) return;
      failed = true;
      try { transaction?.abort(); } catch { /* transaction may already be finished */ }
      database.close();
      reject(new GuestbookDatabaseError(message, 'addMany', cause));
    };
    try {
      transaction = database.transaction(APP_CONFIG.visitorStoreName, 'readwrite');
      const store = transaction.objectStore(APP_CONFIG.visitorStoreName);
      const result = { added: 0, skipped: 0 };
      // Queue all key checks before any writes; transaction serialization makes
      // the check-and-add operation atomic relative to other database writers.
      for (const visitor of visitors) {
        const check = store.getKey(visitor.id);
        check.onsuccess = () => {
          if (failed) return;
          if (check.result !== undefined) {
            if (!skipExisting) { fail('ID bertabrakan dengan data yang sudah ada.', check.result); return; }
            result.skipped += 1;
          } else {
            const add = store.add(visitor);
            add.onsuccess = () => { result.added += 1; };
            add.onerror = () => fail('Gagal menambahkan data impor.', add.error);
          }
        };
        check.onerror = () => fail('Gagal memeriksa ID yang sudah ada.', check.error);
      }
      transaction.oncomplete = () => { database.close(); if (!failed) resolve(result); };
      transaction.onerror = () => fail('Transaksi pemulihan gagal; tidak ada perubahan yang disimpan.', transaction.error);
      transaction.onabort = () => fail('Transaksi pemulihan dibatalkan; tidak ada perubahan yang disimpan.', transaction.error);
    } catch (error) {
      database.close();
      reject(new GuestbookDatabaseError('Gagal memulai transaksi pemulihan.', 'addMany', error));
    }
  }));
}

/** Returns every visitor record as an array. */
export function getAllVisitors() {
  return runRequest('getAll', 'readonly', (store) => store.getAll());
}

/** Returns a visitor record, or undefined when the id does not exist. */
export function getVisitorById(id) {
  validateId(id, 'get');
  return runRequest('get', 'readonly', (store) => store.get(id));
}

/** Replaces a visitor record with the same id and returns its id. */
export function updateVisitor(visitor) {
  validateVisitor(visitor, 'update');
  return runRequest('update', 'readwrite', (store) => store.put(visitor));
}

/** Deletes a visitor record; deleting an unknown id succeeds without effect. */
export function deleteVisitor(id) {
  validateId(id, 'delete');
  return runRequest('delete', 'readwrite', (store) => store.delete(id));
}
