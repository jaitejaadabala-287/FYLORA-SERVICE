import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, FileText, FileType, Table, Presentation,
  Image, Minimize2, Wand2, Lock, Scissors, FileOutput, FileX, Stamp, RotateCw
} from 'lucide-react';
import { getToolById, getCategoryById, getToolsByCategory } from '../engine/registry';
import FileUploader from '../components/FileUpload/FileUploader';
import ProcessingView from '../components/Processing/ProcessingView';
import ResultView from '../components/Processing/ResultView';

import { convertImage, compressImage, resizeImage, rotateImage, imageToPdf } from '../engine/processors/imageProcessor';
import { mergePdf, splitPdf, rotatePdf, extractPages, deletePages, watermarkPdf, protectPdf, compressPdf } from '../engine/processors/pdfProcessor';

const ICON_MAP = { FileText, FileType, Table, Presentation, Image, Minimize2 };

export default function ToolPage() {
  const { categoryId, toolId } = useParams();
  const tool = getToolById(toolId);
  const category = getCategoryById(categoryId);

  const [stage, setStage] = useState('upload');
  const [file, setFile] = useState(null);
  const [processingState, setProcessingState] = useState({ step: '', progress: 0 });
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState({});

  if (!tool || !category) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)', textAlign: 'center', padding: '120px 24px' }}>
        <h2>Tool not found</h2>
        <Link to="/tools" className="btn btn-primary" style={{ marginTop: '16px' }}>
          View All Tools
        </Link>
      </div>
    );
  }

  const CatIcon = ICON_MAP[category.icon] || FileText;
  const isCompression = tool.processor?.includes('compress') || tool.processor?.includes('Compress');
  const isMultiFile = tool.multiFile || tool.id === 'merge-pdf';

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setStage('ready');
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setStage('processing');
    setProcessingState({ step: 'uploading', progress: 0 });

    const onProgress = (state) => setProcessingState(state);

    try {
      let processResult;
      switch (tool.processor) {
        case 'convertImage':
          processResult = await convertImage(file, tool.outputFormat, options, onProgress);
          break;
        case 'compressImage':
          processResult = await compressImage(file, { level: options.compressionLevel || 'recommended', ...options }, onProgress);
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
      setStage('ready');
    }
  };

  const handleReset = () => {
    setStage('upload');
    setFile(null);
    setResult(null);
    setOptions({});
  };

  // Related tools
  const relatedTools = getToolsByCategory(categoryId).filter((t) => t.id !== toolId).slice(0, 4);

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Hero */}
      <section style={{
        background: 'var(--gradient-hero)', padding: '48px 0 32px',
        textAlign: 'center', color: 'white',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'rgba(255,255,255,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <CatIcon size={26} />
          </div>
          <h1 style={{ fontSize: 'var(--text-4xl)', color: 'white', marginBottom: '8px' }}>
            {tool.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            {tool.description}
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link
            to={`/tools/${categoryId}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '14px', color: 'var(--color-gray-500)', marginBottom: '32px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> {category.name}
          </Link>

          {/* Upload */}
          {stage === 'upload' && (
            <div className="animate-fade-in">
              <FileUploader
                onFileSelect={handleFileSelect}
                accept={tool.inputFormats?.join(',')}
                multiple={isMultiFile}
                title={`Upload your ${tool.inputFormats?.[0]?.replace('.','').toUpperCase() || ''} file${isMultiFile ? 's' : ''}`}
                description={`Drop your file${isMultiFile ? 's' : ''} here to ${tool.name.toLowerCase()}`}
              />
            </div>
          )}

          {/* Ready to process with Options */}
          {stage === 'ready' && (
            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
              <div style={{
                background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)',
                borderRadius: '16px', padding: '24px', marginBottom: '24px',
              }}>
                {Array.isArray(file) ? (
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '15px' }}>{file.length} Files Selected</p>
                    <div style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginTop: '6px' }}>
                      {file.map(f => f.name).join(', ')}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '15px' }}>{file?.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                      {file && (file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              {/* Compression settings */}
              {tool.processor?.includes('compress') && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Compression Level</h4>
                  <div className="compression-levels">
                    {['maximum', 'recommended', 'high'].map((level) => (
                      <div
                        key={level}
                        className={`compression-level ${(options.compressionLevel || 'recommended') === level ? 'selected' : ''}`}
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
              {tool.processor?.includes('rotate') && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Rotation Angle</h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[90, 180, 270].map((deg) => (
                      <div
                        key={deg}
                        className={`compression-level ${(options.degrees || 90) === deg ? 'selected' : ''}`}
                        onClick={() => setOptions({ ...options, degrees: deg })}
                        style={{ flex: 1, cursor: 'pointer' }}
                      >
                        <div className="compression-level-title">{deg}°</div>
                        <div className="compression-level-desc">
                          {deg === 90 ? 'Clockwise 90°' : deg === 180 ? 'Half turn' : 'Counter 90°'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Protect PDF settings */}
              {tool.processor === 'protectPdf' && (
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
              {tool.processor === 'extractPages' && (
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
              {tool.processor === 'deletePages' && (
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

              {/* Watermark PDF settings */}
              {tool.processor === 'watermarkPdf' && (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '8px', fontSize: '15px' }}>Watermark Settings</h4>
                  <input
                    type="text"
                    placeholder="Watermark Text (e.g. CONFIDENTIAL)"
                    value={options.watermarkText || ''}
                    onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      border: '2px solid var(--color-gray-200)', fontSize: '15px', outline: 'none',
                      marginBottom: '16px',
                    }}
                  />
                  <div className="slider-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Watermark Opacity</span>
                      <span>{Math.round((options.watermarkOpacity !== undefined ? options.watermarkOpacity : 0.2) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={Math.round((options.watermarkOpacity !== undefined ? options.watermarkOpacity : 0.2) * 100)}
                      onChange={(e) => setOptions({ ...options, watermarkOpacity: parseInt(e.target.value, 10) / 100 })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}

              {/* Split PDF settings */}
              {tool.processor === 'splitPdf' && (
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
                <button className="btn btn-ghost btn-lg" onClick={handleReset}>Change File</button>
                <button className="btn btn-primary btn-lg" onClick={handleProcess}>
                  <Wand2 size={18} /> {tool.name}
                </button>
              </div>
            </div>
          )}

          {/* Processing */}
          {stage === 'processing' && (
            <ProcessingView
              currentStep={processingState.step}
              progress={processingState.progress}
              fileName={Array.isArray(file) ? `${file.length} Files` : file?.name}
            />
          )}

          {/* Result */}
          {stage === 'result' && result && (
            <ResultView
              result={result}
              originalFile={Array.isArray(file) ? file[0] : file}
              onProcessAnother={handleReset}
              showCompression={isCompression}
            />
          )}
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="section" style={{ background: 'var(--color-gray-50)' }}>
          <div className="container">
            <h3 style={{ marginBottom: '20px' }}>Related Tools</h3>
            <div className="tools-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {relatedTools.map((t) => {
                const Icon = ICON_MAP[t.icon] || ICON_MAP[category.icon] || FileText;
                return (
                  <Link key={t.id} to={`/tools/${categoryId}/${t.id}`} className="tool-card">
                    <div className="tool-card-icon" style={{ background: category.colorBg, color: category.color }}>
                      <Icon size={20} />
                    </div>
                    <div className="tool-card-content">
                      <h4>{t.name}</h4>
                      <p>{t.description}</p>
                    </div>
                    <ArrowRight size={16} className="tool-card-arrow" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
