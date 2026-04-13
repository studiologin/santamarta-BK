"use client";

import { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#0d1b2a]/50">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn(
                    "w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center",
                    editor.isActive('bold') ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Negrito"
            >
                <b className="font-serif">B</b>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn(
                    "w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center",
                    editor.isActive('italic') ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Itálico"
            >
                <i className="font-serif">I</i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn(
                    "w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center",
                    editor.isActive('strike') ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Tachado"
            >
                <s className="font-serif">S</s>
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(
                    "px-2 h-8 rounded shrink-0 transition-colors flex items-center justify-center font-bold text-[10px]",
                    editor.isActive('heading', { level: 2 }) ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Título Secundário"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn(
                    "px-2 h-8 rounded shrink-0 transition-colors flex items-center justify-center font-bold text-[10px]",
                    editor.isActive('heading', { level: 3 }) ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Subtítulo"
            >
                H3
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                    "w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center",
                    editor.isActive('bulletList') ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Lista de Pontos"
            >
                <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                    "w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center",
                    editor.isActive('orderedList') ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Lista Numerada"
            >
                <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1 shrink-0" />
            <button
                type="button"
                onClick={() => {
                    const url = window.prompt('URL:');
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    }
                }}
                className={cn(
                    "w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center",
                    editor.isActive('link') ? "bg-[#cba36d]/20 text-[#cba36d]" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title="Inserir Link"
            >
                <span className="material-symbols-outlined text-[18px]">add_link</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                className={cn(
                    "w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white",
                    !editor.isActive('link') && "opacity-30 cursor-not-allowed hover:bg-transparent"
                )}
                title="Remover Link"
            >
                <span className="material-symbols-outlined text-[18px]">link_off</span>
            </button>
            <div className="flex-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Desfazer"
            >
                <span className="material-symbols-outlined text-[18px]">undo</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="w-8 h-8 rounded shrink-0 transition-colors flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Refazer"
            >
                <span className="material-symbols-outlined text-[18px]">redo</span>
            </button>
        </div>
    );
};

export function TiptapEditor({ value, onChange, placeholder, className }: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#cba36d] underline hover:text-[#e0b885]',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4 text-slate-300 prose-headings:text-white prose-a:text-[#cba36d] prose-strong:text-white',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sincronizar value externo se necessário (útil quando carrega dados do DB atrasado)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Verifica se está vazio e o value também (evita resetar estado interno atoa)
            if (value === "" && editor.getHTML() === "<p></p>") return;
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className={cn("flex flex-col border border-white/10 rounded-xl overflow-hidden bg-[#050b14] focus-within:border-[#cba36d]/50 focus-within:ring-1 focus-within:ring-[#cba36d]/50 transition-all", className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
