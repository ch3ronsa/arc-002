'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Trash2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';

const TiptapEditor = dynamic(() => import('./editor/TiptapEditor').then(mod => mod.TiptapEditor), { ssr: false });

interface Note {
    id: string;
    title: string;
    content: any;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

const DEFAULT_NOTE_CONTENT = {
    type: 'doc',
    content: [
        {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start writing your note...' }]
        }
    ]
};

export function NotesView({ workspaceId = '1' }: { workspaceId?: string }) {
    const { address } = useAccount();
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Load notes from Supabase
    useEffect(() => {
        if (!address) {
            setNotes([]);
            setSelectedNote(null);
            return;
        }

        const fetchNotes = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('wallet_address', address)
                .eq('workspace_id', workspaceId)
                .eq('is_encrypted', false)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error('Error fetching notes:', error);
                toast.error('Failed to load notes');
            } else {
                const mappedNotes = data?.map(n => ({
                    id: n.id,
                    title: n.title,
                    content: typeof n.content === 'string' ? JSON.parse(n.content) : n.content,
                    tags: [],
                    createdAt: n.created_at,
                    updatedAt: n.updated_at,
                })) || [];

                setNotes(mappedNotes);
                if (mappedNotes.length > 0 && !selectedNote) {
                    setSelectedNote(mappedNotes[0]);
                }
            }
            setIsLoading(false);
        };

        fetchNotes();
    }, [address, workspaceId]);

    const handleCreateNote = async () => {
        if (!address) {
            toast.error('Please connect your wallet');
            return;
        }

        const newNote: Note = {
            id: crypto.randomUUID(),
            title: 'Untitled Note',
            content: DEFAULT_NOTE_CONTENT,
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);

        // Save to Supabase
        const { error } = await supabase
            .from('notes')
            .insert({
                id: newNote.id,
                wallet_address: address,
                workspace_id: workspaceId,
                title: newNote.title,
                content: newNote.content,
                is_encrypted: false,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error creating note:', error);
            toast.error('Failed to create note');
        } else {
            toast.success('Note created');
        }
    };

    const handleSaveNote = async (note: Note) => {
        if (!address) return;

        const { error } = await supabase
            .from('notes')
            .upsert({
                id: note.id,
                wallet_address: address,
                workspace_id: workspaceId,
                title: note.title,
                content: note.content,
                is_encrypted: false,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error saving note:', error);
            toast.error('Failed to save note');
        } else {
            toast.success('Note saved');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!address) return;

        if (confirm('Are you sure you want to delete this note?')) {
            const newNotes = notes.filter(n => n.id !== id);
            setNotes(newNotes);
            if (selectedNote?.id === id) {
                setSelectedNote(newNotes.length > 0 ? newNotes[0] : null);
            }

            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id)
                .eq('wallet_address', address);

            if (error) {
                console.error('Error deleting note:', error);
                toast.error('Failed to delete note');
            }
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full h-full flex bg-[var(--background)] text-[var(--foreground)]">
            {/* Sidebar */}
            <div className="w-64 border-r border-[var(--border-color)] flex flex-col bg-[var(--card-bg)]">
                <div className="p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Notes</h2>
                        <button
                            onClick={handleCreateNote}
                            className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-[var(--foreground)] transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-black/20 border border-[var(--border-color)] rounded-md text-xs text-[var(--foreground)] placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {isLoading && <div className="text-xs text-center text-neutral-500 py-4">Loading notes...</div>}
                    {!isLoading && filteredNotes.length === 0 && <div className="text-xs text-center text-neutral-500 py-4">No notes found</div>}
                    {filteredNotes.map(note => (
                        <button
                            key={note.id}
                            onClick={() => setSelectedNote(note)}
                            className={twMerge(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors group",
                                selectedNote?.id === note.id ? "bg-blue-500/10 text-blue-400" : "text-neutral-400 hover:bg-white/5 hover:text-[var(--foreground)]"
                            )}
                        >
                            <FileText size={16} className={selectedNote?.id === note.id ? "text-blue-400" : "text-neutral-500"} />
                            <span className="truncate flex-1 text-left">{note.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedNote ? (
                    <>
                        {/* Header */}
                        <div className="h-14 border-b border-[var(--border-color)] flex items-center justify-between px-6 bg-[var(--card-bg)]">
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                <span>Last edited {new Date(selectedNote.updatedAt).toLocaleTimeString()}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleSaveNote(selectedNote)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => handleDeleteNote(selectedNote.id)}
                                    className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-4xl mx-auto px-12 py-12">
                                {/* Title Input */}
                                <input
                                    type="text"
                                    value={selectedNote.title}
                                    onChange={(e) => {
                                        const updated = { ...selectedNote, title: e.target.value, updatedAt: new Date().toISOString() };
                                        setSelectedNote(updated);
                                        setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
                                    }}
                                    placeholder="Untitled Note"
                                    className="w-full bg-transparent text-4xl font-bold text-[var(--foreground)] placeholder:text-neutral-700 border-none outline-none mb-8"
                                />

                                {/* Tiptap Editor */}
                                {mounted && (
                                    <TiptapEditor
                                        content={selectedNote.content}
                                        onChange={(content) => {
                                            const updated = { ...selectedNote, content, updatedAt: new Date().toISOString() };
                                            setSelectedNote(updated);
                                            setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>Select a note to start writing</p>
                    </div>
                )}
            </div>
        </div>
    );
}
