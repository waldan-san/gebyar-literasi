import { getAllVisitors, deleteVisitor, addVisitorsSafely } from './modules/database.js';
import { createBackup, validateBackup } from './modules/backup.js';

const count = document.querySelector('#visitor-count');
const search = document.querySelector('#visitor-search');
const list = document.querySelector('#visitor-list');
const message = document.querySelector('#admin-message');
let visitors = [];
let pendingRestore = null;
const backupStatus = document.querySelector('#backup-status');
const restoreOptions = document.querySelector('#restore-options');
const restoreButton = document.querySelector('#restore-backup');

function setBackupStatus(text, isError = false) {
  backupStatus.textContent = text;
  backupStatus.dataset.state = isError ? 'error' : 'success';
}

document.querySelector('#export-backup').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  setBackupStatus('Menyiapkan backup…');
  try {
    const all = await getAllVisitors();
    const backup = createBackup(all);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const text = await blob.text();
    const verified = validateBackup(JSON.parse(text));
    if (verified.length !== all.length || verified.some((record, index) => record.signature !== all[index].signature)) {
      throw new Error('Pemeriksaan ulang backup tidak cocok dengan data sumber.');
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guestbook-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupStatus(`Backup ${all.length} data sudah dibentuk dan dibaca ulang. Unduhan dimulai; pastikan file muncul di folder unduhan.`);
  } catch (error) {
    setBackupStatus(`Backup gagal: ${error.message || 'data tidak dapat dibaca.'}`, true);
  } finally { button.disabled = false; }
});

document.querySelector('#backup-file').addEventListener('change', async (event) => {
  const file = event.currentTarget.files[0];
  pendingRestore = null;
  restoreOptions.hidden = true;
  restoreButton.disabled = true;
  if (!file) return;
  try {
    const content = await file.text();
    const records = validateBackup(JSON.parse(content));
    const existingIds = new Set((await getAllVisitors()).map((record) => record.id));
    const collisions = records.filter((record) => existingIds.has(record.id)).length;
    pendingRestore = records;
    document.querySelector('#restore-summary').textContent = `File valid: ${records.length} data pengunjung. ${collisions} ID sudah ada di perangkat ini. Tanda tangan termasuk dalam pemulihan.`;
    restoreOptions.hidden = false;
    restoreButton.disabled = false;
    setBackupStatus(`File “${file.name}” lolos validasi dan belum mengubah data.`);
  } catch (error) {
    setBackupStatus(`File tidak dapat dipulihkan: ${error.message || 'format file tidak valid.'}`, true);
  }
});

restoreButton.addEventListener('click', async () => {
  if (!pendingRestore) return;
  const policy = document.querySelector('input[name="conflict-policy"]:checked').value;
  let existing;
  try { existing = await getAllVisitors(); } catch (error) {
    setBackupStatus(`Data perangkat gagal diperiksa: ${error.message || 'database tidak dapat dibaca.'}`, true);
    return;
  }
  const existingIds = new Set(existing.map((record) => record.id));
  const collisions = pendingRestore.filter((record) => existingIds.has(record.id)).length;
  if (policy === 'abort' && collisions) {
    setBackupStatus(`Pemulihan dibatalkan: ${collisions} ID bertabrakan. Tidak ada data yang diubah. Pilih opsi lewati benturan jika ingin menambahkan data lain.`, true);
    return;
  }
  const toAdd = pendingRestore.length;
  const action = policy === 'skip' ? `Tambahkan ${toAdd - collisions} data dan lewati ${collisions} benturan` : `Pulihkan ${toAdd} data`;
  if (!window.confirm(`${action}? Data yang sudah ada tidak akan ditimpa atau dihapus.`)) return;
  restoreButton.disabled = true;
  try {
    const result = await addVisitorsSafely(pendingRestore, { skipExisting: policy === 'skip' });
    pendingRestore = null;
    document.querySelector('#backup-file').value = '';
    restoreOptions.hidden = true;
    await loadVisitors();
    setBackupStatus(`Pemulihan selesai: ${result.added} data ditambahkan, ${result.skipped} dilewati. Data lama tetap utuh.`);
  } catch (error) {
    setBackupStatus(`Pemulihan gagal tanpa menyimpan perubahan sebagian: ${error.message || 'transaksi database gagal.'}`, true);
    restoreButton.disabled = false;
  }
});

function addText(parent, tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function formatDate(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Waktu tidak tersedia';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function render() {
  const query = search.value.trim().toLocaleLowerCase('id-ID');
  const filtered = visitors.filter((visitor) => String(visitor.name ?? '').toLocaleLowerCase('id-ID').includes(query));
  count.textContent = String(visitors.length);
  list.replaceChildren();
  if (!visitors.length) {
    message.textContent = 'Belum ada data pengunjung. Data baru akan muncul setelah formulir buku tamu diisi.';
    message.hidden = false;
    return;
  }
  if (!filtered.length) {
    message.textContent = 'Nama pengunjung tidak ditemukan. Coba kata kunci lain.';
    message.hidden = false;
    return;
  }
  message.hidden = true;
  filtered.forEach((visitor) => {
    const article = document.createElement('article');
    article.className = 'visitor-row';
    const summary = document.createElement('div');
    summary.className = 'visitor-summary';
    const identity = document.createElement('div');
    addText(identity, 'h2', 'visitor-name', visitor.name || 'Nama tidak tersedia');
    addText(identity, 'p', 'visitor-meta', `${visitor.position || 'Jabatan/Kelas tidak tersedia'} · ${formatDate(visitor.createdAt)}`);
    summary.append(identity);
    const actions = document.createElement('div');
    actions.className = 'visitor-actions';
    const details = document.createElement('button');
    details.type = 'button';
    details.className = 'button button-text';
    details.textContent = 'Lihat detail';
    actions.append(details);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button button-text button-danger';
    remove.textContent = 'Hapus';
    actions.append(remove);
    summary.append(actions);
    const detail = document.createElement('div');
    detail.className = 'visitor-detail';
    detail.hidden = true;
    const fields = document.createElement('dl');
    [['Nama', visitor.name], ['Jabatan / Kelas', visitor.position], ['NIS', visitor.nis || '—'], ['Waktu pencatatan', formatDate(visitor.createdAt)], ['ID', visitor.id]].forEach(([label, value]) => {
      addText(fields, 'dt', '', label);
      addText(fields, 'dd', '', String(value ?? '—'));
    });
    detail.append(fields);
    if (visitor.signature) {
      const signatureLabel = addText(detail, 'p', 'signature-label', 'Tanda tangan');
      signatureLabel.id = `signature-${String(visitor.id).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
      const image = document.createElement('img');
      image.className = 'visitor-signature';
      image.src = visitor.signature;
      image.alt = `Tanda tangan ${visitor.name || 'pengunjung'}`;
      detail.append(image);
    } else addText(detail, 'p', 'visitor-meta', 'Tanda tangan tidak tersedia.');
    details.setAttribute('aria-expanded', 'false');
    details.addEventListener('click', () => {
      detail.hidden = !detail.hidden;
      details.setAttribute('aria-expanded', String(!detail.hidden));
      details.textContent = detail.hidden ? 'Lihat detail' : 'Tutup detail';
    });
    remove.addEventListener('click', async () => {
      if (!window.confirm(`Hapus data pengunjung “${visitor.name || 'tanpa nama'}”? Tindakan ini tidak dapat dibatalkan.`)) return;
      remove.disabled = true;
      try {
        await deleteVisitor(visitor.id);
        visitors = visitors.filter((item) => item.id !== visitor.id);
        render();
      } catch (error) {
        message.hidden = false;
        message.textContent = 'Data gagal dihapus. Penyimpanan browser mungkin tidak tersedia; muat ulang lalu coba lagi.';
        console.error('Gagal menghapus data pengunjung.', error);
        remove.disabled = false;
      }
    });
    article.append(summary, detail);
    list.append(article);
  });
}

async function loadVisitors() {
  message.hidden = false;
  message.textContent = 'Memuat data pengunjung…';
  try {
    visitors = await getAllVisitors();
    visitors.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    render();
  } catch (error) {
    count.textContent = '—';
    list.replaceChildren();
    message.hidden = false;
    message.textContent = 'Data pengunjung gagal dibaca. Pastikan halaman dibuka pada browser yang sama dengan buku tamu dan IndexedDB tersedia, lalu coba muat ulang.';
    console.error('Gagal membaca database pengunjung.', error);
  }
}

search.addEventListener('input', render);
document.querySelector('#refresh-visitors').addEventListener('click', loadVisitors);
loadVisitors();
