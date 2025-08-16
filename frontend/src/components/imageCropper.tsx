// src/components/ImageCropper.tsx
import { useState, useRef, type SyntheticEvent } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (blob: Blob) => void;
  onClose: () => void;
}

// Helper function to generate the cropped image blob
function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2d context');

  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
}

// The actual cropper component
export function ImageCropper({ imageSrc, onCropComplete, onClose }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height);
    setCrop(initialCrop);
  };

  const handleCrop = async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;
    const croppedBlob = await getCroppedImg(imgRef.current, crop);
    onCropComplete(croppedBlob);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg space-y-4 max-w-md w-full">
        <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={1} circularCrop>
          <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Crop preview" style={{maxHeight: "70vh"}} />
        </ReactCrop>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button type="button" onClick={handleCrop} className="px-4 py-2 rounded-md bg-[#438989] text-white">Crop & Save</button>
        </div>
      </div>
    </div>
  );
}