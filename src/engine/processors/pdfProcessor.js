/**
 * FYLORA — PDF Processor
 * Client-side PDF processing using pdf-lib & JSZip.
 * Supports: merge, split, rotate, extract pages, delete pages, watermark, protect, compress.
 */

import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import JSZip from 'jszip';

/**
 * Helper to parse 1-indexed page number strings like "1, 3, 5-8" into 0-indexed page indices.
 */
export function parsePageRange(inputStr, totalPages) {
  if (!inputStr || typeof inputStr !== 'string') return [];
  const indices = new Set();
  const parts = inputStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(totalPages, Math.max(start, end));
        for (let i = from; i <= to; i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        indices.add(num - 1);
      }
    }
  }
  
  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdf(files, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const fileList = Array.isArray(files) ? files : [files];
  const mergedDoc = await PDFDocument.create();
  
  for (let i = 0; i < fileList.length; i++) {
    const arrayBuffer = await fileList[i].arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedDoc.addPage(page));
    
    onProgress?.({
      step: 'converting',
      progress: 10 + Math.round(((i + 1) / fileList.length) * 70),
    });
  }
  
  onProgress?.({ step: 'optimizing', progress: 85 });
  
  const pdfBytes = await mergedDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return {
    blob,
    filename: 'merged_document.pdf',
    mimeType: 'application/pdf',
    pageCount: mergedDoc.getPageCount(),
  };
}

/**
 * Split PDF into individual pages or page ranges.
 * Automatically packages multiple split files into a ZIP archive.
 */
export async function splitPdf(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  onProgress?.({ step: 'converting', progress: 30 });
  
  let ranges = options.ranges;
  if (!ranges || !Array.isArray(ranges) || ranges.length === 0) {
    if (typeof options.pageRange === 'string' && options.pageRange.trim()) {
      // Split into custom range
      const indices = parsePageRange(options.pageRange, totalPages);
      if (indices.length > 0) {
        ranges = [[indices[0], indices[indices.length - 1]]];
      }
    }
  }
  
  if (!ranges || ranges.length === 0) {
    // Default: split every page individually
    ranges = Array.from({ length: totalPages }, (_, i) => [i, i]);
  }
  
  const baseName = file.name.replace(/\.pdf$/i, '');

  // Single range output
  if (ranges.length === 1) {
    const [start, end] = ranges[0];
    const newDoc = await PDFDocument.create();
    const pageIndices = [];
    for (let j = start; j <= end && j < totalPages; j++) {
      pageIndices.push(j);
    }
    const pages = await newDoc.copyPages(pdf, pageIndices);
    pages.forEach((page) => newDoc.addPage(page));
    
    const pdfBytes = await newDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    onProgress?.({ step: 'complete', progress: 100 });
    return {
      blob,
      filename: `${baseName}_split.pdf`,
      mimeType: 'application/pdf',
    };
  }

  // Multiple output files -> bundle into ZIP
  const zip = new JSZip();
  
  for (let i = 0; i < ranges.length; i++) {
    const [start, end] = ranges[i];
    const newDoc = await PDFDocument.create();
    const pageIndices = [];
    for (let j = start; j <= end && j < totalPages; j++) {
      pageIndices.push(j);
    }
    const pages = await newDoc.copyPages(pdf, pageIndices);
    pages.forEach((page) => newDoc.addPage(page));
    
    const pdfBytes = await newDoc.save();
    const pageFilename = ranges.length === totalPages
      ? `${baseName}_page_${i + 1}.pdf`
      : `${baseName}_pages_${start + 1}-${end + 1}.pdf`;
    
    zip.file(pageFilename, pdfBytes);
    
    onProgress?.({
      step: 'converting',
      progress: 30 + Math.round(((i + 1) / ranges.length) * 55),
    });
  }
  
  onProgress?.({ step: 'optimizing', progress: 90 });
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress?.({ step: 'complete', progress: 100 });
  
  return {
    blob: zipBlob,
    filename: `${baseName}_split_pages.zip`,
    mimeType: 'application/zip',
  };
}

/**
 * Rotate PDF pages
 */
export async function rotatePdf(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  onProgress?.({ step: 'converting', progress: 40 });
  
  const rotationAngle = parseInt(options.degrees || 90, 10);
  const pagesToRotate = options.pages || pdf.getPageIndices();
  
  pagesToRotate.forEach((pageIndex) => {
    if (pageIndex < pdf.getPageCount()) {
      const page = pdf.getPage(pageIndex);
      const currentRotation = page.getRotation().angle;
      const newAngle = (currentRotation + rotationAngle) % 360;
      page.setRotation(degrees(newAngle));
    }
  });
  
  onProgress?.({ step: 'optimizing', progress: 75 });
  
  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  const baseName = file.name.replace(/\.pdf$/i, '');
  const filename = `${baseName}_rotated.pdf`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: 'application/pdf' };
}

/**
 * Extract specific pages from a PDF
 */
export async function extractPages(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  onProgress?.({ step: 'converting', progress: 40 });
  
  let pageIndices = [];
  if (typeof options.pageRange === 'string' && options.pageRange.trim()) {
    pageIndices = parsePageRange(options.pageRange, totalPages);
  } else if (Array.isArray(options.pages) && options.pages.length > 0) {
    pageIndices = options.pages;
  } else {
    // Default to page 1 (index 0) if none specified
    pageIndices = [0];
  }
  
  if (pageIndices.length === 0) {
    pageIndices = [0];
  }
  
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(pdf, pageIndices);
  pages.forEach((page) => newDoc.addPage(page));
  
  onProgress?.({ step: 'optimizing', progress: 75 });
  
  const pdfBytes = await newDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  const baseName = file.name.replace(/\.pdf$/i, '');
  const filename = `${baseName}_extracted.pdf`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: 'application/pdf' };
}

/**
 * Delete specific pages from a PDF
 */
export async function deletePages(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  onProgress?.({ step: 'converting', progress: 40 });
  
  let deleteIndices = [];
  if (typeof options.pageRange === 'string' && options.pageRange.trim()) {
    deleteIndices = parsePageRange(options.pageRange, totalPages);
  } else if (Array.isArray(options.pages) && options.pages.length > 0) {
    deleteIndices = options.pages;
  }
  
  const pagesToDelete = new Set(deleteIndices);
  const keepIndices = pdf.getPageIndices().filter((i) => !pagesToDelete.has(i));
  
  if (keepIndices.length === 0) {
    throw new Error('Cannot delete all pages from the PDF document.');
  }
  
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(pdf, keepIndices);
  pages.forEach((page) => newDoc.addPage(page));
  
  onProgress?.({ step: 'optimizing', progress: 75 });
  
  const pdfBytes = await newDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  const baseName = file.name.replace(/\.pdf$/i, '');
  const filename = `${baseName}_modified.pdf`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: 'application/pdf' };
}

/**
 * Add text watermark to PDF
 */
export async function watermarkPdf(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  
  onProgress?.({ step: 'converting', progress: 40 });
  
  const text = options.watermarkText || options.text || 'CONFIDENTIAL';
  const fontSize = options.fontSize || 54;
  const opacity = options.watermarkOpacity !== undefined ? options.watermarkOpacity : 0.2;
  
  const pages = pdf.getPages();
  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    page.drawText(text, {
      x: Math.max(10, (width - textWidth) / 2),
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    });
  });
  
  onProgress?.({ step: 'optimizing', progress: 75 });
  
  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  const baseName = file.name.replace(/\.pdf$/i, '');
  const filename = `${baseName}_watermarked.pdf`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: 'application/pdf' };
}

/**
 * Protect PDF with password
 */
export async function protectPdf(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  onProgress?.({ step: 'converting', progress: 40 });
  
  const password = options.password || '123456';
  
  pdf.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });
  
  onProgress?.({ step: 'optimizing', progress: 75 });
  
  const pdfBytes = await pdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  const baseName = file.name.replace(/\.pdf$/i, '');
  const filename = `${baseName}_protected.pdf`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return { blob, filename, mimeType: 'application/pdf' };
}

/**
 * Compress PDF
 */
export async function compressPdf(file, options = {}, onProgress) {
  onProgress?.({ step: 'uploading', progress: 10 });
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  onProgress?.({ step: 'converting', progress: 40 });
  onProgress?.({ step: 'optimizing', progress: 65 });
  
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.pdf$/i, '');
  const filename = `${baseName}_compressed.pdf`;
  
  onProgress?.({ step: 'complete', progress: 100 });
  
  return {
    blob,
    filename,
    mimeType: 'application/pdf',
    originalSize: file.size,
    compressedSize: blob.size,
    savedPercent: Math.max(0, Math.round((1 - blob.size / file.size) * 100)),
  };
}

/**
 * Get PDF page count
 */
export async function getPdfPageCount(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
}

/**
 * Get PDF metadata
 */
export async function getPdfMetadata(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    subject: pdf.getSubject(),
    creator: pdf.getCreator(),
    producer: pdf.getProducer(),
  };
}
