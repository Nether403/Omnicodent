/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ArrowUpTrayIcon, CpuChipIcon, MicrophoneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { MicrophoneIcon as MicrophoneSolid } from '@heroicons/react/24/solid';

interface InputAreaProps {
  onGenerate: (prompt: string, file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const CyclingText = () => {
    const words = [
        "A NAPKIN SKETCH",
        "A WHITEBOARD",
        "A GAME DESIGN",
        "A UI MOCKUP",
        "A DIAGRAM",
        "AN ANCIENT SCROLL"
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // fade out
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true); // fade in
            }, 500); // Wait for fade out
        }, 3000); // Slower cycle to read longer text
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-2 blur-sm'} text-brand-orange font-orbitron font-bold tracking-wider pb-1 border-b border-brand-orange/50`}>
            {words[index]}
        </span>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setPrompt(prev => prev ? prev + " " + transcript : transcript);
        };

        recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
        recognitionRef.current?.stop();
    } else {
        recognitionRef.current?.start();
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setSelectedFile(file);
      // Auto-focus the prompt input when file is selected
      setTimeout(() => textareaRef.current?.focus(), 100);
    } else {
      alert("Please upload an image or PDF.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating]);

  const handleSubmit = () => {
    if (!selectedFile && !prompt) return;
    onGenerate(prompt, selectedFile || undefined);
    // Reset after submit
    setSelectedFile(null);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000 mt-4">
      <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20">
        
        {/* Technical Header */}
        <div className="h-8 bg-slate-950/50 border-b border-white/5 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                <span className="text-[10px] font-orbitron tracking-widest text-slate-500 uppercase">Input Matrix</span>
            </div>
            <div className="text-[10px] font-mono text-slate-700">SYS.V.3.0</div>
        </div>

        <div className="p-1 md:p-2 space-y-2">
            
            {/* 1. Drag & Drop Zone */}
            <div 
                className={`relative group transition-all duration-500 ${isDragging ? 'scale-[0.99] opacity-90' : ''}`}
            >
                <label
                className={`
                    relative flex flex-col items-center justify-center
                    h-48 sm:h-56 md:h-64
                    bg-black/20
                    rounded border-2 border-dashed
                    cursor-pointer overflow-hidden
                    transition-all duration-300
                    ${isDragging 
                    ? 'border-brand-orange bg-brand-orange/5' 
                    : selectedFile 
                        ? 'border-brand-orange/50 bg-slate-900/40' 
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }
                    ${isGenerating ? 'pointer-events-none opacity-50' : ''}
                `}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); !disabled && setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                >
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                        style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                    </div>

                    {selectedFile ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                             <div className="relative w-16 h-16 mb-4 flex items-center justify-center bg-slate-900 rounded-lg border border-brand-orange/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                                {selectedFile.type.includes('image') ? (
                                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover rounded-lg opacity-80" />
                                ) : (
                                    <ArrowUpTrayIcon className="w-8 h-8 text-brand-orange" />
                                )}
                                <div className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">
                                    READY
                                </div>
                             </div>
                             <span className="text-sm font-orbitron tracking-wide text-white">{selectedFile.name}</span>
                             <span className="text-xs text-slate-500 mt-1">Click to replace</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center p-6 space-y-4">
                            <div className={`w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5 group-hover:border-brand-orange/30 transition-colors duration-500`}>
                                <ArrowUpTrayIcon className={`w-8 h-8 text-slate-500 transition-colors duration-300 ${isDragging ? 'text-brand-orange' : 'group-hover:text-slate-300'}`} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-orbitron text-slate-300">
                                    <span className="text-brand-orange">UPLOAD</span> <CyclingText />
                                </h3>
                                <p className="text-xs text-slate-500 font-mono">
                                    JPG, PNG, PDF, BMP SUPPORTED
                                </p>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isGenerating || disabled}
                    />
                </label>
            </div>

            {/* 2. Text Input & Actions */}
            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedFile ? "Describe how to bring this to life... (Optional)" : "Describe what you want to build..."}
                        className="w-full h-12 py-3 pl-4 pr-12 bg-black/40 border border-white/10 rounded focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 text-sm text-white placeholder-slate-600 resize-none transition-all font-inter"
                        disabled={isGenerating}
                    />
                    {/* Voice Button */}
                    {recognitionRef.current && (
                        <button
                            onClick={toggleListening}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? 'bg-brand-red text-white animate-pulse' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                            title="Voice Input"
                        >
                            {isListening ? <MicrophoneSolid className="w-4 h-4" /> : <MicrophoneIcon className="w-4 h-4" />}
                        </button>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isGenerating || (!selectedFile && !prompt)}
                    className={`
                        px-6 rounded font-orbitron font-bold tracking-wider text-sm uppercase transition-all duration-300
                        flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.2)]
                        ${isGenerating || (!selectedFile && !prompt)
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                            : 'bg-gradient-to-r from-brand-orange to-brand-red text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-[1.02] border border-transparent'
                        }
                    `}
                >
                    {isGenerating ? (
                        <>
                            <CpuChipIcon className="w-5 h-5 animate-spin" />
                            <span>Processing</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Ignite</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};