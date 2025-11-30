'use client';

// import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
// import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
// import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import { useEffect } from 'react';
import {
    Heading1,
    Heading2,
    List,
    Code,
    Bold,
    Italic,
    Strikethrough
} from 'lucide-react';

interface TiptapEditorProps {
    content: any;
    onChange: (content: any) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Type / for commands...',
            }),
            // BubbleMenuExtension,
            // FloatingMenuExtension,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] text-neutral-200',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    // Update editor content if content prop changes externally (e.g. switching pages)
    useEffect(() => {
        if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="relative">
            {/* Bubble Menu for Selected Text - TEMPORARILY DISABLED */}
            {/* {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 bg-neutral-900 border border-white/10 p-1 rounded-lg shadow-xl">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-blue-400 bg-white/10' : 'text-neutral-400'}`}
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-blue-400 bg-white/10' : 'text-neutral-400'}`}
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('strike') ? 'text-blue-400 bg-white/10' : 'text-neutral-400'}`}
                    >
                        <Strikethrough size={16} />
                    </button>
                </BubbleMenu>
            )} */}

            {/* Floating Menu for Empty Lines (Slash Command equivalent) - TEMPORARILY DISABLED */}
            {/* {editor && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 bg-neutral-900 border border-white/10 p-1 rounded-lg shadow-xl -ml-8">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-blue-400' : 'text-neutral-400'}`}
                        title="Heading 1"
                    >
                        <Heading1 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-blue-400' : 'text-neutral-400'}`}
                        title="Heading 2"
                    >
                        <Heading2 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'text-blue-400' : 'text-neutral-400'}`}
                        title="Bullet List"
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${editor.isActive('codeBlock') ? 'text-blue-400' : 'text-neutral-400'}`}
                        title="Code Block"
                    >
                        <Code size={18} />
                    </button>
                </FloatingMenu>
            )} */}

            <EditorContent editor={editor} />
        </div>
    );
}
