import { CheckCircle, Download, RefreshCw, ArrowRight } from 'lucide-react';
import { formatFileSize } from '../../engine/fileDetector';

export default function ResultView({
  result,
  originalFile,
  onDownload,
  onProcessAnother,
  showCompression = false,
}) {
  if (!result) return null;

  const { blob, filename, originalSize, compressedSize, savedPercent } = result;

  // Safely determine if we can create a preview URL
  const isImageBlob = blob instanceof Blob && blob.type?.startsWith('image/');
  const previewUrl = isImageBlob ? URL.createObjectURL(blob) : null;

  const isCompression = showCompression && originalSize && compressedSize;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(result);
      return;
    }

    // Ensure we have a valid blob to download
    let downloadBlob = blob;
    if (!(downloadBlob instanceof Blob)) {
      // If blob is a Uint8Array or ArrayBuffer, convert it
      if (downloadBlob instanceof Uint8Array || downloadBlob instanceof ArrayBuffer) {
        downloadBlob = new Blob([downloadBlob], { type: result.mimeType || 'application/octet-stream' });
      } else {
        console.error('Cannot download: result is not a valid Blob');
        return;
      }
    }

    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileSize = blob instanceof Blob ? blob.size : (blob?.byteLength || blob?.length || 0);

  return (
    <div className="result-view animate-fade-in">
      <div className="result-success-icon">
        <CheckCircle size={40} />
      </div>

      <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: '8px' }}>
        Your file is ready!
      </h2>
      <p style={{ color: 'var(--color-gray-500)', fontSize: '15px' }}>
        Your file has been processed successfully.
      </p>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="result-preview"
          style={{
            maxWidth: '100%', maxHeight: '300px', borderRadius: '12px',
            margin: '24px auto', display: 'block', objectFit: 'contain',
            border: '1px solid var(--color-gray-200)',
          }}
        />
      )}

      {isCompression && (
        <div className="compression-stats" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '24px', margin: '24px 0', padding: '20px',
          background: 'var(--color-gray-50)', borderRadius: '12px',
          border: '1px solid var(--color-gray-200)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-gray-700)' }}>
              {formatFileSize(originalSize)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Original</div>
          </div>
          <div>
            <ArrowRight size={20} color="var(--color-gray-400)" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success, #16a34a)' }}>
              {formatFileSize(compressedSize)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Compressed</div>
          </div>
        </div>
      )}
      {isCompression && savedPercent > 0 && (
        <div style={{
          textAlign: 'center', marginBottom: '24px', padding: '8px 16px',
          background: 'rgba(22, 163, 106, 0.08)', borderRadius: '8px',
          display: 'inline-flex', gap: '4px', margin: '0 auto 24px',
        }}>
          <span style={{ fontWeight: 700, color: 'var(--color-success, #16a34a)' }}>{savedPercent}%</span>
          <span style={{ color: 'var(--color-gray-600)', fontSize: '14px' }}>file size reduction</span>
        </div>
      )}

      <div className="result-file-info" style={{
        background: 'var(--color-gray-50)', borderRadius: '12px',
        border: '1px solid var(--color-gray-200)', padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '4px 0',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>File name</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-gray-800)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {filename}
          </span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '4px 0', borderTop: '1px solid var(--color-gray-200)', marginTop: '8px', paddingTop: '8px',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>File size</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-gray-800)' }}>
            {formatFileSize(fileSize)}
          </span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '4px 0', borderTop: '1px solid var(--color-gray-200)', marginTop: '8px', paddingTop: '8px',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>Format</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-gray-800)' }}>
            {filename?.split('.').pop()?.toUpperCase()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary btn-lg" onClick={handleDownload}>
          <Download size={18} /> Download
        </button>
        {onProcessAnother && (
          <button className="btn btn-secondary btn-lg" onClick={onProcessAnother}>
            <RefreshCw size={18} /> Process Another
          </button>
        )}
      </div>
    </div>
  );
}
