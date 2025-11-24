/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ClockIcon, ArrowRightIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

export interface Creation {
  id: string;
  name: string;
  html: string;
  originalImage?: string; // Base64 data URL
  timestamp: Date;
}

interface CreationHistoryProps {
  history: Creation[];
  onSelect: (creation: Creation) => void;
}

export const CreationHistory: React.FC<CreationHistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center space-x-3 mb-4 px-2">
        <ClockIcon className="w-4 h-4 text-brand-orange" />
        <h2 className="text-[10px] font-bold font-orbitron uppercase tracking-[0.2em] text-slate-500">Mission Logs</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-brand-orange/50 to-transparent opacity-30"></div>
      </div>
      
      {/* Horizontal Scroll Container for Compact Layout */}
      <div className="flex overflow-x-auto space-x-4 pb-4 px-2 scrollbar-hide">
        {history.map((item) => {
          const isPdf = item.originalImage?.startsWith('data:application/pdf');
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex-shrink-0 relative flex flex-col text-left w-48 h-32 bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-brand-orange/50 rounded-sm transition-all duration-300 overflow-hidden backdrop-blur-md"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10 group-hover:border-brand-orange transition-colors"></div>

              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-1.5 bg-slate-950 rounded-sm group-hover:bg-brand-orange/10 transition-colors border border-white/5 group-hover:border-brand-orange/30">
                      {isPdf ? (
                          <DocumentIcon className="w-4 h-4 text-slate-500 group-hover:text-brand-orange transition-colors" />
                      ) : item.originalImage ? (
                          <PhotoIcon className="w-4 h-4 text-slate-500 group-hover:text-brand-orange transition-colors" />
                      ) : (
                          <DocumentIcon className="w-4 h-4 text-slate-500 group-hover:text-brand-orange transition-colors" />
                      )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-xs font-bold font-orbitron text-slate-300 group-hover:text-white truncate tracking-wider uppercase">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2 opacity-50 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
                    <span className="text-[8px] text-brand-orange uppercase tracking-widest font-bold">Load Artifact</span>
                    <ArrowRightIcon className="w-3 h-3 text-brand-orange" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};