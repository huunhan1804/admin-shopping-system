<<<<<<< HEAD
import React, { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
=======
// components/common/RichTextEditor.jsx
import React, { useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
>>>>>>> parent of 56b74bd (update)
  Underline,
  List, 
  ListOrdered,
  Link, 
  Image, 
  Code,
  Quote,
  Heading2,
  Undo,
  Redo,
} from "lucide-react";
import { Image, Camera } from "lucide-react";

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const editorRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
<<<<<<< HEAD
  const [linkUrl, setLinkUrl] = useState("");
  const lastExternalHtml = useRef("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

const handleFileSelected = (file) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const imgHTML = `
      <div class="image-item" style="
        position: relative;
        display: inline-block;
        flex: 0 0 auto;
        width: 150px;
        height: 150px;
        margin: 5px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        transition: transform 0.2s ease;
      ">
        <img src="${reader.result}" 
             alt="" 
             style="width: 100%; height: 100%; object-fit: cover; display: block;" />
        <button class="delete-btn" style="
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(243, 61, 61, 0.85);
          color: white;
          border: none;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          font-size: 14px;
          font-weight: bold;
          line-height: 18px;
          text-align: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease;
        ">×</button>
      </div>
    `;

    // Nếu chưa có container thì tạo
    let container = editorRef.current.querySelector(".image-list");
    if (!container) {
      container = document.createElement("div");
      container.className = "image-list";
      container.style.cssText = `
        display: flex;
        overflow-x: auto;
        gap: 8px;
        padding: 8px;
        border-radius: 6px;
      `;
      editorRef.current.appendChild(container);
    }

    container.insertAdjacentHTML("beforeend", imgHTML);

    // Gắn hiệu ứng hover hiển thị nút xóa
    const newItem = container.lastElementChild;
    newItem.addEventListener("mouseenter", () => {
      newItem.querySelector(".delete-btn").style.opacity = 1;
      newItem.style.transform = "scale(1.03)";
    });
    newItem.addEventListener("mouseleave", () => {
      newItem.querySelector(".delete-btn").style.opacity = 0;
      newItem.style.transform = "scale(1)";
    });

    // Gắn sự kiện xóa
    newItem.querySelector(".delete-btn").addEventListener("click", () => {
      newItem.remove();
      emitChange();
    });

    emitChange();
  };
  reader.readAsDataURL(file);
};

  const pickFromDevice = () => fileInputRef.current?.click();
  const captureFromCamera = () => cameraInputRef.current?.click(); // track html đã sync từ props

  // ép LTR & canh trái ngay từ đầu
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.setAttribute("dir", "ltr");
    editorRef.current.style.direction = "ltr";
    editorRef.current.style.textAlign = "left";
    editorRef.current.style.unicodeBidi = "plaintext";
  }, []);

  // chỉ sync khi value từ ngoài thay đổi thật sự
  useEffect(() => {
    if (!editorRef.current) return;
    const next = (value || "").replace(BIDI_CONTROL_REGEX, "");
    if (next !== lastExternalHtml.current) {
      editorRef.current.innerHTML = next;
      lastExternalHtml.current = next;
    }
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleClick = (e) => {
      if (e.target.tagName === "IMG") {
        setSelectedImage(e.target);
      } else {
        setSelectedImage(null);
      }
    };

    editor.addEventListener("click", handleClick);
    return () => editor.removeEventListener("click", handleClick);
  }, []);

  const deleteSelectedImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
      emitChange(); // cập nhật state ngoài
    }
  };

  const emitChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML.replace(BIDI_CONTROL_REGEX, "");
    if (html !== lastExternalHtml.current) {
      lastExternalHtml.current = html;
      onChange(html);
    }
  };

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    // giữ LTR
    if (editorRef.current) {
      editorRef.current.setAttribute("dir", "ltr");
      editorRef.current.style.direction = "ltr";
      editorRef.current.style.textAlign = "left";
=======
  const [linkUrl, setLinkUrl] = useState('');

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
>>>>>>> parent of 56b74bd (update)
    }
  };

<<<<<<< HEAD
  const handlePaste = (e) => {
    e.preventDefault();
    const text =
      (e.clipboardData || window.clipboardData).getData("text/plain") || "";
    const clean = text.replace(BIDI_CONTROL_REGEX, "");
    document.execCommand("insertText", false, clean);
    emitChange();
  };

  const handleInput = () => {
    if (editorRef.current) {
      editorRef.current.setAttribute("dir", "ltr");
      editorRef.current.style.direction = "ltr";
      editorRef.current.style.textAlign = "left";
    }
    emitChange();
=======
  const handleFormat = (command) => {
    executeCommand(command);
>>>>>>> parent of 56b74bd (update)
  };

  const handleLink = () => {
    if (linkUrl) {
<<<<<<< HEAD
      exec("createLink", linkUrl);
=======
      executeCommand('createLink', linkUrl);
>>>>>>> parent of 56b74bd (update)
      setShowLinkDialog(false);
      setLinkUrl("");
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
    <div
      className={`border rounded-lg ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("undo")}
=======
            onClick={() => executeCommand('undo')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="Hoàn tác"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("redo")}
=======
            onClick={() => executeCommand('redo')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="Làm lại"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("bold")}
=======
            onClick={() => handleFormat('bold')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="In đậm"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("italic")}
=======
            onClick={() => handleFormat('italic')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="In nghiêng"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("underline")}
=======
            onClick={() => handleFormat('underline')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="Gạch chân"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("formatBlock", "<h2>")}
=======
            onClick={() => executeCommand('formatBlock', '<h2>')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="Tiêu đề"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("formatBlock", "<blockquote>")}
=======
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="Trích dẫn"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("insertUnorderedList")}
=======
            onClick={() => handleFormat('insertUnorderedList')}
>>>>>>> parent of 56b74bd (update)
            className="p-2 hover:bg-gray-200 rounded"
            title="Danh sách"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => exec("insertOrderedList")}
=======
            onClick={() => handleFormat('insertOrderedList')}
>>>>>>> parent of 56b74bd (update)
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
<<<<<<< HEAD
        </div>

        {/* Chèn ảnh */}
        <div className="flex items-center space-x-1 border-r pr-2 mr-2">
          <button
            type="button"
            onClick={pickFromDevice}
            className="p-2 hover:bg-gray-200 rounded"
            title="Tải từ thiết bị"
          >
            <Image className="w-4 h-4" />
=======
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
>>>>>>> parent of 56b74bd (update)
          </button>
          <button
            type="button"
            onClick={captureFromCamera}
            className="p-2 hover:bg-gray-200 rounded"
            title="Chụp ảnh"
          >
            <Camera className="w-4 h-4" />
          </button>
          {/* hidden inputs */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />
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