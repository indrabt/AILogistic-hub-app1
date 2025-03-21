/**
 * Image Uploader Component
 * 
 * This component handles image uploads for warehouse documents, particularly
 * for capturing images of damaged or discrepant items.
 */
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploaderProps {
  onImageCapture: (imageData: string) => void;
  maxImages?: number;
  existingImages?: string[];
}

export function ImageUploader({
  onImageCapture,
  maxImages = 3,
  existingImages = []
}: ImageUploaderProps) {
  const [capturedImages, setCapturedImages] = useState<string[]>(existingImages);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isMobileCameraActive, setIsMobileCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Check if camera capture is supported
  const isCameraSupported = 
    typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia;
  
  // Start camera capture
  const startCamera = async () => {
    setIsCapturing(true);
    
    if (isCameraSupported && videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'environment', // Use rear camera on mobile if available
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsMobileCameraActive(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        // Fall back to file upload if camera access fails
        setIsMobileCameraActive(false);
      }
    } else {
      // Fall back to file upload if camera not supported
      setIsMobileCameraActive(false);
    }
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data as base64 string
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Add to captured images
        const newImages = [...capturedImages, imageData];
        setCapturedImages(newImages);
        onImageCapture(imageData);
        
        // Stop camera if max images reached
        if (newImages.length >= maxImages) {
          stopCamera();
        }
      }
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
    setIsMobileCameraActive(false);
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          const imageData = e.target.result;
          const newImages = [...capturedImages, imageData];
          setCapturedImages(newImages);
          onImageCapture(imageData);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...capturedImages];
    newImages.splice(index, 1);
    setCapturedImages(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Captured images gallery */}
      {capturedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {capturedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Captured image ${index + 1}`} 
                className="h-32 w-full object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Camera capture UI */}
      {isCapturing && (
        <div className="rounded-md border bg-muted/50 p-4">
          {isMobileCameraActive ? (
            <div className="space-y-4">
              <div className="relative w-full h-64 bg-black flex items-center justify-center overflow-hidden rounded-md">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={stopCamera}
                >
                  Cancel
                </Button>
                
                <Button 
                  type="button"
                  onClick={captureImage}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Capture
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Camera access not available. Please upload an image instead.
              </p>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Select Image
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCapturing(false)}
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Upload controls */}
      {!isCapturing && capturedImages.length < maxImages && (
        <div className="flex gap-2">
          {isCameraSupported && (
            <Button
              type="button"
              variant="outline"
              onClick={startCamera}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Capture Image
            </Button>
          )}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
      
      {/* Status message */}
      {capturedImages.length >= maxImages && (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Check className="h-3 w-3 text-green-500" />
          Maximum number of images reached ({maxImages})
        </p>
      )}
      
      {capturedImages.length > 0 && capturedImages.length < maxImages && (
        <p className="text-sm text-muted-foreground">
          {capturedImages.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}