/**
 * FYLORA — Tool Registry
 * Central registry defining all active, fully-functional tools without duplicates.
 */

export const CATEGORIES = {
  pdf: {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Compress, merge, split, rotate, watermark, and protect your PDF files',
    icon: 'FileText',
    color: '#ef4444',
    colorBg: 'rgba(239,68,68,0.1)',
  },
  images: {
    id: 'images',
    name: 'Image Tools',
    description: 'Convert, compress, resize, crop, rotate, and transform images',
    icon: 'Image',
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.1)',
  },
  compression: {
    id: 'compression',
    name: 'Compression',
    description: 'Reduce PDF and image file sizes while maintaining quality',
    icon: 'Minimize2',
    color: '#0d9488',
    colorBg: 'rgba(13,148,136,0.1)',
  },
};

export const TOOLS = [
  // ── PDF Tools ──
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining high visual quality',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'Minimize2',
    processor: 'compressPdf',
    status: 'active',
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'Combine',
    processor: 'mergePdf',
    status: 'active',
    multiFile: true,
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split a PDF into multiple separate documents',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'Scissors',
    processor: 'splitPdf',
    status: 'active',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to any angle (90°, 180°, 270°)',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'RotateCw',
    processor: 'rotatePdf',
    status: 'active',
  },
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    description: 'Extract specific pages from a PDF document into a new PDF',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'FileOutput',
    processor: 'extractPages',
    status: 'active',
  },
  {
    id: 'delete-pages',
    name: 'Delete Pages',
    description: 'Remove unwanted pages from a PDF document',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'FileX',
    processor: 'deletePages',
    status: 'active',
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    description: 'Add custom text watermarks to your PDF pages',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'Stamp',
    processor: 'watermarkPdf',
    status: 'active',
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Add password protection and encryption to your PDF files',
    category: 'pdf',
    inputFormats: ['.pdf'],
    outputFormat: '.pdf',
    icon: 'Lock',
    processor: 'protectPdf',
    status: 'active',
  },

  // ── Image Tools ──
  {
    id: 'compress-image',
    name: 'Compress Image',
    description: 'Reduce image file size dramatically while preserving visual quality',
    category: 'images',
    inputFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    outputFormat: null,
    icon: 'Minimize2',
    processor: 'compressImage',
    status: 'active',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert JPG images to PNG format with transparency support',
    category: 'images',
    inputFormats: ['.jpg', '.jpeg'],
    outputFormat: '.png',
    icon: 'Image',
    processor: 'convertImage',
    status: 'active',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    description: 'Convert PNG images to compressed JPG format',
    category: 'images',
    inputFormats: ['.png'],
    outputFormat: '.jpg',
    icon: 'Image',
    processor: 'convertImage',
    status: 'active',
  },
  {
    id: 'jpg-to-webp',
    name: 'JPG to WebP',
    description: 'Convert JPG images to modern web-optimized WebP format',
    category: 'images',
    inputFormats: ['.jpg', '.jpeg'],
    outputFormat: '.webp',
    icon: 'Image',
    processor: 'convertImage',
    status: 'active',
  },
  {
    id: 'png-to-webp',
    name: 'PNG to WebP',
    description: 'Convert PNG images to efficient WebP format',
    category: 'images',
    inputFormats: ['.png'],
    outputFormat: '.webp',
    icon: 'Image',
    processor: 'convertImage',
    status: 'active',
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG',
    description: 'Convert WebP images to widely compatible JPG format',
    category: 'images',
    inputFormats: ['.webp'],
    outputFormat: '.jpg',
    icon: 'Image',
    processor: 'convertImage',
    status: 'active',
  },
  {
    id: 'webp-to-png',
    name: 'WebP to PNG',
    description: 'Convert WebP images to PNG format',
    category: 'images',
    inputFormats: ['.webp'],
    outputFormat: '.png',
    icon: 'Image',
    processor: 'convertImage',
    status: 'active',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images (JPG, PNG, WebP) directly into PDF document',
    category: 'images',
    inputFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
    outputFormat: '.pdf',
    icon: 'FileText',
    processor: 'imageToPdf',
    status: 'active',
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    description: 'Resize images to custom width and height dimensions',
    category: 'images',
    inputFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
    outputFormat: null,
    icon: 'Maximize2',
    processor: 'resizeImage',
    status: 'active',
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    description: 'Crop images to specific dimensions or aspect ratios',
    category: 'images',
    inputFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
    outputFormat: null,
    icon: 'Crop',
    processor: 'cropImage',
    status: 'active',
  },
  {
    id: 'rotate-image',
    name: 'Rotate Image',
    description: 'Rotate images by any angle clockwise or counter-clockwise',
    category: 'images',
    inputFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
    outputFormat: null,
    icon: 'RotateCw',
    processor: 'rotateImage',
    status: 'active',
  },
];

/**
 * Get all tools for a specific category
 */
export function getToolsByCategory(categoryId) {
  if (categoryId === 'compression') {
    return TOOLS.filter((t) => t.id === 'compress-pdf' || t.id === 'compress-image');
  }
  return TOOLS.filter((t) => t.category === categoryId);
}

/**
 * Get a single tool by its ID
 */
export function getToolById(toolId) {
  return TOOLS.find((t) => t.id === toolId);
}

/**
 * Get available tools for a given file extension
 */
export function getToolsForFormat(extension) {
  const ext = extension.toLowerCase();
  return TOOLS.filter((t) => t.inputFormats.includes(ext));
}

/**
 * Get the category object by ID
 */
export function getCategoryById(categoryId) {
  return CATEGORIES[categoryId] || null;
}

/**
 * Get all category IDs with active tools
 */
export function getAllCategories() {
  return Object.values(CATEGORIES).filter(
    (cat) => getToolsByCategory(cat.id).length > 0
  );
}
