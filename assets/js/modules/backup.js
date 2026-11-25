export const BACKUP_FORMAT = 'digital-guestbook-backup';
export const BACKUP_VERSION = 1;

export function validateBackup(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Isi file bukan objek backup yang valid.');
  if (value.format !== BACKUP_FORMAT) throw new Error('Jenis file tidak dikenali sebagai backup buku tamu.');
  if (value.version !== BACKUP_VERSION) throw new Error(`Versi backup ${String(value.version)} tidak didukung.`);
  if (!Array.isArray(value.visitors)) throw new Error('Daftar pengunjung tidak tersedia atau tidak lengkap.');
  if (typeof value.createdAt !== 'string' || !Number.isFinite(Date.parse(value.createdAt))) throw new Error('Waktu pembuatan backup tidak valid.');
  if (!Number.isInteger(value.visitorCount) || value.visitorCount !== value.visitors.length) throw new Error('Jumlah data pada backup tidak sesuai isi file.');
  const ids = new Set();
  const required = ['id', 'name', 'position', 'nis', 'signature', 'createdAt'];
  value.visitors.forEach((visitor, index) => {
    if (!visitor || typeof visitor !== 'object' || Array.isArray(visitor)) throw new Error(`Data pengunjung nomor ${index + 1} tidak valid.`);
    if (required.some((field) => !Object.hasOwn(visitor, field))) throw new Error(`Data pengunjung nomor ${index + 1} tidak lengkap.`);
    if ((typeof visitor.id !== 'string' && typeof visitor.id !== 'number') || visitor.id === '') throw new Error(`ID pengunjung nomor ${index + 1} tidak valid.`);
    if (ids.has(visitor.id)) throw new Error(`ID pengunjung berulang ditemukan pada data nomor ${index + 1}.`);
    ids.add(visitor.id);
    if (typeof visitor.name !== 'string' || typeof visitor.position !== 'string' || typeof visitor.nis !== 'string'
      || typeof visitor.signature !== 'string' || typeof visitor.createdAt !== 'string'
      || !Number.isFinite(Date.parse(visitor.createdAt))) throw new Error(`Isi data pengunjung nomor ${index + 1} tidak sesuai format.`);
    if (visitor.signature && !/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/]+={0,2}$/.test(visitor.signature)) {
      throw new Error(`Tanda tangan pengunjung nomor ${index + 1} tidak valid.`);
    }
  });
  return value.visitors;
}

export function createBackup(visitors, createdAt = new Date().toISOString()) {
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, createdAt, visitorCount: visitors.length, visitors };
}
