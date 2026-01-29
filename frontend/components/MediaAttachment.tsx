'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X, Image as ImageIcon, FileText, Globe, Check } from 'lucide-react';

interface Attachment {
    id: string;
    name: string;
    size: string;
    type: 'image' | 'pdf' | 'link';
}

export default function MediaAttachment() {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const simulateUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            const newAttachment: Attachment = {
                id: Math.random().toString(),
                name: 'Technical_Spec_v2.pdf',
                size: '1.2 MB',
                type: 'pdf'
            };
            setAttachments([...attachments, newAttachment]);
            setIsUploading(false);
        }, 1500);
    };

    const removeAttachment = (id: string) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-4 mb-4">
                <AnimatePresence>
                    {attachments.map((a) => (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group"
                        >
                            <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center">
                                {a.type === 'pdf' ? <FileText className="w-4 h-4 text-blue-500" /> : <ImageIcon className="w-4 h-4 text-orange-500" />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-tight">{a.name}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase">{a.size}</p>
                            </div>
                            <button
                                onClick={() => removeAttachment(a.id)}
                                className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={simulateUpload}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-2xl transition-all group disabled:opacity-50"
                >
                    {isUploading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <Paperclip className="w-4 h-4 text-slate-500 group-hover:text-orange-500 transition-colors" />
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">Attach Tech Spec</span>
                        </>
                    )}
                </button>

                <button className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
                    <Globe className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">Add Link</span>
                </button>
            </div>
        </div>
    );
}
