// components/common/RichTextEditor.jsx
import React, { useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
  List, 
  ListOrdered,
  Link, 
  Image, 
  Code,
  Quote,
  Heading2,
  Undo,
  Redo
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const editorRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFormat = (command) => {
    executeCommand(command);
  };

  const handleLink = () => {
    if (linkUrl) {
      executeCommand('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl('');
    }
  };

  const handleImage = () => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Hoàn tác"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Làm lại"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="p-2 hover:bg-gray-200 rounded"
            title="In đậm"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="p-2 hover:bg-gray-200 rounded"
            title="In nghiêng"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Gạch chân"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Tiêu đề"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Trích dẫn"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={() => handleFormat('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Danh sách"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Danh sách có thứ tự"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setShowLinkDialog(true)}
            className="p-2 hover:bg-gray-200 rounded"
            title="Chèn liên kết"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleImage}
            className="p-2 hover:bg-gray-200 rounded"
            title="Chèn hình ảnh"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<pre>')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none"
        placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
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
          <button
            type="button"
            onClick={handleLink}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Chèn
          </button>
          <button
            type="button"
            onClick={() => setShowLinkDialog(false)}
            className="px-4 py-2 ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;