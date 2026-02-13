import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  label: string;
  image: UploadedImage | null;
  onImageUpload: (image: UploadedImage | null) => void;
  id: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageUpload, id, helperText }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract generic base64 data (remove data:image/xxx;base64, prefix for API if needed later, but keep full for preview)
      const base64Content = base64String.split(',')[1];
      
      onImageUpload({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64Content,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleRemove = () => {
    onImageUpload(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor={id}>
        {label}
      </label>
      
      {image ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm transition-all hover:shadow-md">
          <img 
            src={image.previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover bg-slate-100" 
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            title="Remover imagem"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
            {image.file.name}
          </div>
        </div>
      ) : (
        <label 
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 hover:border-blue-500 transition-all group"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <p className="mb-1 text-sm text-slate-700 font-medium">Clique para carregar</p>
            <p className="text-xs text-slate-400">PNG, JPG (MAX. 5MB)</p>
          </div>
          <input 
            id={id} 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
      )}
      {helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};