import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, FileText, Image, Table, Presentation,
  RotateCw, Scissors, Minimize2, Lock, Stamp, FileOutput, FileX,
  Combine, Crop, Maximize2, RefreshCw, Wand2, Clock
} from 'lucide-react';
import FileUploader from '../components/FileUpload/FileUploader';
import ProcessingView from '../components/Processing/ProcessingView';
import ResultView from '../components/Processing/ResultView';
import { detectFile, formatFileSize } from '../engine/fileDetector';
import { getToolsForFormat } from '../engine/registry';

import { convertImage, compressImage, resizeImage, rotateImage, imageToPdf } from '../engine/processors/imageProcessor';
import { mergePdf, splitPdf, rotatePdf, extractPages, deletePages, watermarkPdf, protectPdf, compressPdf } from '../engine/processors/pdfProcessor';

const TOOL_ICONS = {
  FileText, Image, Table, Presentation, RotateCw, Scissors,
  Minimize2, Lock, Stamp, FileOutput, FileX, Combine, Crop, Maximize2,
  Wand2,
};

export default function UniversalConverterPage() {
  const [stage, setStage] = useState('upload'); // upload | detected | options | processing | result
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [processingState, setProcessingState] = useState({ step: '', progress: 0 });
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState({});

  // Check for file passed from homepage
  useEffect(() => {
    if (window.__fylora_upload) {
      handleFileSelect(window.__fylora_upload);
      window.__fylora_upload = null;
    }
  }, []);

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    const info = detectFile(selectedFile);
    setFileInfo(info);
    setStage('detected');
    setSelectedTool(null);
    setResult(null);
  }, []);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setStage('options');
  };

  const handleProcess = async () => {
    if (!file || !selectedTool) return;

    setStage('processing');
    setProcessingState({ step: 'uploading', progress: 0 });

    const onProgress = (state) => {
      setProcessingState(state);
    };

    try {
      let processResult;

      switch (selectedTool.processor) {
        case 'convertImage':
          processResult = await convertImage(file, selectedTool.outputFormat, options, onProgress);
          break;
        case 'compressImage':
          processResult = await compressImage(file, {
            level: options.compressionLevel || 'recommended',
            quality: options.quality,
            ...options,
          }, onProgress);
          break;
        case 'resizeImage':
          processResult = await resizeImage(file, options, onProgress);
          break;
        case 'rotateImage':
          processResult = await rotateImage(file, { degrees: options.degrees || 90 }, onProgress);
          break;
        case 'imageToPdf':
          processResult = await imageToPdf(file, options, onProgress);
          break;
        case 'mergePdf':
          processResult = await mergePdf(Array.isArray(file) ? file : [file], options, onProgress);
          break;
        case 'splitPdf':
          processResult = await splitPdf(file, options, onProgress);
          break;
        case 'rotatePdf':
          processResult = await rotatePdf(file, { degrees: options.degrees || 90 }, onProgress);
          break;
        case 'extractPages':
          processResult = await extractPages(file, options, onProgress);
          break;
        case 'deletePages':
          processResult = await deletePages(file, options, onProgress);
          break;
        case 'watermarkPdf':
          processResult = await watermarkPdf(file, options, onProgress);
          break;
        case 'protectPdf':
          processResult = await protectPdf(file, options, onProgress);
          break;
        case 'compressPdf':
          processResult = await compressPdf(file, options, onProgress);
          break;
        default:
          throw new Error('Processor not available');
      }

      setResult(processResult);
      setStage('result');
    } catch (error) {
      console.error('Processing error:', error);
      alert(`Processing failed: ${error.message || error}`);
      setStage('detected');
    }
  };

  const handleReset = () => {
    setStage('upload');
    setFile(null);
    setFileInfo(null);
    setSelectedTool(null);
    setResult(null);
    setOptions({});
  };

  const isCompression = selectedTool?.processor?.includes('compress') || selectedTool?.processor?.includes('Compress');

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--gradient-hero)', padding: '48px 0 32px', textAlign: 'center',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} /> Flagship Feature
          </div>
          <h1 style={{ fontSize: 'var(--text-4xl)', color: 'white', marginBottom: '8px' }}>
            Universal Converter
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Upload any file — we'll detect it and show you everything you can do with it
          </p>
        </div>
        <div style={{
          position: 'absolute', bottom: '-50%', left: '20%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* ── Upload Stage ── */}
          {stage === 'upload' && (
            <div className="animate-fade-in-up">
              <FileUploader onFileSelect={handleFileSelect} />
              <p style={{
                textAlign: 'center', color: 'var(--color-gray-400)', fontSize: '13px',
                marginTop: '16px',
              }}>
                Supports PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP, TXT, CSV and more
              </p>
            </div>
          )}

          {/* ── Detected Stage ── */}
          {stage === 'detected' && fileInfo && (
            <div className="animate-fade-in">
              {/* File info card */}
              <div style={{
                background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)',
                borderRadius: '16px', padding: '24px', marginBottom: '32px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${fileInfo.color}18`, color: fileInfo.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {(() => {
                    const I = TOOL_ICONS[fileInfo.icon] || FileText;
                    return <I size={24} />;
                  })()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-gray-800)' }}>
                    {fileInfo.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                    {fileInfo.type} • {fileInfo.sizeFormatted}
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                  Change
                </button>
              </div>

              {/* Available tools */}
              <h3 style={{ marginBottom: '8px', fontSize: 'var(--text-lg)' }}>
                What would you like to do?
              </h3>
              <p style={{ color: 'var(--color-gray-500)', fontSize: '14px', marginBottom: '20px' }}>
                {fileInfo.availableTools.length} operations available for {fileInfo.extension.toUpperCase()} files
              </p>

              <div className="operation-grid">
                {fileInfo.availableTools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.icon] || Wand2;
                  const isSelected = selectedTool?.id === tool.id;

                  return (
                    <div
                      key={tool.id}
                      className={`operation-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToolSelect(tool)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="operation-card-icon">
                        <Icon size={20} />
                      </div>
                      <span className="operation-card-label">{tool.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Options Stage ── */}
          {stage === 'options' && selectedTool && (
            <div className="animate-fade-in">
              <div style={{
                background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)',
                borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center',
              }}>
                <h3 style={{ marginBottom: '8px' }}>{selectedTool.name}</h3>
                <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
                  {selectedTool.description}
                </p>
              </div>

              {/* Compression settings */}
              {selectedTool.processor?.includes('compress') && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Compression Level</h4>
                  <div className="compression-levels">
                    {['maximum', 'recommended', 'high'].map((level) => (
                      <div
                        key={level}
                        className={`compression-level ${options.compressionLevel === level ? 'selected' : ''}`}
                        onClick={() => setOptions({ ...options, compressionLevel: level })}
                      >
                        <div className="compression-level-title" style={{ textTransform: 'capitalize' }}>
                          {level === 'high' ? 'High Quality' : level}
                        </div>
                        <div className="compression-level-desc">
                          {level === 'maximum' ? 'Smallest file size' :
                           level === 'recommended' ? 'Best balance' : 'Best quality'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rotation settings */}
              {selectedTool.processor?.includes('rotate') && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Rotation Angle</h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[90, 180, 270].map((deg) => (
                      <div
                        key={deg}
                        className={`compression-level ${options.degrees === deg ? 'selected' : ''}`}
                        onClick={() => setOptions({ ...options, degrees: deg })}
                        style={{ flex: 1, cursor: 'pointer' }}
                      >
                        <div className="compression-level-title">{deg}°</div>
                        <div className="compression-level-desc">
                          {deg === 90 ? 'Quarter turn' : deg === 180 ? 'Half turn' : 'Three-quarter'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Watermark settings */}
              {selectedTool.processor === 'watermarkPdf' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Watermark Text</h4>
                  <input
                    type="text"
                    placeholder="e.g. CONFIDENTIAL"
                    value={options.watermarkText || ''}
                    onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '2px solid var(--color-gray-200)', fontSize: '15px',
                      outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-200)'}
                  />
                  <div className="slider-container" style={{ marginTop: '16px' }}>
                    <div className="slider-label">
                      <span>Opacity</span>
                      <span>{Math.round((options.watermarkOpacity || 0.15) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={Math.round((options.watermarkOpacity || 0.15) * 100)}
                      onChange={(e) => setOptions({ ...options, watermarkOpacity: parseInt(e.target.value) / 100 })}
                    />
                  </div>
                </div>
              )}

              {/* Protect PDF settings */}
              {selectedTool.processor === 'protectPdf' && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '8px', fontSize: '15px' }}>Set Password</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginBottom: '12px' }}>
                    Enter a password to encrypt your PDF file:
                  </p>
                  <input
                    type="password"
                    placeholder="Enter password (e.g. Secret123)"
                    value={options.password || ''}
                    onChange={(e) => setOptions({ ...options, password: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '2px solid var(--color-gray-200)', fontSize: '15px', outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Extract Pages settings */}
              {selectedTool.processor === 'extractPages' && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '8px', fontSize: '15px' }}>Pages to Extract</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginBottom: '12px' }}>
                    Specify page numbers or range to extract into new PDF (e.g. 1, 3, 5-8):
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. 1, 3, 5-8"
                    value={options.pageRange || ''}
                    onChange={(e) => setOptions({ ...options, pageRange: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '2px solid var(--color-gray-200)', fontSize: '15px', outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Delete Pages settings */}
              {selectedTool.processor === 'deletePages' && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '8px', fontSize: '15px' }}>Pages to Remove</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginBottom: '12px' }}>
                    Specify page numbers to delete from the PDF (e.g. 2, 4, 6-9):
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. 2, 4"
                    value={options.pageRange || ''}
                    onChange={(e) => setOptions({ ...options, pageRange: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '2px solid var(--color-gray-200)', fontSize: '15px', outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Split PDF settings */}
              {selectedTool.processor === 'splitPdf' && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Split Options</h4>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      className={`btn ${!options.splitCustom ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setOptions({ ...options, splitCustom: false, pageRange: '' })}
                      style={{ flex: 1 }}
                    >
                      Extract All Pages (ZIP)
                    </button>
                    <button
                      type="button"
                      className={`btn ${options.splitCustom ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setOptions({ ...options, splitCustom: true })}
                      style={{ flex: 1 }}
                    >
                      Custom Page Range
                    </button>
                  </div>
                  {options.splitCustom && (
                    <input
                      type="text"
                      placeholder="e.g. 1-3 (Extract pages 1 to 3)"
                      value={options.pageRange || ''}
                      onChange={(e) => setOptions({ ...options, pageRange: e.target.value })}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                        border: '2px solid var(--color-gray-200)', fontSize: '15px', outline: 'none',
                      }}
                    />
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-ghost btn-lg" onClick={() => setStage('detected')}>
                  Back
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleProcess}>
                  <Wand2 size={18} /> Process File
                </button>
              </div>
            </div>
          )}          {/* ── Processing Stage ── */}
          {stage === 'processing' && (
            <ProcessingView
              currentStep={processingState.step}
              progress={processingState.progress}
              fileName={file?.name}
            />
          )}

          {/* ── Result Stage ── */}
          {stage === 'result' && result && (
            <ResultView
              result={result}
              originalFile={file}
              onProcessAnother={handleReset}
              showCompression={isCompression}
            />
          )}
        </div>
      </section>
    </div>
  );
}
