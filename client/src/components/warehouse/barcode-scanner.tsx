/**
 * Barcode Scanner Component
 * 
 * This component provides barcode/QR code scanning functionality for warehouse operations.
 * It handles camera initialization, barcode detection, and provides scan results.
 */
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, ZapOff, Check } from 'lucide-react';
import { ScanType, ScanResult } from '../../shared/warehouse-types';

interface BarcodeScannerProps {
  onScanComplete: (result: ScanResult) => void;
  onCancel: () => void;
  expectedValue?: string;
  scanLabel?: string;
  scanTypes?: ScanType[];
}

// Mock function to simulate barcode scanning for development
const mockScanBarcode = (expectedValue?: string): Promise<ScanResult> => {
  return new Promise((resolve) => {
    const mockCodes = [
      { value: "WH-ITEM-1001", type: "barcode" as ScanType },
      { value: "WH-ITEM-1002", type: "barcode" as ScanType },
      { value: "WH-LOC-A1-R2-B3", type: "qrcode" as ScanType },
      { value: "123456789012", type: "barcode" as ScanType },
    ];
    
    // Get current user from session storage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const username = user.username || 'warehouse_staff';
    
    // If expected value is provided, use it with 80% probability
    if (expectedValue) {
      if (Math.random() < 0.8) {
        setTimeout(() => {
          resolve({
            success: true,
            scanType: "barcode",
            scannedValue: expectedValue,
            timestamp: new Date().toISOString(),
            scannedBy: username,
            matchesExpected: true
          });
        }, 1500);
        return;
      }
    }
    
    // Otherwise use a random value
    const randomIndex = Math.floor(Math.random() * mockCodes.length);
    const randomCode = mockCodes[randomIndex];
    
    setTimeout(() => {
      resolve({
        success: true,
        scanType: randomCode.type,
        scannedValue: randomCode.value,
        timestamp: new Date().toISOString(),
        scannedBy: username,
        matchesExpected: expectedValue === randomCode.value
      });
    }, 1500);
  });
};

export function BarcodeScanner({ 
  onScanComplete, 
  onCancel, 
  expectedValue, 
  scanLabel = "Scan Barcode",
  scanTypes = ["barcode", "qrcode"]
}: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerAreaRef = useRef<HTMLDivElement>(null);

  // Simulate camera initialization
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isScanning) {
      timeout = setTimeout(() => {
        setIsCameraReady(true);
      }, 1000);
    }
    
    return () => {
      clearTimeout(timeout);
      setIsCameraReady(false);
    };
  }, [isScanning]);

  // Start scanning process
  const startScanning = async () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    
    try {
      // In a real implementation, we would initialize the camera and barcode detection library here
      // For now, we'll use our mock function
      const result = await mockScanBarcode(expectedValue);
      setScanResult(result);
      
      // Automatically submit after a brief delay to show the result
      setTimeout(() => {
        onScanComplete(result);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan barcode';
      setError(errorMessage);
      setIsScanning(false);
      
      setScanResult({
        success: false,
        scanType: "manual",
        scannedValue: "",
        timestamp: new Date().toISOString(),
        scannedBy: JSON.parse(sessionStorage.getItem('user') || '{}').username || 'warehouse_staff',
        matchesExpected: false,
        errorMessage
      });
    }
  };

  // Cancel the scanning process
  const cancelScanning = () => {
    setIsScanning(false);
    setScanResult(null);
    setError(null);
    onCancel();
  };

  // Manually enter a code instead of scanning
  const handleManualEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const manualCode = formData.get('manualCode') as string;
    
    if (manualCode && manualCode.trim()) {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const username = user.username || 'warehouse_staff';
      
      onScanComplete({
        success: true,
        scanType: "manual",
        scannedValue: manualCode.trim(),
        timestamp: new Date().toISOString(),
        scannedBy: username,
        matchesExpected: expectedValue === manualCode.trim()
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h3 className="text-xl font-semibold">{scanLabel}</h3>
      
      {!isScanning ? (
        <div className="flex flex-col items-center gap-4">
          <Button 
            onClick={startScanning}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Start Scanning
          </Button>
          
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Or enter code manually
          </div>
          
          <form onSubmit={handleManualEntry} className="flex gap-2">
            <input 
              type="text" 
              name="manualCode"
              className="px-3 py-2 border rounded-md"
              placeholder={expectedValue || "Enter code..."}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-4">
          {/* Scanner animation */}
          <div 
            ref={scannerAreaRef}
            className="relative w-64 h-64 border-2 border-primary rounded-md overflow-hidden bg-black/20"
          >
            {isCameraReady ? (
              <>
                {/* This would be a real video feed in production */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-full h-1 bg-red-500 opacity-70 absolute animate-[scanline_2s_ease-in-out_infinite]" 
                    style={{
                      boxShadow: '0 0 4px rgba(255, 0, 0, 0.7)'
                    }}
                  />
                </div>
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover opacity-40"
                  poster="/assets/scanner-placeholder.png"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-2 text-sm">Initializing camera...</p>
              </div>
            )}
            
            {/* Scan result overlay */}
            {scanResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <Check className="w-12 h-12 text-green-500 mb-2" />
                <p className="text-white text-lg font-bold">{scanResult.scannedValue}</p>
                <p className="text-white/80 text-sm">
                  {scanResult.scanType === "barcode" ? "Barcode" : 
                   scanResult.scanType === "qrcode" ? "QR Code" : "Code"} detected
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <ZapOff className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={cancelScanning}
          >
            Cancel
          </Button>
        </div>
      )}
      
      {expectedValue && (
        <div className="mt-2 text-sm text-muted-foreground">
          Expected: <span className="font-mono">{expectedValue}</span>
        </div>
      )}
    </div>
  );
}

// Style for scanner animation
const scanLineAnimation = `
@keyframes scanline {
  0% {
    top: 0%;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0%;
  }
}
`;

// Inject the animation styles into the document
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = scanLineAnimation;
  document.head.appendChild(styleEl);
}