import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  // Image,   // removed
  Code,
  Quote,
  Heading2,
  Undo,
  Redo
} from 'lucide-react';
import { Image, Camera } from 'lucide-react';



const BIDI_CONTROL_REGEX = /[\u202A-\u202E\u2066-\u2069\u200E\u200F]/g;

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const editorRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const lastExternalHtml = useRef('');



  // ép LTR & canh trái ngay từ đầu
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.setAttribute('dir', 'ltr');
    editorRef.current.style.direction = 'ltr';
    editorRef.current.style.textAlign = 'left';
    editorRef.current.style.unicodeBidi = 'plaintext';
  }, []);

  // chỉ sync khi value từ ngoài thay đổi thật sự
  useEffect(() => {
    if (!editorRef.current) return;
    const next = (value || '').replace(BIDI_CONTROL_REGEX, '');
    if (next !== lastExternalHtml.current) {
      editorRef.current.innerHTML = next;
      lastExternalHtml.current = next;
    }
  }, [value]);

  const emitChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML.replace(BIDI_CONTROL_REGEX, '');
    if (html !== lastExternalHtml.current) {
      lastExternalHtml.current = html;
      onChange(html);
    }
  };

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    // giữ LTR
    if (editorRef.current) {
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
    }
    emitChange();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain') || '';
    const clean = text.replace(BIDI_CONTROL_REGEX, '');
    document.execCommand('insertText', false, clean);
    emitChange();
  };

  const handleInput = () => {
    if (editorRef.current) {
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
    }
    emitChange();
  };

  const handleLink = () => {
    if (linkUrl) {
      exec('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl('');
    }
  };

  return (
    <div className={`border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button type="button" onClick={() => exec('undo')} className="p-2 hover:bg-gray-200 rounded" title="Hoàn tác">
            <Undo className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => exec('redo')} className="p-2 hover:bg-gray-200 rounded" title="Làm lại">
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button type="button" onClick={() => exec('bold')} className="p-2 hover:bg-gray-200 rounded" title="In đậm">
            <Bold className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => exec('italic')} className="p-2 hover:bg-gray-200 rounded" title="In nghiêng">
            <Italic className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => exec('underline')} className="p-2 hover:bg-gray-200 rounded" title="Gạch chân">
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button type="button" onClick={() => exec('formatBlock', '<h2>')} className="p-2 hover:bg-gray-200 rounded" title="Tiêu đề">
            <Heading2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => exec('formatBlock', '<blockquote>')} className="p-2 hover:bg-gray-200 rounded" title="Trích dẫn">
            <Quote className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button type="button" onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded" title="Danh sách">
            <List className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded" title="Danh sách có thứ tự">
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        

        <div className="flex items-center space-x-1">
          <button type="button" onClick={() => setShowLinkDialog(true)} className="p-2 hover:bg-gray-200 rounded" title="Chèn liên kết">
            <Link className="w-4 h-4" />
          </button>
          {/* Bỏ nút chèn hình ảnh */}
          <button type="button" onClick={() => exec('formatBlock', '<pre>')} className="p-2 hover:bg-gray-200 rounded" title="Code">
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>


      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        className="min-h-[300px] p-4 focus:outline-none text-left"
        onInput={handleInput}
        onPaste={handlePaste}
        // KHÔNG dùng dangerouslySetInnerHTML ở đây nữa mỗi render
        data-placeholder={placeholder}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="absolute bg-white border rounded-lg shadow-lg p-4 mt-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Nhập URL..."
            className="px-3 py-2 border rounded-lg mr-2"
          />
          <button type="button" onClick={handleLink} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Chèn
          </button>
          <button type="button" onClick={() => setShowLinkDialog(false)} className="px-4 py-2 ml-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
