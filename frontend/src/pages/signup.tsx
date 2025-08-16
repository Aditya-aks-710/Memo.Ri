import { Button } from "../components/button";
import * as Icon from '../icons';
import { InputBox } from "../components/input";
import { useState, useRef, type FormEvent, type SyntheticEvent } from "react";
//@ts-ignore
import axios, { isAxiosError } from "axios"; // Make sure axios is updated: npm install axios@latest
import { useNavigate } from "react-router-dom";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

//=========== 1. Type Definitions for API Responses ===========
interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
}

interface SignUpApiResponse {
  message: string;
  token?: string;
}

//=========== 2. Image Cropper Component (self-contained) ===========
interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (blob: Blob) => void;
  onClose: () => void;
}

function ImageCropper({ imageSrc, onCropComplete, onClose }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height);
    setCrop(initialCrop);
  }

  async function handleCrop() {
    if (!imgRef.current || !crop?.width || !crop?.height) return;
    const croppedBlob = await getCroppedImg(imgRef.current, crop);
    onCropComplete(croppedBlob);
  }

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-80">
      <div className="bg-white p-4 rounded-lg space-y-4 w-fit">
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


//=========== 3. Main SignUpBox Component ===========
interface SignUpBoxProps {
    onClose: () => void;
}

export function SignUpBox({ onClose }: SignUpBoxProps) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result as string));
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const onCropComplete = (blob: Blob) => {
        setCroppedImageBlob(blob);
        setCroppedImageUrl(URL.createObjectURL(blob));
        setImageSrc(null); // This closes the cropper modal
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name) {
            setErrorMsg("All fields are required.");
            return;
        }
        setLoading(true);
        setErrorMsg("");
        let profilePictureUrl = "";

        try {
            // STEP 1: UPLOAD IMAGE TO CLOUDINARY (IF IT EXISTS)
            if (croppedImageBlob) {
                // Get the secure signature from your backend
                const { data: signatureData } = await axios.get<CloudinarySignatureResponse>("http://localhost:3000/api/v1/cloudinary-signature");
                
                // Prepare form data for Cloudinary
                const formData = new FormData();
                formData.append("file", croppedImageBlob, "profile.jpg");
                formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
                formData.append("timestamp", String(signatureData.timestamp));
                formData.append("signature", signatureData.signature);

                // Upload directly to Cloudinary
                const cloudinaryRes = await axios.post<CloudinaryUploadResponse>(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
                profilePictureUrl = cloudinaryRes.data.secure_url;
            }

            // STEP 2: SIGN UP USER WITH DATA (INCLUDING IMAGE URL)
            const res = await axios.post<SignUpApiResponse>("http://localhost:3000/api/v1/signup", {
                name,
                email,
                password,
                profilePictureUrl // This will be the URL from Cloudinary or an empty string
            });

            // Handle successful signup
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                navigate("/");
            } else {
                // Handle cases where signup is successful but no token is returned
                // Maybe navigate to the signin page with a success message
                navigate("/api/v1/signin");
            }

        } catch (error: any) {
            if (isAxiosError(error)) {
                setErrorMsg(error.response?.data?.message || "An error occurred during signup.");
            } else {
                setErrorMsg("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {imageSrc && (
                <ImageCropper
                    imageSrc={imageSrc}
                    onCropComplete={onCropComplete}
                    onClose={() => setImageSrc(null)}
                />
            )}
            <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50">
                <form onSubmit={handleSignUp} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm h-fit bg-[#daedeb] rounded-lg border border-gray-300 shadow-2xl space-y-3 p-4">
                    <div className="flex justify-end items-center">
                        <button type="button" onClick={onClose} aria-label="Close modal">
                            <Icon.CloseIcon className="w-5 fill-[#438989] cursor-pointer" />
                        </button>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-2">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <img src={croppedImageUrl || 'https://res.cloudinary.com/drqcrqxnz/image/upload/v1744918893/user_riupmv.png'} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border-2 border-[#438989] cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-[#438989] underline">
                            {croppedImageUrl ? 'Change Picture' : 'Add Picture'}
                        </button>
                    </div>

                    <InputBox name="name" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <InputBox name="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputBox name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    
                    {errorMsg && <div className="text-xs text-center text-red-500 pt-1">{errorMsg}</div>}
                    
                    <div className="flex flex-col justify-center items-center pt-2">
                        <Button title={loading ? "Signing Up..." : "Sign Up"} type="submit" disabled={loading} />
                        <p className="text-gray-600 text-sm mt-2 mb-1">
                            Already have an account? <span className="cursor-pointer text-gray-800 underline" onClick={() => navigate("/signin")}>Sign In</span>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
}