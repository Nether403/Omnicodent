/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useRef } from 'react';
import { ArrowDownTrayIcon, PlusIcon, ViewColumnsIcon, DocumentIcon, CodeBracketIcon, XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Creation } from './CreationHistory';

interface LivePreviewProps {
  creation: Creation | null;
  isLoading: boolean;
  isFocused: boolean;
  onReset: () => void;
}

// Add type definition for the global pdfjsLib
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const LoadingStep = ({ text, active, completed }: { text: string, active: boolean, completed: boolean }) => (
    <div className={`flex items-center space-x-3 transition-all duration-500 ${active || completed ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
        <div className={`w-3 h-3 flex items-center justify-center border border-current ${completed ? 'text-brand-orange border-brand-orange' : active ? 'text-white border-white animate-pulse' : 'text-slate-700 border-slate-700'}`}>
            {completed && <div className="w-1.5 h-1.5 bg-brand-orange"></div>}
        </div>
        <span className={`font-orbitron text-[10px] tracking-widest uppercase ${active ? 'text-white text-shadow-sm' : completed ? 'text-brand-orange/70' : 'text-slate-600'}`}>{text}</span>
    </div>
);

const PdfRenderer = ({ dataUrl }: { dataUrl: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!window.pdfjsLib) {
        setError("PDF library not initialized");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Load the document
        const loadingTask = window.pdfjsLib.getDocument(dataUrl);
        const pdf = await loadingTask.promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        
        // Calculate scale to make it look good (High DPI)
        const viewport = page.getViewport({ scale: 2.0 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        setLoading(false);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        setError("Could not render PDF preview.");
        setLoading(false);
      }
    };

    renderPdf();
  }, [dataUrl]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
            <DocumentIcon className="w-12 h-12 mb-3 opacity-50 text-brand-red" />
            <p className="text-sm mb-2 text-brand-red/80 font-mono">{error}</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-8 h-8 border border-brand-orange/30 border-t-brand-orange animate-spin"></div>
            </div>
        )}
        <canvas 
            ref={canvasRef} 
            className={`max-w-full max-h-full object-contain shadow-2xl border border-white/5 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
    </div>
  );
};

export const LivePreview: React.FC<LivePreviewProps> = ({ creation, isLoading, isFocused, onReset }) => {
    const [loadingStep, setLoadingStep] = useState(0);
    const [showSplitView, setShowSplitView] = useState(false);

    // Handle loading animation steps
    useEffect(() => {
        if (isLoading) {
            setLoadingStep(0);
            const interval = setInterval(() => {
                setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 2000); 
            return () => clearInterval(interval);
        } else {
            setLoadingStep(0);
        }
    }, [isLoading]);

    // Default to Split View when a new creation with an image is loaded
    useEffect(() => {
        if (creation?.originalImage) {
            setShowSplitView(true);
        } else {
            setShowSplitView(false);
        }
    }, [creation]);

    const handleExport = () => {
        if (!creation) return;
        const dataStr = JSON.stringify(creation, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_artifact.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <div
      className={`
        fixed z-40 flex flex-col
        rounded border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]
        transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1) overflow-hidden
        ${isFocused
          ? 'inset-0 md:inset-4 opacity-100 scale-100'
          : 'top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'
        }
      `}
    >
        {/* Decorative Corner Markers */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-brand-orange/50 pointer-events-none z-50"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-brand-orange/50 pointer-events-none z-50"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-brand-orange/50 pointer-events-none z-50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-brand-orange/50 pointer-events-none z-50"></div>

      {/* Minimal Technical Header */}
      <div className="bg-slate-950/80 px-4 py-2 flex items-center justify-between border-b border-white/5 shrink-0 h-12 relative z-50">
        {/* Left: Controls */}
        <div className="flex items-center space-x-4 w-48">
           <button 
                onClick={onReset}
                className="group flex items-center space-x-2 text-slate-500 hover:text-brand-red transition-colors focus:outline-none"
                title="Terminate Session"
            >
                <XMarkIcon className="w-5 h-5" />
                <span className="text-[10px] font-orbitron uppercase tracking-widest hidden sm:inline group-hover:underline decoration-brand-red underline-offset-4">Abort</span>
            </button>
        </div>
        
        {/* Center: Title */}
        <div className="flex items-center space-x-2 text-slate-400 absolute left-1/2 -translate-x-1/2">
            <GlobeAltIcon className={`w-4 h-4 ${isLoading ? 'animate-pulse text-brand-orange' : ''}`} />
            <span className="text-[11px] font-orbitron uppercase tracking-[0.2em]">
                {isLoading ? 'ESTABLISHING LINK...' : creation ? creation.name : 'STANDBY'}
            </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-2 w-48">
            {!isLoading && creation && (
                <>
                    {creation.originalImage && (
                         <button 
                            onClick={() => setShowSplitView(!showSplitView)}
                            title={showSplitView ? "Maximize View" : "Split Analysis"}
                            className={`p-1.5 rounded-sm transition-all border border-transparent ${showSplitView ? 'bg-slate-800 text-brand-orange border-brand-orange/30' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                        >
                            <ViewColumnsIcon className="w-4 h-4" />
                        </button>
                    )}

                    <button 
                        onClick={handleExport}
                        title="Export Data"
                        className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-sm hover:bg-slate-800"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>

                    <button 
                        onClick={onReset}
                        title="Initialize New Sequence"
                        className="ml-2 flex items-center space-x-1 text-[10px] font-bold font-orbitron bg-brand-gradient text-white hover:opacity-90 px-3 py-1.5 rounded-sm transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                    >
                        <PlusIcon className="w-3 h-3" />
                        <span className="hidden sm:inline uppercase tracking-widest">Init</span>
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full flex-1 bg-[#050505] flex overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 w-full bg-slate-950/90 backdrop-blur-sm z-40">
             {/* Technical Loading State */}
             <div className="w-full max-w-lg space-y-8 relative">
                <div className="flex flex-col items-center relative z-10">
                    <div className="w-16 h-16 mb-8 text-brand-orange relative">
                        <div className="absolute inset-0 border-t-2 border-brand-orange animate-spin rounded-full"></div>
                        <div className="absolute inset-2 border-b-2 border-brand-orange/50 animate-spin-slow rounded-full"></div>
                        <CodeBracketIcon className="absolute inset-0 m-auto w-6 h-6 text-white animate-pulse" />
                    </div>
                    <h3 className="text-white font-orbitron text-xl tracking-[0.2em] uppercase animate-pulse">Processing Artifact</h3>
                </div>

                 {/* Terminal Steps */}
                 <div className="border-l-2 border-brand-orange/20 bg-black/40 p-6 space-y-4 font-mono w-full max-w-sm mx-auto backdrop-blur-md">
                     <LoadingStep text="Scanning visual data..." active={loadingStep === 0} completed={loadingStep > 0} />
                     <LoadingStep text="Deconstructing UI patterns..." active={loadingStep === 1} completed={loadingStep > 1} />
                     <LoadingStep text="Compiling logic matrix..." active={loadingStep === 2} completed={loadingStep > 2} />
                     <LoadingStep text="Finalizing preview..." active={loadingStep === 3} completed={loadingStep > 3} />
                 </div>
             </div>
             
             {/* Background Scan Line */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="w-full h-1 bg-brand-orange blur-sm animate-scan"></div>
             </div>
          </div>
        ) : creation?.html ? (
          <>
            {/* Split View: Left Panel (Original Image) */}
            {showSplitView && creation.originalImage && (
                <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-white/10 bg-slate-950 relative flex flex-col shrink-0">
                    <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur text-brand-orange text-[9px] font-orbitron uppercase tracking-widest px-2 py-1 border border-brand-orange/30">
                        Input Source
                    </div>
                    <div className="w-full h-full p-8 flex items-center justify-center overflow-hidden">
                        {creation.originalImage.startsWith('data:application/pdf') ? (
                            <PdfRenderer dataUrl={creation.originalImage} />
                        ) : (
                            <img 
                                src={creation.originalImage} 
                                alt="Original Input" 
                                className="max-w-full max-h-full object-contain drop-shadow-2xl border border-white/5 opacity-80 hover:opacity-100 transition-opacity"
                            />
                        )}
                    </div>
                    {/* Scan Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                </div>
            )}

            {/* App Preview Panel */}
            <div className={`relative h-full bg-white transition-all duration-500 ${showSplitView && creation.originalImage ? 'w-full md:w-1/2 h-1/2 md:h-full' : 'w-full'}`}>
                 <iframe
                    title="Gemini Live Preview"
                    srcDoc={creation.html}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};