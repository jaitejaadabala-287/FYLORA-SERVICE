import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Image, Table, Presentation, File } from 'lucide-react';
import { formatFileSize } from '../../engine/fileDetector';

const FORMAT_ICONS = {
  'application/pdf': FileText,
  'image/': Image,
  'application/vnd.ms-excel': Table,
  'application/vnd.openxmlformats-officedocument.spreadsheetml': Table,
  'application/vnd.ms-powerpoint': Presentation,
  'application/vnd.openxmlformats-officedocument.presentationml': Presentation,
};

function getFileIcon(mimeType) {
  for (const [key, Icon] of Object.entries(FORMAT_ICONS)) {
    if (mimeType?.startsWith(key)) return Icon;
  }
  return File;
}

export default function FileUploader({
  onFileSelect,
  accept,
  multiple = false,
  maxSize = 100 * 1024 * 1024,
  title,
  description,
  compact = false,
}) {
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const dragCounter = useRef(0);

  const handleFiles = useCallback((files) => {
    setError(null);
    const fileList = Array.from(files);

    for (const file of fileList) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds the ${formatFileSize(maxSize)} limit.`);
        return;
      }
    }

    setSelectedFiles(fileList);
    onFileSelect?.(multiple ? fileList : fileList[0]);
  }, [onFileSelect, multiple, maxSize]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFiles([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (selectedFiles.length > 0 && !multiple) {
    const file = selectedFiles[0];
    const Icon = getFileIcon(file.type);
    return (
      <div className="file-uploader has-file" onClick={handleClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(16,185,129,0.1)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={24} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-gray-800)', fontSize: '14px' }}>{file.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>{formatFileSize(file.size)}</div>
          </div>
          <button
            onClick={handleRemove}
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: '16px' }}
          >
            Change file
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`file-uploader ${dragging ? 'dragging' : ''} ${compact ? 'compact' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload file"
    >
      <div className="file-uploader-icon">
        <Upload size={28} />
      </div>
      <h3>{title || (dragging ? 'Drop your file here' : 'Upload Your File')}</h3>
      <p>
        {description || 'Drag and drop your file here, or click to browse'}
      </p>
      {accept && (
        <div className="file-uploader-formats">
          {accept.split(',').slice(0, 8).map((fmt) => (
            <span key={fmt} className="format-badge format-badge-txt" style={{ fontSize: '10px' }}>
              {fmt.replace('.', '').toUpperCase()}
            </span>
          ))}
          {accept.split(',').length > 8 && (
            <span style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>
              +{accept.split(',').length - 8} more
            </span>
          )}
        </div>
      )}
      {error && (
        <p style={{ color: 'var(--color-danger)', marginTop: '12px', fontSize: '13px' }}>{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept || '*'}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
