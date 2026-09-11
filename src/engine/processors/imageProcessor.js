/**
 * FYLORA — Image Processor
 * Client-side image processing using Canvas API.
 * Supports: format conversion, compression, resize, crop, rotate.
 */

/**
 * Load an image file into an HTMLImageElement
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Get MIME type from extension
 */
function getMimeFromExt(ext) {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
  };
  return map[ext.toLowerCase()] || 'image/png';
}

/**
 * Get extension from MIME type
 */
function getExtFromMime(mime) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
  };
  return map[mime] || '.png';
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(canvas, mimeType, quality = 0.92) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      mimeType,
      quality
    );
  });
}

/**
 * Convert image format
 * @param {File} file - Input image file
 * @param {string} outputFormat - Target format extension (e.g., '.png', '.jpg', '.webp')
 * @param {object} options - Additional options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{blob: Blob, filename: string}>}
 */
export async function convertImage(file, outputFormat, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const img = await loadImage(file);
  onProgress?.({ step: 'converting', progress: 40 });
  
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  
  // For JPG output, fill with white background (no transparency)
  if (outputFormat === '.jpg' || outputFormat === '.jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(img, 0, 0);
  onProgress?.({ step: 'optimizing', progress: 70 });
  
  const mimeType = getMimeFromExt(outputFormat);
  const quality = options.quality || 0.92;
  const blob = await canvasToBlob(canvas, mimeType, quality);
  
  const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
  const filename = `${baseName}${outputFormat}`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType };
}

/**
 * Compress image
 * @param {File} file - Input image file
 * @param {object} options - Compression options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{blob: Blob, filename: string, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const img = await loadImage(file);
  onProgress?.({ step: 'converting', progress: 30 });
  
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  
  // Apply max dimensions if specified
  if (options.maxWidth && width > options.maxWidth) {
    height = Math.round(height * (options.maxWidth / width));
    width = options.maxWidth;
  }
  if (options.maxHeight && height > options.maxHeight) {
    width = Math.round(width * (options.maxHeight / height));
    height = options.maxHeight;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Quality levels
  const qualityMap = {
    maximum: 0.4,
    recommended: 0.7,
    high: 0.85,
  };
  
  const quality = options.quality || qualityMap[options.level] || 0.7;
  
  // For max compression, use JPG
  let outputMime = file.type || 'image/jpeg';
  if (options.level === 'maximum') {
    outputMime = 'image/jpeg';
  }
  if (options.outputFormat) {
    outputMime = getMimeFromExt(options.outputFormat);
  }
  
  if (outputMime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(img, 0, 0, width, height);
  onProgress?.({ step: 'optimizing', progress: 70 });
  
  const blob = await canvasToBlob(canvas, outputMime, quality);
  
  const ext = getExtFromMime(outputMime);
  const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
  const filename = `${baseName}_compressed${ext}`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return {
    blob,
    filename,
    mimeType: outputMime,
    originalSize: file.size,
    compressedSize: blob.size,
    savedPercent: Math.round((1 - blob.size / file.size) * 100),
  };
}

/**
 * Resize image
 * @param {File} file - Input image file
 * @param {object} options - { width, height, maintainAspectRatio }
 * @param {Function} onProgress - Progress callback
 */
export async function resizeImage(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const img = await loadImage(file);
  onProgress?.({ step: 'converting', progress: 40 });
  
  let width = options.width || img.naturalWidth;
  let height = options.height || img.naturalHeight;
  
  if (options.maintainAspectRatio !== false) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (options.width && !options.height) {
      height = Math.round(width / ratio);
    } else if (options.height && !options.width) {
      width = Math.round(height * ratio);
    }
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  const mime = file.type || 'image/png';
  if (mime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(img, 0, 0, width, height);
  onProgress?.({ step: 'optimizing', progress: 70 });
  
  const blob = await canvasToBlob(canvas, mime, 0.92);
  
  const ext = getExtFromMime(mime);
  const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
  const filename = `${baseName}_${width}x${height}${ext}`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: mime, width, height };
}

/**
 * Rotate image
 * @param {File} file - Input image file
 * @param {object} options - { degrees: 90 | 180 | 270 }
 * @param {Function} onProgress - Progress callback
 */
export async function rotateImage(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const img = await loadImage(file);
  onProgress?.({ step: 'converting', progress: 40 });
  
  const degrees = options.degrees || 90;
  const radians = (degrees * Math.PI) / 180;
  
  const canvas = document.createElement('canvas');
  
  if (degrees === 90 || degrees === 270) {
    canvas.width = img.naturalHeight;
    canvas.height = img.naturalWidth;
  } else {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  }
  
  const ctx = canvas.getContext('2d');
  
  const mime = file.type || 'image/png';
  if (mime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  
  onProgress?.({ step: 'optimizing', progress: 70 });
  
  const blob = await canvasToBlob(canvas, mime, 0.92);
  
  const ext = getExtFromMime(mime);
  const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
  const filename = `${baseName}_rotated${ext}`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: mime };
}

/**
 * Crop image
 * @param {File} file - Input image file
 * @param {object} options - { x, y, width, height } in pixels
 * @param {Function} onProgress - Progress callback
 */
export async function cropImage(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const img = await loadImage(file);
  onProgress?.({ step: 'converting', progress: 40 });
  
  const sx = options.x || 0;
  const sy = options.y || 0;
  const sw = options.width || img.naturalWidth;
  const sh = options.height || img.naturalHeight;
  
  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;
  
  const ctx = canvas.getContext('2d');
  
  const mime = file.type || 'image/png';
  if (mime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  
  onProgress?.({ step: 'optimizing', progress: 70 });
  
  const blob = await canvasToBlob(canvas, mime, 0.92);
  
  const ext = getExtFromMime(mime);
  const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
  const filename = `${baseName}_cropped${ext}`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: mime };
}

/**
 * Convert image to PDF
 * @param {File} file - Input image file
 * @param {object} options - Options
 * @param {Function} onProgress - Progress callback
 */
export async function imageToPdf(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  // Dynamic import pdf-lib
  const { PDFDocument } = await import('pdf-lib');
  
  const img = await loadImage(file);
  onProgress?.({ step: 'converting', progress: 30 });
  
  // Convert to JPG or PNG bytes
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  
  const jpgBlob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
  const arrayBuffer = await jpgBlob.arrayBuffer();
  
  onProgress?.({ step: 'optimizing', progress: 60 });
  
  const pdfDoc = await PDFDocument.create();
  const jpgImage = await pdfDoc.embedJpg(arrayBuffer);
  
  const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: jpgImage.width,
    height: jpgImage.height,
  });
  
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
  const filename = `${baseName}.pdf`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: 'application/pdf' };
}
