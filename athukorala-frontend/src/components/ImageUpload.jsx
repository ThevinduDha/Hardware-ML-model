import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

const ImageUpload = ({ onUploadSuccess }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "inventory"); // Replace with your preset

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dg9exlyvz/image/upload", { // Replace with cloud name
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onUploadSuccess(data.secure_url);
      }
      setLoading(false);
    } catch (err) {
      console.error("Upload failed");
      setLoading(false);
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    setPreview(null);
    onUploadSuccess("");
  };

  return (
    <div className="group relative w-full h-48 border-2 border-dashed border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col items-center justify-center bg-white/[0.02] overflow-hidden mb-8">
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" />
          <button 
            onClick={removeImage}
            className="absolute top-4 right-4 p-2 bg-black/80 text-white rounded-full hover:bg-red-500 transition-colors z-10"
          >
            <X size={16} />
          </button>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="text-[#D4AF37] animate-spin" size={32} />
            </div>
          )}
        </>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-3 w-full h-full justify-center">
          <Upload className="text-[#D4AF37] group-hover:scale-110 transition-transform" size={32} />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 group-hover:text-white transition-colors">
            Upload Asset Photo
          </span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;