'use client';

import { useState, useEffect } from 'react';
import { Lock, Plus, Search, Tag, Calendar, Shield, Upload, Trash2, Eye, EyeOff, FileText, MoreVertical, Anchor, Save, ArrowLeft } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';
import { LockScreen } from './LockScreen';
import { SetPasswordScreen } from './SetPasswordScreen';
import { encryptData, decryptData } from '@/lib/encryption';

const TiptapEditor = dynamic(() => import('./editor/TiptapEditor').then(mod => mod.TiptapEditor), { ssr: false });

// ArcJournal ABI (JSON Format)
const ARC_JOURNAL_ABI = [
    {
        name: 'anchorDocument',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: '_docId', type: 'string' },
            { name: '_contentHash', type: 'string' }
        ],
        outputs: []
    }
] as const;

// Placeholder Contract Address - UPDATE THIS AFTER DEPLOYMENT
const ARC_JOURNAL_ADDRESS = "0xeB282dF68897C6245526e9BFD88e82eF5BcbD5c2";

interface Note {
    id: string;
    title: string;
    content: any; // JSON content from Tiptap
    tags: string[];
    createdAt: string;
    updatedAt: string;
    encrypted: boolean;
    onChain: boolean;
    txHash?: string;
    salt?: string; // For encryption
    iv?: string;   // For encryption
}

const DEFAULT_NOTE_CONTENT = {
    type: 'doc',
    content: [
        {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Start writing with Notion-style blocks. Type / for commands.' }]
        }
    ]
};

export function EncryptedNotesView({ workspaceId = '1' }: { workspaceId?: string }) {
    const { address } = useAccount();
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mobile state: show editor when a note is selected on mobile
    const [showMobileEditor, setShowMobileEditor] = useState(false);

    // Encryption State
    const [isLocked, setIsLocked] = useState(true);
    const [password, setPassword] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if user has password set on-chain
    const { data: hasPasswordData, isLoading: isCheckingPassword } = useReadContract({
        address: ARC_JOURNAL_ADDRESS,
        abi: ["function hasPassword(address _user) external view returns (bool)"],
        functionName: 'hasPassword',
        args: address ? [address] : undefined,
        chainId: 5042002,
    });

    const hasPassword = hasPasswordData as boolean;
    const [passwordSetupComplete, setPasswordSetupComplete] = useState(false);

    // Wagmi Hooks
    const { data: hash, writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

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
                .order('updated_at', { ascending: false });

            if (error) {
                console.error('Error fetching notes:', error);
                toast.error('Failed to load notes');
            } else {
                const mappedNotes = data?.map(n => ({
                    id: n.id,
                    title: n.title,
                    content: typeof n.content === 'string' ? JSON.parse(n.content) : n.content,
                    tags: [], // Tags not yet in DB schema for notes
                    createdAt: n.created_at,
                    updatedAt: n.updated_at,
                    encrypted: n.is_encrypted || true,
                    onChain: false, // Need to add this to DB schema if needed
                    salt: n.salt, // Assuming we add these columns or store in content wrapper
                    iv: n.iv
                })) || [];

                setNotes(mappedNotes);
                // Don't auto-select if locked to avoid confusion, or select but show blurred
                if (mappedNotes.length > 0 && !selectedNote) {
                    setSelectedNote(mappedNotes[0]);
                }
            }
            setIsLoading(false);
        };

        fetchNotes();
    }, [address, workspaceId]);

    // Handle Transaction Success
    useEffect(() => {
        if (isConfirmed && selectedNote) {
            toast.success("Document Snapshot Anchored to Arc Network");
            const updatedNote = { ...selectedNote, onChain: true, txHash: hash };
            setSelectedNote(updatedNote);
            setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
        }
    }, [isConfirmed, hash]);

    const handleUnlock = (pwd: string) => {
        setPassword(pwd);
        setIsLocked(false);
        toast.success("Notes unlocked");
    };

    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
        setShowMobileEditor(true); // Show editor on mobile when note is selected
    };

    const handleBackToList = () => {
        setShowMobileEditor(false);
    };

    const handleCreateNote = async () => {
        if (!address) {
            toast.error('Please connect your wallet');
            return;
        }
        if (isLocked) {
            toast.error('Please unlock notes first');
            return;
        }

        const newNote: Note = {
            id: crypto.randomUUID(),
            title: 'Untitled Page',
            content: DEFAULT_NOTE_CONTENT,
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            encrypted: true,
            onChain: false,
        };

        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
        setShowMobileEditor(true); // Show editor on mobile for new note

        // Save immediately (encrypted)
        await saveNoteToSupabase(newNote);
    };

    const saveNoteToSupabase = async (note: Note) => {
        if (!address || !password) {
            throw new Error('Wallet not connected or password not set');
        }

        // Encrypt content
        const { encrypted, salt, iv } = await encryptData(note.content, password);

        // We store the encrypted string in the content field for now, 
        // or we should update schema. For MVP, let's store a wrapper object if schema allows JSONB
        // Schema is JSONB for content.
        const encryptedContentWrapper = {
            encryptedData: encrypted,
            salt,
            iv,
            isEncryptedWrapper: true
        };

        const { error } = await supabase
            .from('notes')
            .upsert({
                id: note.id,
                wallet_address: address,
                workspace_id: workspaceId,
                title: note.title,
                content: encryptedContentWrapper, // Store encrypted wrapper
                is_encrypted: true,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
    };

    const handleSave = async () => {
        if (selectedNote) {
            toast.promise(saveNoteToSupabase(selectedNote), {
                loading: 'Encrypting and saving...',
                success: 'Note saved securely',
                error: 'Failed to save'
            });
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!address) return;

        if (confirm('Are you sure you want to delete this page?')) {
            const newNotes = notes.filter(n => n.id !== id);
            setNotes(newNotes);
            if (selectedNote?.id === id) {
                setSelectedNote(newNotes.length > 0 ? newNotes[0] : null);
                setShowMobileEditor(false);
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

    const handleUpdateNote = (updatedNote: Note) => {
        // Update local state immediately
        setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
        // We don't auto-save to DB on every keystroke for encryption performance/UX
        // User must click Save or we can implement debounce later.
        // For now, let's rely on the manual Save button as requested.
    };

    const handleAnchorDocument = async () => {
        if (!selectedNote || !address) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!writeContractAsync) {
            toast.error('Wallet functionality not available. Please refresh the page.');
            return;
        }

        const contentString = JSON.stringify(selectedNote.content);
        const mockHash = "0x" + Array.from(contentString).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0).toString(16).padStart(64, '0');

        try {
            const txHash = await writeContractAsync({
                address: ARC_JOURNAL_ADDRESS as `0x${string}`,
                abi: ARC_JOURNAL_ABI,
                functionName: 'anchorDocument',
                args: [selectedNote.id, mockHash],
                chainId: 5042002,
            });

            console.log('✅ Anchor transaction sent:', txHash);
            toast.success('Document anchored successfully!');

            // Update local state
            const updatedNote = { ...selectedNote, onChain: true, txHash: txHash };
            setSelectedNote(updatedNote);
            setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
        } catch (error: any) {
            console.error("Anchoring failed:", error);
            toast.error(error.shortMessage || error.message || 'Anchoring failed');
        }
    };

    // Decrypt selected note content on selection if locked/unlocked
    const [decryptedContent, setDecryptedContent] = useState<any>(null);

    useEffect(() => {
        const decryptCurrentNote = async () => {
            if (!selectedNote || !password) {
                setDecryptedContent(null);
                return;
            }

            // Check if content is already decrypted (legacy or new local)
            // If it matches the wrapper structure, it needs decryption
            const content = selectedNote.content;
            if (content && content.isEncryptedWrapper) {
                try {
                    const decrypted = await decryptData(
                        content.encryptedData,
                        password,
                        content.salt,
                        content.iv
                    );
                    setDecryptedContent(decrypted);
                } catch (e) {
                    console.error("Decryption failed", e);
                    toast.error("Failed to decrypt note. Wrong password?");
                }
            } else {
                // Not encrypted or legacy plain text
                setDecryptedContent(content);
            }
        };

        if (!isLocked) {
            decryptCurrentNote();
        }
    }, [selectedNote, password, isLocked]);


    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="w-full h-full flex bg-[var(--background)] text-[var(--foreground)] relative">
            {/* Show SetPasswordScreen if user doesn't have password and hasn't just completed setup */}
            {!isCheckingPassword && !hasPassword && !passwordSetupComplete && (
                <SetPasswordScreen onPasswordSet={(pwd) => {
                    setPassword(pwd);
                    setPasswordSetupComplete(true);
                    setIsLocked(false);
                    toast.success("Password set! You can now create notes.");
                }} />
            )}

            {/* Show LockScreen if password exists but notes are locked */}
            {hasPassword && isLocked && <LockScreen onUnlock={handleUnlock} />}

            {/* Sidebar - Hidden on mobile when editor is shown */}
            <div className={clsx(
                "w-full md:w-64 border-r border-[var(--border-color)] flex flex-col bg-[var(--card-bg)] backdrop-blur-xl transition-all",
                isLocked && "blur-sm pointer-events-none",
                showMobileEditor ? "hidden md:flex" : "flex"
            )}>
                <div className="p-3 md:p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h2 className="text-xs md:text-sm font-semibold text-neutral-500 uppercase tracking-wider">Pages</h2>
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
                            placeholder="Search pages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-black/20 border border-[var(--border-color)] rounded-md text-xs text-[var(--foreground)] placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {isLoading && <div className="text-xs text-center text-neutral-500 py-4">Loading notes...</div>}
                    {!isLoading && filteredNotes.length === 0 && <div className="text-xs text-center text-neutral-500 py-4">No pages found</div>}
                    {filteredNotes.map(note => (
                        <button
                            key={note.id}
                            onClick={() => handleSelectNote(note)}
                            className={twMerge(
                                "w-full flex items-center gap-2 px-3 py-2.5 md:py-2 rounded-md text-sm transition-colors group",
                                selectedNote?.id === note.id ? "bg-purple-500/10 text-purple-400" : "text-neutral-400 hover:bg-white/5 hover:text-[var(--foreground)]"
                            )}
                        >
                            <FileText size={16} className={selectedNote?.id === note.id ? "text-purple-400" : "text-neutral-500"} />
                            <span className="truncate flex-1 text-left">{note.title}</span>
                            {note.onChain && <Shield size={12} className="text-blue-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Editor Area - Full screen on mobile when editing */}
            <div className={clsx(
                "flex-1 flex flex-col h-full overflow-hidden relative transition-all",
                isLocked && "blur-md pointer-events-none",
                showMobileEditor ? "flex" : "hidden md:flex"
            )}>
                {selectedNote ? (
                    <>
                        {/* Header */}
                        <div className="h-12 md:h-14 border-b border-[var(--border-color)] flex items-center justify-between px-3 md:px-6 bg-[var(--card-bg)] backdrop-blur-sm z-10">
                            {/* Mobile Back Button */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleBackToList}
                                    className="p-2 rounded-md hover:bg-white/10 text-neutral-400 md:hidden"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="hidden md:flex items-center gap-2 text-sm text-neutral-500">
                                    <span className="flex items-center gap-1 text-purple-400">
                                        <Lock size={12} /> Encrypted
                                    </span>
                                    {selectedNote.onChain && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                            <span className="flex items-center gap-1 text-blue-400">
                                                <Shield size={12} /> Anchored
                                            </span>
                                        </>
                                    )}
                                </div>
                                {/* Mobile: Show encrypted badge only */}
                                <span className="flex md:hidden items-center gap-1 text-xs text-purple-400">
                                    <Lock size={10} /> Encrypted
                                </span>
                            </div>

                            <div className="flex items-center gap-1 md:gap-2">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                                >
                                    <Save size={14} />
                                    <span className="hidden sm:inline">Save</span>
                                </button>
                                <button
                                    onClick={handleAnchorDocument}
                                    disabled={isPending || isConfirming || selectedNote.onChain}
                                    className={twMerge(
                                        "flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
                                        selectedNote.onChain
                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20 cursor-default"
                                            : "bg-white/5 text-neutral-300 border-[var(--border-color)] hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {isPending || isConfirming ? (
                                        <span className="animate-pulse">...</span>
                                    ) : selectedNote.onChain ? (
                                        <>
                                            <Shield size={14} />
                                            <span className="hidden sm:inline">Anchored</span>
                                        </>
                                    ) : (
                                        <>
                                            <Anchor size={14} />
                                            <span className="hidden sm:inline">Anchor</span>
                                        </>
                                    )}
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
                            <div className="max-w-4xl mx-auto px-4 md:px-12 py-6 md:py-12">
                                {/* Title Input */}
                                <input
                                    type="text"
                                    value={selectedNote.title}
                                    onChange={(e) => {
                                        const updated = { ...selectedNote, title: e.target.value, updatedAt: new Date().toISOString() };
                                        setSelectedNote(updated);
                                        handleUpdateNote(updated);
                                    }}
                                    placeholder="Untitled Page"
                                    className="w-full bg-transparent text-2xl md:text-4xl font-bold text-[var(--foreground)] placeholder:text-neutral-700 border-none outline-none mb-6 md:mb-8"
                                />

                                {/* Tiptap Editor */}
                                {mounted && decryptedContent && (
                                    <TiptapEditor
                                        content={decryptedContent}
                                        onChange={(content) => {
                                            const updated = { ...selectedNote, content, updatedAt: new Date().toISOString() };
                                            setSelectedNote(updated);
                                            handleUpdateNote(updated);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 p-4">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="text-center">Select a page to start writing</p>
                    </div>
                )}
            </div>
        </div>
    );
}
