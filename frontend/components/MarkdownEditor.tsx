'use client';

import React, { useState } from 'react';
import { Bold, Italic, Link, List, ImageIcon, Eye, Code } from 'lucide-react';

interface MarkdownEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false);

    const toolbarItems = [
        { icon: Bold, label: 'Bold', action: '**text**' },
        { icon: Italic, label: 'Italic', action: '_text_' },
        { icon: Link, label: 'Link', action: '[text](url)' },
        { icon: List, label: 'List', action: '\n- ' },
        { icon: ImageIcon, label: 'Image', action: '![alt](url)' },
        { icon: Code, label: 'Code', action: '`code`' },
    ];

    return (
        <div className="w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-1">
                    {toolbarItems.map((item) => (
                        <button
                            key={item.label}
                            disabled={isPreview}
                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all disabled:opacity-20"
                            title={item.label}
                            onClick={() => onChange(value + item.action)}
                        >
                            <item.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPreview ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                >
                    {isPreview ? <Eye className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {isPreview ? 'Editor' : 'Preview'}
                </button>
            </div>

            <div className="p-4 min-h-[200px] flex">
                {isPreview ? (
                    <div className="flex-1 text-slate-300 text-sm whitespace-pre-wrap font-medium">
                        {value || <span className="opacity-30 italic">No content to preview</span>}
                    </div>
                ) : (
                    <textarea
                        className="flex-1 bg-transparent border-none outline-none text-white text-sm font-medium resize-none placeholder:text-slate-700"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )}
            </div>

            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-600 uppercase uppercase">Markdown Supported</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">{value.length} Characters</span>
            </div>
        </div>
    );
}
