/**
 * FYLORA — File Detector
 * Detects file type from MIME type, extension, and magic bytes.
 * Returns metadata and available operations for the detected file.
 */

import { getToolsForFormat } from './registry';

const MIME_MAP = {
  'application/pdf': { type: 'PDF Document', ext: '.pdf', category: 'pdf', icon: 'FileText', color: '#ef4444' },
  'application/msword': { type: 'Word Document', ext: '.doc', category: 'documents', icon: 'FileType', color: '#2563eb' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'Word Document', ext: '.docx', category: 'documents', icon: 'FileType', color: '#2563eb' },
  'application/vnd.ms-excel': { type: 'Excel Spreadsheet', ext: '.xls', category: 'spreadsheets', icon: 'Table', color: '#16a34a' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { type: 'Excel Spreadsheet', ext: '.xlsx', category: 'spreadsheets', icon: 'Table', color: '#16a34a' },
  'application/vnd.ms-powerpoint': { type: 'PowerPoint Presentation', ext: '.ppt', category: 'presentations', icon: 'Presentation', color: '#ea580c' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { type: 'PowerPoint Presentation', ext: '.pptx', category: 'presentations', icon: 'Presentation', color: '#ea580c' },
  'image/jpeg': { type: 'JPEG Image', ext: '.jpg', category: 'images', icon: 'Image', color: '#8b5cf6' },
  'image/png': { type: 'PNG Image', ext: '.png', category: 'images', icon: 'Image', color: '#8b5cf6' },
  'image/webp': { type: 'WebP Image', ext: '.webp', category: 'images', icon: 'Image', color: '#8b5cf6' },
  'image/gif': { type: 'GIF Image', ext: '.gif', category: 'images', icon: 'Image', color: '#8b5cf6' },
  'image/bmp': { type: 'BMP Image', ext: '.bmp', category: 'images', icon: 'Image', color: '#8b5cf6' },
  'image/svg+xml': { type: 'SVG Image', ext: '.svg', category: 'images', icon: 'Image', color: '#8b5cf6' },
  'image/heic': { type: 'HEIC Image', ext: '.heic', category: 'images', icon: 'Image', color: '#8b5cf6' },
  'text/plain': { type: 'Text File', ext: '.txt', category: 'documents', icon: 'FileType', color: '#64748b' },
  'text/csv': { type: 'CSV File', ext: '.csv', category: 'spreadsheets', icon: 'FileSpreadsheet', color: '#0d9488' },
  'text/html': { type: 'HTML File', ext: '.html', category: 'documents', icon: 'Code', color: '#ea580c' },
  'application/rtf': { type: 'RTF Document', ext: '.rtf', category: 'documents', icon: 'FileType', color: '#64748b' },
  'application/zip': { type: 'ZIP Archive', ext: '.zip', category: 'compression', icon: 'Archive', color: '#ca8a04' },
};

const EXT_MAP = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  '.heic': 'image/heic',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.html': 'text/html',
  '.rtf': 'application/rtf',
  '.zip': 'application/zip',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
};

/**
 * Get file extension from filename
 */
function getExtension(filename) {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) return '';
  return filename.substring(dotIndex).toLowerCase();
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}

/**
 * Detect file type and return metadata + available operations
 */
export function detectFile(file) {
  const ext = getExtension(file.name);
  const mime = file.type || EXT_MAP[ext] || 'application/octet-stream';
  const info = MIME_MAP[mime] || MIME_MAP[EXT_MAP[ext]] || {
    type: 'Unknown File',
    ext: ext,
    category: 'unknown',
    icon: 'File',
    color: '#64748b',
  };

  const availableTools = getToolsForFormat(ext);

  return {
    file,
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    mime,
    extension: ext,
    type: info.type,
    category: info.category,
    icon: info.icon,
    color: info.color,
    availableTools,
    lastModified: file.lastModified ? new Date(file.lastModified) : null,
  };
}

/**
 * Get format badge CSS class from extension
 */
export function getFormatBadgeClass(ext) {
  const map = {
    '.pdf': 'format-badge-pdf',
    '.doc': 'format-badge-doc',
    '.docx': 'format-badge-doc',
    '.xls': 'format-badge-xls',
    '.xlsx': 'format-badge-xls',
    '.ppt': 'format-badge-ppt',
    '.pptx': 'format-badge-ppt',
    '.jpg': 'format-badge-img',
    '.jpeg': 'format-badge-img',
    '.png': 'format-badge-img',
    '.webp': 'format-badge-img',
    '.gif': 'format-badge-img',
    '.txt': 'format-badge-txt',
    '.csv': 'format-badge-csv',
  };
  return map[ext?.toLowerCase()] || 'format-badge-txt';
}

/**
 * Check if file is an image
 */
export function isImage(file) {
  return file.type?.startsWith('image/') || ['.jpg','.jpeg','.png','.webp','.gif','.bmp','.svg'].includes(getExtension(file.name));
}

/**
 * Check if file is a PDF
 */
export function isPdf(file) {
  return file.type === 'application/pdf' || getExtension(file.name) === '.pdf';
}

/**
 * Create a preview URL for a file
 */
export function createPreviewUrl(file) {
  if (isImage(file) || isPdf(file)) {
    return URL.createObjectURL(file);
  }
  return null;
}

/**
 * All supported format extensions
 */
export const SUPPORTED_FORMATS = Object.keys(EXT_MAP);

/**
 * Get accepted file types string for input element
 */
export function getAcceptString(formats) {
  if (!formats || formats.length === 0) return '*';
  return formats.join(',');
}
