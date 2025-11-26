/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { XMarkIcon, BookOpenIcon, CpuChipIcon, EyeIcon, ClockIcon, BoltIcon } from '@heroicons/react/24/outline';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900/95 border border-white/10 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col backdrop-blur-xl">
        
        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-red opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded bg-brand-orange/10 border border-brand-orange/20">
                <BookOpenIcon className="w-5 h-5 text-brand-orange" />
            </div>
            <div>
                <h2 className="font-orbitron font-bold tracking-widest text-white text-lg uppercase">System Manual</h2>
                <div className="text-[10px] font-mono text-slate-500">REV 2.4 // AUTHORIZED PERSONNEL ONLY</div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="group p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Intro */}
          <div className="p-4 rounded border border-brand-orange/20 bg-brand-orange/5 flex items-start gap-4">
             <CpuChipIcon className="w-6 h-6 text-brand-orange shrink-0 mt-1" />
             <div>
                 <h3 className="font-orbitron text-sm font-bold text-brand-orange uppercase tracking-wider mb-1">Core Directive</h3>
                 <p className="text-slate-300 text-sm leading-relaxed">
                    This system uses the Gemini 3.0 Pro model to analyze visual inputs and instantly reconstructs them into fully functional interactive applications. It bridges the gap between static design artifacts and living code.
                 </p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
              
              {/* Input Section */}
              <section className="space-y-4">
                 <h3 className="font-orbitron text-white text-lg border-l-2 border-brand-orange pl-3">Input Protocols</h3>
                 
                 <div className="space-y-3">
                    <div className="group bg-white/5 p-3 rounded border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold font-orbitron text-slate-400 group-hover:text-brand-orange transition-colors">01 // FILE UPLOAD</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Drag & drop or select files. Supported formats: <span className="text-slate-300">PNG, JPG, WEBP, BMP, PDF</span>. The system automatically converts legacy formats.
                        </p>
                    </div>

                    <div className="group bg-white/5 p-3 rounded border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold font-orbitron text-slate-400 group-hover:text-brand-orange transition-colors">02 // VOICE COMMAND</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Activate the microphone icon to dictate instructions naturally. The audio is transcribed in real-time to guide the generation process.
                        </p>
                    </div>

                    <div className="group bg-white/5 p-3 rounded border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold font-orbitron text-slate-400 group-hover:text-brand-orange transition-colors">03 // TEXT OVERRIDE</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Provide specific context (e.g., "Make the buttons red," "Turn this sketch into a snake game") to refine the output logic.
                        </p>
                    </div>
                 </div>
              </section>

              {/* Output Section */}
              <section className="space-y-4">
                 <h3 className="font-orbitron text-white text-lg border-l-2 border-brand-red pl-3">Output Modules</h3>
                 
                 <div className="space-y-3">
                    <div className="group bg-white/5 p-3 rounded border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <BoltIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold font-orbitron text-slate-400 group-hover:text-brand-red transition-colors">LIVE PREVIEW</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Interact with the generated app immediately in a secure sandbox. The output is a single-file HTML/JS/CSS artifact.
                        </p>
                    </div>

                    <div className="group bg-white/5 p-3 rounded border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <EyeIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold font-orbitron text-slate-400 group-hover:text-brand-red transition-colors">SPLIT ANALYSIS</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Toggle the split-view icon to compare your original input image side-by-side with the generated code execution.
                        </p>
                    </div>

                    <div className="group bg-white/5 p-3 rounded border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <ClockIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold font-orbitron text-slate-400 group-hover:text-brand-red transition-colors">MISSION LOGS</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Previous generations are saved locally. Click any card in the bottom history bar to reload that specific artifact.
                        </p>
                    </div>
                 </div>
              </section>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950/50 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-mono text-slate-600">SYSTEM STATUS: OPERATIONAL</span>
            <button 
                onClick={onClose}
                className="px-8 py-2 bg-gradient-to-r from-brand-orange to-brand-red text-white font-orbitron text-xs font-bold uppercase tracking-widest rounded-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all"
            >
                Close Manual
            </button>
        </div>
      </div>
    </div>
  );
};
