import { addVisitor } from './modules/database.js';
import { createSignatureCanvasController } from './modules/signature-canvas.js';

const views = [...document.querySelectorAll('[data-view]')];
const form = document.querySelector('#guest-form');
const canvas = document.querySelector('#signature-canvas');
const signature = createSignatureCanvasController(canvas);
const placeholder = document.querySelector('#signature-placeholder');
const signatureError = document.querySelector('#signature-error');
const formStatus = document.querySelector('#form-status');
const submitButton = form.querySelector('[type="submit"]');
let isSaving = false;

function showView(name) {
  views.forEach((view) => { view.hidden = view.dataset.view !== name; });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'register') requestAnimationFrame(signature.resize);
}

document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.go)));
const placeholderLink = document.querySelector('[data-placeholder]');
if (placeholderLink) placeholderLink.addEventListener('click', (event) => {
  event.preventDefault();
  window.alert('Placeholder: URL materi pameran belum tersedia.');
});

form.querySelectorAll('[required]').forEach((input) => {
  input.addEventListener('input', () => {
    if (!input.value.trim()) return;
    input.removeAttribute('aria-invalid');
    input.parentElement.querySelector('.field-error').textContent = '';
  });
});

canvas.addEventListener('signaturechange', (event) => {
  placeholder.classList.toggle('is-hidden', event.detail.hasSignature);
  if (event.detail.hasSignature) signatureError.textContent = '';
});
window.addEventListener('resize', signature.resize);
document.querySelector('#clear-signature').addEventListener('click', () => {
  signature.clear();
  signatureError.textContent = '';
});

function createVisitorId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isSaving) return;

  let valid = true;
  form.querySelectorAll('[required]').forEach((input) => {
    const error = input.parentElement.querySelector('.field-error');
    const invalid = input.value.trim().length === 0;
    input.setAttribute('aria-invalid', String(invalid));
    error.textContent = invalid ? `${input.labels[0].textContent.replace('*', '').trim()} wajib diisi.` : '';
    valid &&= !invalid;
  });
  signatureError.textContent = signature.hasSignature ? '' : 'Tanda tangan wajib dibubuhkan.';
  if (!signature.hasSignature) valid = false;
  if (!valid) return;

  const formData = new FormData(form);
  const visitor = {
    id: createVisitorId(),
    name: String(formData.get('name')).trim(),
    position: String(formData.get('position')).trim(),
    nis: String(formData.get('nis')).trim(),
    signature: signature.toDataURL(),
    createdAt: new Date().toISOString(),
  };

  isSaving = true;
  submitButton.disabled = true;
  formStatus.textContent = 'Menyimpan data pengunjung…';
  formStatus.dataset.state = 'pending';
  try {
    await addVisitor(visitor);
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach((input) => input.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
    signature.clear();
    formStatus.textContent = '';
    delete formStatus.dataset.state;
    showView('success');
  } catch (error) {
    formStatus.textContent = 'Data belum berhasil disimpan. Periksa penyimpanan browser, lalu coba kirim kembali.';
    formStatus.dataset.state = 'error';
    console.error('Gagal menyimpan data pengunjung.', error);
  } finally {
    isSaving = false;
    submitButton.disabled = false;
  }
});

window.GuestbookApp = Object.freeze({ showView });
