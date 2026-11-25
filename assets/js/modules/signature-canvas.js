/** Canvas API boundary for drawing, clearing, and serializing a visitor signature. */
export function createSignatureCanvasController(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError('Canvas tanda tangan harus berupa HTMLCanvasElement.');
  }

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D tidak tersedia pada browser ini.');
  }

  let hasSignature = false;
  let drawing = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const previous = hasSignature ? canvas.toDataURL('image/png') : '';
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.strokeStyle = '#344638';
    context.fillStyle = '#344638';
    context.lineWidth = 2.2;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    if (previous) {
      const image = new Image();
      image.onload = () => context.drawImage(image, 0, 0, rect.width, rect.height);
      image.src = previous;
    }
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    // Render a small dot too, so a tap or single click is a visible signature.
    context.arc(point.x, point.y, context.lineWidth / 2, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(point.x, point.y);
    hasSignature = true;
    canvas.dispatchEvent(new CustomEvent('signaturechange', { detail: { hasSignature } }));
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!drawing) return;
    event.preventDefault();
    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  });

  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => {
    canvas.addEventListener(name, () => { drawing = false; });
  });

  function clear() {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    hasSignature = false;
    drawing = false;
    canvas.dispatchEvent(new CustomEvent('signaturechange', { detail: { hasSignature } }));
  }

  function toDataURL() {
    return hasSignature ? canvas.toDataURL('image/png') : '';
  }

  resize();
  return Object.freeze({ canvas, context, resize, clear, toDataURL, get hasSignature() { return hasSignature; } });
}
