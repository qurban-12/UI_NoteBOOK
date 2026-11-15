import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Save,
  Star,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';
import { NOTE_CATEGORIES } from '../services/noteService';
import { stripHtml } from '../utils/validation';

export function NoteEditor({
  initialTitle = '',
  initialContent = '',
  initialCategory = 'Work',
  initialFavorite = false,
  isSubmitting = false,
  submitLabel = 'Save Note',
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState(initialCategory);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [content, setContent] = useState(initialContent);
  const [titleError, setTitleError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your thoughts, meeting notes, or ideas...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor: instance }) => {
      setContent(instance.getHTML());
    },
  });

  useEffect(() => {
    setTitle(initialTitle);
    setCategory(initialCategory);
    setIsFavorite(initialFavorite);
    setContent(initialContent);
    if (editor && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent || '');
    }
  }, [initialTitle, initialContent, initialCategory, initialFavorite, editor]);

  const plainText = stripHtml(content);
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = plainText.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Please enter a note title.');
      return;
    }
    setTitleError('');
    await onSave({
      title: title.trim(),
      content: editor ? editor.getHTML() : content,
      category,
      isFavorite,
    });
  };

  const toolbarButtonClass = (active) =>
    `p-2 rounded-md transition-colors cursor-pointer ${
      active
        ? 'bg-indigo-50 text-[#6366F1]'
        : 'text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100'
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      {/* Top Meta Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label
              htmlFor="note-category"
              className="text-xs font-medium text-[#64748B] whitespace-nowrap"
            >
              Category
            </label>
            <select
              id="note-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs font-medium text-[#1E293B] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6366F1] cursor-pointer"
            >
              {NOTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-pressed={isFavorite}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isFavorite
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-slate-200 text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Star
              className="w-3.5 h-3.5"
              fill={isFavorite ? 'currentColor' : 'none'}
            />
            <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono tabular-nums">
          <span>{wordCount} words</span>
          <span aria-hidden="true">·</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Title Field */}
      <div className="px-6 pt-6 pb-3">
        <label htmlFor="note-title" className="sr-only">
          Note title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          placeholder="Untitled Note"
          className="w-full font-display text-2xl sm:text-3xl font-bold text-[#1E293B] placeholder:text-slate-300 focus:outline-none"
        />
        {titleError && (
          <p className="mt-1.5 text-xs font-medium text-[#EF4444]" role="alert">
            {titleError}
          </p>
        )}
      </div>

      {/* Rich Text Formatting Toolbar */}
      {editor && (
        <div
          className="px-6 py-2 border-y border-slate-100 bg-slate-50/70 flex items-center gap-1 flex-wrap"
          role="toolbar"
          aria-label="Formatting options"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            aria-label="Heading 1"
            title="Heading 1"
            className={toolbarButtonClass(editor.isActive('heading', { level: 1 }))}
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
            title="Heading 2"
            className={toolbarButtonClass(editor.isActive('heading', { level: 2 }))}
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-200 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
            title="Bold"
            className={toolbarButtonClass(editor.isActive('bold'))}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
            title="Italic"
            className={toolbarButtonClass(editor.isActive('italic'))}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            aria-label="Underline"
            title="Underline"
            className={toolbarButtonClass(editor.isActive('underline'))}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            aria-label="Strikethrough"
            title="Strikethrough"
            className={toolbarButtonClass(editor.isActive('strike'))}
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-200 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
            title="Bullet list"
            className={toolbarButtonClass(editor.isActive('bulletList'))}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Ordered list"
            title="Ordered list"
            className={toolbarButtonClass(editor.isActive('orderedList'))}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="Quote"
            title="Quote"
            className={toolbarButtonClass(editor.isActive('blockquote'))}
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            aria-label="Code block"
            title="Code block"
            className={toolbarButtonClass(editor.isActive('codeBlock'))}
          >
            <Code className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-200 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            aria-label="Undo"
            title="Undo"
            className="p-2 rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            aria-label="Redo"
            title="Redo"
            className="p-2 rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rich Text Body */}
      <div className="px-6 py-5 tiptap-editor">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
